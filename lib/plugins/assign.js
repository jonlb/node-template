

var Template = require('../template').Template,
    Promise = require('promise').Promise;


var plugin = exports.plugin = new Class({
    
    initialize: function (params) {
        this.params = params;
    },
    
    render: function (ctx) {
        var p = new Promise(),
            param = this.params.shift();
        
        //assign the variable
        
        ctx[param] = this.params.join(' ').replace(/\'/g,'');
        p.resolve('');
        return p;
    }
    
});


plugin.start = '=';
plugin.end = '=';
plugin.wrap = false;
plugin.$name = 'assign';


Template.add(plugin);

