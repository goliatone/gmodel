/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'user': 'user',
        'gpub':'components/gpub/gpub',
        'jquery':'jquery/jquery'
    }
});

define(['gmodel', 'gpub','jquery'], function (Gmodel, Gpub, $) {
    console.log('Loading');
    var config = {data:{name:'goliatone', age:32}};
	var user = new Gmodel(config);
	user.validator(function(model){
		if(model.get('age') > 33) model.error('age', 'User is actually younger!');
	});

	var handleChanges = function handleChanges(event){
		console.log('Model udpate', event.property, 'from', event.old, 'to', event.value);
		$('.'+ event.property, '#'+ user.get('id')).html(event.value);
	};

	user.on('change', handleChanges);

	user.format('name', function(name){ return name+'!'; });

	user.set('id', 'user');
	user.set('name', 'Goliatone');
	user.set('age', 33);

	window.user = user;
});
