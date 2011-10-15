

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
        var p = new Promise();
        
        //check if this is a variable or a string
        if (this.file.contains('\'')) {
            this.file = this.file.replace(/\'/g,'');
        } else {
            this.file = Object.getFromPath(ctx,this.file);
        }
        
        //retrieve and process the template
        this.template.getTemplate(this.file,true).render(ctx).then(function(results){
            p.resolve(results);
        }.bind(this));
        
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