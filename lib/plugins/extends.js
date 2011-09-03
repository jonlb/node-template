

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
        
        //find the file
        Template.paths.each(function(p){
            if (path.existsSync(p + '/' + this.file + '.tpl')) {
                this.file = path.normalize(p + '/' + this.file + '.tpl');
            }
        },this);
        //load it
        str = fs.readFileSync(this.file,'utf-8');
        //create a new template from it
        t = new Template(this.template.options);
        t.setTemplate(str);
        //process it
        t.render(ctx).then(function(results){
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