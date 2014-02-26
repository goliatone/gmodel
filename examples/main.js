/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'gmodel': 'gmodel'
    }
});

define(['gmodel'], function (Gmodel) {
    console.log('Loading');
    var config = {data:{name:'goliatone', age:32}};
	var gmodel = new Gmodel(config);

	gmodel.format('name', function(name){ return name+'!'; });
	
	console.log(gmodel.get('name'));

	window.gmodel = gmodel;
});