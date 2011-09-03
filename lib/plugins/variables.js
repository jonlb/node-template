
var Template = require('../template').Template,
    Promise = require('promise').Promise;


var plugin = exports.plugin = new Class({
    
    param: null,
    
    filters: null,
    
    initialize: function (params) {
        //separate out the filters if there are any
        if (params.length > 1) {
            //it was split on spaces so there may be more text... 
            //put it back together then do our work
            params = params.join(' ');
        } else {
            params = params[0];
        }
        if (params.contains('|')) {
            params = params.split('|');
        } 
        
        
        if (typeOf(params) == 'array' && params.length > 0) {
            this.param = params.shift();
            this.filters = params;
        } else {
            this.param = params;
        }
    },
    
    render: function (ctx) {
        var p = new Promise();
        
        var value = Object.getFromPath(ctx,this.param);
        
        if (this.filters !== null && this.filters !== undefined) {
            this.filters.each(function(filter){
                //strip off any parameters
                var f, params;
                if (filter.contains('(')) {
                    f = filter.split('(');
                    filter = f.shift();
                    if (f[0] == '\',\')') {
                        //then 
                        params = [','];
                    } else { 
                        params = f[0].split(',');
                        //pull the ) off the last one
                        params[params.length-1] = params[params.length -1].replace(')','');
                    }
                }
                
                filter = Template.getFilter(filter);
                if (!nil(filter)) {
                    value = filter.filter(value,params);
                }
            },this);
        }
        
        p.resolve(value);
        
        return p;
    }
    
});


plugin.start = '{';
plugin.end = '}';
plugin.wrap = false;
plugin.$name = 'variables';


Template.add(plugin);

