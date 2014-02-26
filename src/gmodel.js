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
    "use strict";
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
}(this, "Gmodel", function() {

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

        if ( typeof context === "string" ) {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        if ( ! typeof(fn) === 'function') return undefined;

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
     * Gmodel constructor
     * 
     * @param  {object} config Configuration object.
     */
    var Gmodel = function(config){
        _extend(options, config || {});     
        this.init();  
    };

///////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////

    Gmodel.prototype.init = function(){
        console.log('Gmodel: Init!');
        return 'This is just a stub!';
    };
    return Gmodel;
}));