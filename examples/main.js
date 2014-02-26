/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'gmodel': 'gmodel'
    }
});

define(['gmodel'], function (Gmodel) {
    console.log('Loading');
	var gmodel = new Gmodel();
	gmodel.init();
});