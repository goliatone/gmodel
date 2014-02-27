/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'user': 'user',
        'gpub':'components/gpub/gpub'
    }
});

define(['gmodel', 'gpub'], function (Gmodel, Gpub) {
    console.log('Loading');
    var config = {data:{name:'goliatone', age:32}};
	var user = new Gmodel(config);
	user.validator(function(model){
		if(model.get('age') > 33) model.error('age', 'User is actually younger!');
	});

	var handleChanges = function handleChanges(event){
		console.log('Model udpate', event.property, 'from', event.old, 'to', event.value);
		$('.'+ event.property,'#'+ user.get('id')).innherHTML = event.value;
	};

	user.on('change', handleChanges);

	user.format('name', function(name){ return name+'!'; });
	
	user.set('id', 'user');
	user.set('name', 'Goliatone');
	user.set('age', 33);

	window.user = user;
});

var $ = function(
  a,                         // take a simple selector like "name", "#name", or ".name", and
  b                          // an optional context, and
){
  a = a.match(/^(\W)?(.*)/); // split the selector into name and symbol.
  return(                    // return an element or list, from within the scope of
    b                        // the passed context
    || document              // or document,
  )[
    "getElement" + (         // obtained by the appropriate method calculated by
      a[1]
        ? a[1] == "#"
          ? "ById"           // the node by ID,
          : "sByClassName"   // the nodes by class name, or
        : "sByTagName"       // the nodes by tag name,
    )
  ](
    a[2]                     // called with the name.
  )
}