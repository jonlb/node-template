

var Template = require('../template').Template,
    Promise = require('promise').Promise,
    util = require('util');


var plugin = exports.plugin = new Class({
    
    mode: 'array',
    items: null,
    keys: null,
    output: null,
    
    initialize: function (params, body) {
        this.body = new Template();
        this.body.setTemplate(body);
        this.param = params[0];
        
    },
    
    render: function (ctx, promise) {
        var obj = ctx[this.param],
            result = '';
        
        this.output = '';
        if (typeOf(obj) == 'array') {
            this.items = obj;
            var str = util.inspect(this.items,false,null);
            logger.debug('the items in each' + str);
        } else {
            this.mode = 'object';
            this.items = Object.values(obj);
            logger.debug('the items in each:' + util.inspect(this.items,false,null));
            this.keys = Object.keys(obj);
            logger.debug('the keys in each:' + util.inspect(this.keys,false,null));
        }
        
        return this.doIt(ctx);
    },
    
    doIt: function(ctx, promise) {
        
        if (promise === undefined || promise === null) {
            promise = new Promise();
        }
        
        if (this.items.length > 0) {
            ctx.item = this.items.shift();
            if (this.mode == 'object') {
                ctx.key = this.keys.shift();
            }
            logger.debug('the context:' + util.inspect(ctx,false,null));
            this.body.render(ctx).then(function(result){
                logger.debug('return from body.render: ' + util.inspect(result));
                this.output += result;
                this.doIt(ctx, promise);
            }.bind(this));
        } else {
            promise.resolve(this.output);
        }
        
        return promise;
    }
    
});


plugin.fn = true;
plugin.wrap = true;
plugin.$name = 'each';


Template.add(plugin);

