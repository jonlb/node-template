

var Template = require('../template').Template,
    Promise = require('promise').Promise;


var plugin = exports.plugin = new Class({
    
    initialize: function (params, body, template) {
        this.variable = params[0];
        this.body = body;
        this.template = template;
    },
    
    render: function (ctx) {
        var p = new Promise();
        
        if (typeof ctx[this.variable] !== 'undefined') {
            p.resolve(ctx[this.variable]);
        } else {
            var t = new Template(this.template.options);
            t.setTemplate(this.body);
            t.render(ctx).then(function(result){
                ctx[this.variable] = result;
                p.resolve('');
            }.bind(this));
        }
        
        return p;
    }
    
});


plugin.fn = true;
plugin.wrap = true;
plugin.$name = 'block';
plugin.start = '+';
plugin.end = '+';
plugin.useParam = true;
plugin.preprocess = false;
plugin.placeholder = false;
plugin.postprocess = false;


Template.add(plugin);