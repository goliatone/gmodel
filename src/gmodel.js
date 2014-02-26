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
}(this, 'GModel', function() {

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
        this.init(config.data);
    };



///////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////

    GModel.prototype.init = function(data){
        console.log('GModel: Init!');
        this.attributes = data || {};
        this.dirty = {};
        return 'This is just a stub!';
    };

    GModel.prototype.get = function(key, def){
        var value = this.attributes[key] || def,
            formatter = this.formatters[key];
        if(!formatter) return value;
        //TODO: Should we enable multiple formatters?
        return formatter.fn.call(formatter.scope, value);
    };

    GModel.prototype.set = function(key, value){
        this.attributes[key] = value;
        this.dirty[key] = value; //TODO: We can remove this...it should be sync.

        return this;
    };

    GModel.prototype.alias = function(key, formatter){

        return this;
    };

    GModel.prototype.has = function(key){
        return this.attributes.hasOwnProperty(key);
    };

    GModel.prototype.del = function(key){
        if(! this.has(key)) return this;
        delete this.attributes[key];
        delete this.dirty[key];
        return this;
    };

    GModel.prototype.toJSON = function(){
        return _extend({}, this.attributes);
    };

    GModel.prototype.fromJSON = function(data){
        this.init(data);
        return this;
    };

    GModel.prototype.changed = function(attributes){
        if(typeof attributes === 'string') return !! this.dirty[attributes];

        var ouput = {};
        for(var attribute in this.dirty) ouput[attribute] = this.dirty[attribute];

        return ouput;
    };

    GModel.prototype.walk = function(callback, scope) {
        scope || (scope = this);

        Object.keys(this.attributes).forEach(function(key){
            callback.call(scope, this.attributes[key], this.attributes);
        },this);

        return this;
    };


    GModel.prototype.format = function(id, callback, scope) {
        this.formatters[id] = {fn:callback, scope:(scope || this)};
        return this;
    };

    GModel.prototype.use = function(plugin, scenario){
        plugin(this, scenario);
        return this;
    };

    //TODO: Handle virtual attributes.
    GModel.prototype.compute = function(key, set, get){

    };

///////////////////////////////////////////////
///////////////////////////////////////////////

    GModel.prototype.validate = function(){
        var fns = this.validators || [];
        this.errors = [];
        for(var i = 0, t = fns.length; i < t; ++i) fns[i](this);
        
        if(this.errors.length) this.emit('invalid');
        else this.emit('valid');

        return this;
    };

    //TODO: Move to plugin?
    GModel.prototype.validator = function(validator){
        this.validators || (this.validators = []);

        this.validators.push(validator);
        return this;
    };

    GModel.prototype.error = function(key, message){
        this.errors.push({key:key, message:message});
    };

    return GModel;
}));