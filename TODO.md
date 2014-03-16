## BINDING

### ONE WAY BINDING: model to view
We should implment, at least, a model to view binding mechanism.

Two actors, a model emitting change events per property, and a view that displays the model. The model should have it's properties mapped to a view's attributes.
- How to target and map properties to attributes? It should work from a loaded HTML templated rendered by the server.
- We should be able to hidrate a model from HTML markup, as rendered by the server.
- How to transform data on per binding instance level?
- We should be able to have a two phase cycle on bindings, first we have an view.update method, and a view.afterUpdate method. Reduce layout trashing, register view with rendering strategy.
- Mapping of model attribute to view's HTML DOM state, eg: Boolean values to visible/hidden class/function.
- We should be able to trigger DOM events from the view.

* `copyModelToView`
* `copyViewToModel`

```javascript
setElAttribute:function (el, elementBinding, convertedValue) {
            switch (elementBinding.elAttribute) {
                case 'html':
                    el.html(convertedValue);
                    break;
                case 'text':
                    el.text(convertedValue);
                    break;
                case 'enabled':
                    el.prop('disabled', !convertedValue);
                    break;
                case 'displayed':
                    el[convertedValue ? 'show' : 'hide']();
                    break;
                case 'hidden':
                    el[convertedValue ? 'hide' : 'show']();
                    break;
                case 'css':
                    el.css(elementBinding.cssAttribute, convertedValue);
                    break;
                case 'class':
                    var previousValue = this._model.previous(elementBinding.attributeBinding.attributeName);
                    var currentValue = this._model.get(elementBinding.attributeBinding.attributeName);
                    // is current value is now defined then remove the class the may have been set for the undefined value
                    if(!_.isUndefined(previousValue) || !_.isUndefined(currentValue)){
                        previousValue = this._getConvertedValue(Backbone.ModelBinder.Constants.ModelToView, elementBinding, previousValue);
                        el.removeClass(previousValue);
                    }

                    if(convertedValue){
                        el.addClass(convertedValue);
                    }
                    break;
                default:
                    el.attr(elementBinding.elAttribute, convertedValue);
            }
        },
```

```javascript
_setElValue:function (el, convertedValue) {
            if(el.attr('type')){
                switch (el.attr('type')) {
                    case 'radio':
                        el.prop('checked', el.val() === convertedValue);
                        break;
                    case 'checkbox':
                         el.prop('checked', !!convertedValue);
                        break;
                    case 'file':
                        break;
                    default:
                        el.val(convertedValue);
                }
            }
            else if(el.is('input') || el.is('select') || el.is('textarea')){
                el.val(convertedValue || (convertedValue === 0 ? '0' : ''));
            }
            else {
                el.text(convertedValue || (convertedValue === 0 ? '0' : ''));
            }
        },
```


## Plugins:
- Sync: simple plugin to accommodate server side syncronization
    - REST
    - localStorage/IndexDB- some sort of local storage wrapper.
    - WebSockets?

- Binding 