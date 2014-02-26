/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': '../lib/jquery/jquery',
        'gmodel': '../src/gmodel'
    }
});

define(['gmodel', 'jquery'], function (Gmodel, $) {
    console.log('Loading');
	var gmodel = new Gmodel();
	gmodel.init();
});