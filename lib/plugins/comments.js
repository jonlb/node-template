

var Template = require('../template').Template,
    Promise = require('promise').Promise;


var plugin = exports.plugin = new Class({
    
    initialize: function (params) {
        
    },
    
    render: function () {
        var p = new Promise();
        
        //comments are simply removed.
        p.resolve('');
        
        return p;
    }
    
});


plugin.start = '*';
plugin.end = '*';
plugin.wrap = false;
plugin.$name = 'comments';


Template.add(plugin);

