

var Template = require('../template').Template,
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise').Promise;

/**
 * processes tags of the form:
 * 
 * {! variableName !}
 * 
 * or 
 * 
 * {! 'filename' !}
 */
var plugin = exports.plugin = new Class({
    
    file: null,
    
    initialize: function (params,template) {
        this.file = params[0];
        this.template = template;
    },
    
    render: function (ctx) {
        var p = new Promise(),
            str, t;
        
        //check if this is a variable or a string
        if (this.file.contains('\'')) {
            this.file = this.file.replace(/\'/g,'');
        } else {
            this.file = Object.getFromPath(ctx,this.file);
        }

        //process it
        this.template.getTemplate(this.file).render(ctx).then(function(results){
            this.template.tokens[this.holder] = results;
            p.resolve('');
        }.bind(this));
            
        return p;
    }
    
});


plugin.start = '!';
plugin.end = '!';
plugin.wrap = false;
plugin.$name = 'include';
plugin.preprocess = true;
plugin.placeholder = true;
plugin.postprocess = false;


Template.add(plugin);

