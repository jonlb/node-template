

var Template = require('../template').Template,
    path = require('path'),
    fs = require('fs'),
    Promise = require('promise').Promise;


var plugin = exports.plugin = new Class({
    
    initialize: function (params, template) {
        this.file = params[0];
        this.template = template;
    },
    
    render: function (ctx) {
        var p = new Promise(),
            file;
        
        //check if this is a variable or a string
        if (this.file.contains('\'')) {
            file = this.file.replace(/\'/g,'');
        } else {
            file = Object.getFromPath(ctx,this.file);
        }
        
        //retrieve and process the template
        var t = this.template.getTemplate(file,true);
        if (t !== null && t !== undefined) {
            t.render(ctx, this.template.prefix).then(function(results){
                p.resolve(results);
            }.bind(this));
        } else {
            p.resolve('');
        }
        
        return p;
    }
    
    
    
});


plugin.fn = false;
plugin.wrap = false;
plugin.$name = 'extends';
plugin.start = '#';
plugin.end = '#';
plugin.preprocess = false;
plugin.placeholder = false;
plugin.postprocess = true;


Template.add(plugin);