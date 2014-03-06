/*
 * gmodel
 * https://github.com/goliatone/gmodel
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function (root, name, deps, factory) {
    'use strict';
    // Node
    if(typeof deps === 'function') {
        factory = deps;
        deps = [];
    }
        
    if (typeof exports === 'object') {
        module.exports = factory.apply(root, deps.map(require));
    } else if (typeof define === 'function' && 'amd' in define) {
        //require js, here we assume the file is named as the lower
        //case module name.
        define(name.toLowerCase(), deps, factory);
    } else {
        // Browser
        var d, i = 0, global = root, old = global[name], mod;
        while((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function(){
            global[name] = old;
            return mod;
        };
    }
}(this, 'GModel', ['gpub'], function(Gpub) {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         meging target to params.
     */
    var _extend = function(target) {
        var i = 1, length = arguments.length, source;
        for ( ; i < length; i++ ) {
            // Only deal with defined values
            if ((source = arguments[i]) != undefined ){
                Object.getOwnPropertyNames(source).forEach(function(k){
                    var d = Object.getOwnPropertyDescriptor(source, k) || {value:source[k]};
                    if (d.get) {
                        target.__defineGetter__(k, d.get);
                        if (d.set) target.__defineSetter__(k, d.set);
                    } else if (target !== d.value) target[k] = d.value;                
                });
            }
        }
        return target;
    };

    /**
     * Proxy method
     * @param  {Function} fn      Function to be proxied
     * @param  {Object}   context Context for the method.
     */
    var _proxy = function( fn, context ) {
        var tmp, args, proxy, slice = Array.prototype.slice;

        if ( typeof context === 'string' ) {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        if (typeof(fn) !== 'function') return undefined;

        args = slice.call(arguments, 2);
        proxy = function() {
            return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
        };

        return proxy;
    };


///////////////////////////////////////////////////
// CONSTRUCTOR
///////////////////////////////////////////////////
	
	var options = {
        
    };
    
    /**
     * GModel constructor
     * TODO: Handle default values for model props.
     * TODO: Schema?
     * 
     * @param  {object} config Configuration object.
     */
    var GModel = function(config){
        config = _extend(options, config || {});

        this.formatters = [];
        console.log(config);
        this.init(config);
    };



///////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////
    /**
     * Initialization method. It resets the
     * model instance.
     * @param  {Object} config Options object
     * @return {this}
     */
    GModel.prototype.init = function(config){
        console.log('GModel: Init!');

        this.dirty = {};
        //TODO: Rename attributes to properties.
        this.attributes = config.data || {};
        this.aliases = config.aliases || {};
        
        return this;
    };

    /**
     * Getter method. Access a property
     * of the model by key.
     *
     * TODO: We could implement an onGet callback
     *       so we can use plugins?
     * 
     * @param  {String} key Attribute key
     * @param  {Object} def Default value if attribute
     *                      is not defined.
     * @return {Object}     Value for key attribute or
     *                      default value.
     */
    GModel.prototype.get = function(key, def){
        var value     = this.attributes[key] || def,
            formatter = this.formatters[key];
        if(!formatter) return value;
        //TODO: Should we enable multiple formatters?
        return formatter.fn.call(formatter.scope, value);
    };

    /**
     * Setter method. Set value of property
     * identified by key.
     *
     * TODO: We could implement an onSet callback
     *       so we can use plugins?
     * 
     * @event change
     * @event change:<key>
     * 
     * @param {String} key   Attribute key.
     * @param {Object} value Value object.
     * @return {this}
     */
    GModel.prototype.set = function(key, value){
        var old = this.attributes[key];
        
        if(old === value) return this;

        this.attributes[key] = value;
        this.dirty[key] = value; //TODO: We can remove this...it should be sync.
        
        //TODO: We should throttle this. Make nextTick?
        var event = {old:old, value:value, property:key};
        if(this.emits('change')) this.emit('change', event);
        if(this.emits('change:' + key)) this.emit('change:' + key, event);

        return this;
    };

    /**
     * Set alias for attribute.
     * @param  {String} key       Attribute key.
     * @param  {String} alias     New name for attribute.
     * @return {this}
     */
    GModel.prototype.alias = function(key, alias){

        return this;
    };

    /**
     * Check if attribute with key name
     * is registered.
     * @param  {String}  key Attribute key.
     * @return {Boolean}     True if hasOwnProperty key.
     */
    GModel.prototype.has = function(key){
        return this.attributes.hasOwnProperty(key);
    };

    /**
     * Delete attribute value.
     * @event delete
     * @event delete:<key>
     *
     * TODO: We could implement an onDel callback
     *       so we can use plugins?
     *
     * @param  {String} key Attribute key.
     * @return {this}
     */
    GModel.prototype.del = function(key){
        if(! this.has(key)) return this;
        var old = this.attributes[key],
            event = {old:old, property:key};
        delete this.attributes[key];
        delete this.dirty[key];

        if(this.emits('delete')) this.emit('delete', event);
        if(this.emits('delete:'+key)) this.emit('delete:'+key, event);

        return this;
    };

    /**
     * Returns an object with attributes.
     * @return {Object} Attributes values.
     */
    GModel.prototype.toJSON = function(){
        return _extend({}, this.attributes);
    };

    /**
     * Initialize model from JSON.
     * @param  {Object} data Initializer
     * @return {this}
     */
    GModel.prototype.fromJSON = function(data, options){
        this.init({data:data, options:options||{}});
        return this;
    };

    /**
     * Returns dirty attributes. Optionally, if we 
     * want to check for an specific attribute we can pass
     * the attribute name.
     * @param  {String} attribute Attributes that have been
     *                             modified.
     * @return {Boolean|Object}
     */
    GModel.prototype.changed = function(attribute){
        if(typeof attribute === 'string') return !! this.dirty[attribute];

        var ouput = {};
        for(attribute in this.dirty) ouput[attribute] = this.dirty[attribute];

        return ouput;
    };

    /**
     * Walks over all attributes and applies callback.
     * Optionally we can pass the scope.
     * @param  {Function} callback Method to apply to each
     *                             item.
     * @param  {Object}   scope
     * @return {this}
     */
    GModel.prototype.walk = function(callback, scope) {
        scope || (scope = this);

        Object.keys(this.attributes).forEach(function(key){
            callback.call(scope, this.attributes[key], this.attributes);
        },this);

        return this;
    };

    /**
     * Add formatter for a given key.
     * @param  {String}   id       Attribute key
     * @param  {Function} callback Function to apply before
     *                             getter.
     * @param  {Object}   scope
     * @return {this}
     */
    GModel.prototype.format = function(id, callback, scope) {
        this.formatters[id] = {fn:callback, scope:(scope || this)};
        return this;
    };

    /**
     * Enables plugin.
     * @param  {Function} plugin   Plugin to extend
     * @param  {String} scenario String that identifies
     *                           when it should be applied.
     * @return {this}
     */
    GModel.prototype.use = function(plugin, scenario){
        plugin(this, scenario);
        return this;
    };

    //TODO: Handle virtual attributes.
    GModel.prototype.compute = function(key, callback, set, get){
        var str = callback.toString();
        var attrs = str.match(/this.[a-zA-Z0-9]*/g);

        this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)
        for(var l = attrs.length; l--;){
            this.on('change ' + attrs[l].slice(5), function(){
                this.set(name, callback.call(this.data));
            });
        }
    };

///////////////////////////////////////////////
///////////////////////////////////////////////
    
    /**
     * Validation function.
     * TODO: Move to plugin.
     * @return {this}
     */
    GModel.prototype.validate = function(){
        var fns = this.validators || [];
        this.errors = [];
        for(var i = 0, t = fns.length; i < t; ++i) fns[i](this);
        
        if(this.errors.length && this.emits('invalid')) this.emit('invalid');
        else if(this.emits('valid')) this.emit('valid');

        return this;
    };

    /**
     * TODO: Move to plugin
     * @param  {Function} validator Validator function.
     * @return {this}
     */
    GModel.prototype.validator = function(validator){
        this.validators || (this.validators = []);

        this.validators.push(validator);
        return this;
    };

    /**
     * Set validation error.
     * @param  {String} key     Attribute key.
     * @param  {String} message Error message.
     * @return {this}
     */
    GModel.prototype.error = function(key, message){
        this.errors.push({key:key, message:message});
        return this;
    };

    Gpub.observable(GModel.prototype);

    return GModel;
}));