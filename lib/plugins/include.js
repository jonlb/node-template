

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
            str, t, file;
        
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
                this.template.tokens[this.holder] = results;
                p.resolve('');
            }.bind(this));
        } else {
            p.resolve('');
        }
        
            
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

