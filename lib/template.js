/**
 * node-template is yet anothe templating engine for node. 
 * 
 * The biggest reason I wanted to write this is that I have yet to find 
 * a javascript templating solution that allows partials (or blocks) from other 
 * files to manipulate the context of the parent (the file including or calling 
 * the lower file). node-template will hopefully allow this as well as supporting 
 * the following features:
 * 
 *   - partials
 *   - inheritance
 *   - printing variables
 *   - iteration over arrays and objects
 *   - custom rendering functions
 * 
 * This will all be done through the use of plugins to tokenize the template which 
 * will then be rendered by calling each token class in turn.
 */
 
if (typeof MooTools == 'undefined') {
    require('mootools').apply(GLOBAL);
}

var winston = require('winston'),
    util = require('util'),
    walker = require('walker'),
    Tokenizer = require('./tokenizer').Tokenizer,
    Promise = require('promise').Promise,
    fs = require('fs'),
    p = require('path'),
    templates = {};

//add global logger if it's not already there 
if (typeof logger == 'undefined') {
    GLOBAL.logger = new (winston.Logger)({
        transports: [
            //new (winston.transports.Console)({level: "silly"}),
            new (winston.transports.File)({ filename: './template.log', level: "silly" })
        ]
    });
    logger.emitErrs = false;    
}
 
var Template = exports.Template = new Class({
     
    Implements: [Options, Events],
     
    options: {
        basePaths: []
    },
     
    template: null,
     
    tokens: null,
    
    preprocess: null,
    
    postprocess: null,
     
    tokenizer: null,
    
    output: null,
    
    index: 0,
     
    initialize: function (options) {
        this.setOptions(options);
         
        this.tokens = [];
        this.output = '';
        this.preprocess = [];
        this.postprocess = [];
         
        //look for tokenizer... if not there create one
        if (this.options.tokenizer) {
            this.tokenizer = this.options.tokenizer;
        } else {
            this.tokenizer = new Tokenizer(this,{});
        }
        
        this.options.basePaths.each(function(path){
            Template.addPath(path);
        });
    },
     
    setTemplate: function(template) {
        this.template = template;
        this.tokenizer.tokenize(template);
    },
    
    render: function(ctx){
        //loop through the tokens concatenating the result of .render() to the
        //output string
        var promise = new Promise();
        promise.id = String.uniqueID();
        logger.info('starting promise ' + promise.id);
        this.index = 0;
        this.output = '';
        this.currentQueue = this.preprocess;
        this.processQueue(ctx).then(function(){
            this.index = 0;
            this.currentQueue = this.tokens;
            return this.processQueue(ctx);
        }.bind(this)).then(function(){
            this.index = 0;
            this.currentQueue = this.postprocess;
            return this.processQueue(ctx);
        }.bind(this)).then(function(){
            logger.info('resolving promise ' + promise.id);
            promise.resolve(this.output.trim());
        }.bind(this));
        
        return promise;
    },
    
    processQueue: function(ctx,promise) {
        var queue = this.currentQueue;
        if (promise === undefined || promise === null) {
            promise = new Promise();
        }
        if (this.index < queue.length) {
            var token = queue[this.index];
            if (typeof token == 'string') {
                this.output += token;
                this.index++;
                this.processQueue(ctx,promise);
            } else {
                token.render(ctx).then(function(result){
                    this.output += result;
                    this.index++;
                    this.processQueue(ctx,promise);
                }.bind(this));
            }
        } else {
            promise.resolve(true);
        }
        
        return promise;
    }
        
 });
 
/**
 * Allows plugins to be added to the template (both statically and per instance)
 */
Template.adders = {

    plugins: {},
    paths: [],
    filters: {},

	add : function(plugin){
		this.plugins[plugin.$name] = plugin;
		//if this is a class (this method is used by instances of Template and the Template namespace)
		//extend these validators into it
		//this allows plugins to be global and/or per instance
		if (!this.initialize){
			this.implement({
				plugins: this.plugins
			});
		}
	},

	addAllThese : function(plugins){
		Array.from(plugins).each(function(plugin){
			this.add(plugin);
		}, this);
	},

	getTokenClass: function(start){
		var fn = false,
            plugin = null;
        if (start[0] != '{' ) {
            fn = true;
        }
        for (var p in this.plugins) {
            var plug = this.plugins[p];
          if (fn && plug.fn && plug.$name == start) {
                plugin = plug;
            } else if ('{' + plug.start == start) {
                plugin = plug;
            }
        }
        return plugin;
	},
    
    addPath: function(path) {
        this.paths.push(path);
        if (!this.initialize) {
            this.implement({
                paths: this.paths
            });
        }
    },
    
    addFilter: function(filter) {
        this.filters[filter.$name] = filter;
        if (!this.initialize) {
            this.implement({
                filters: this.filters
            });
        }
    },
    
    getFilter: function(filter){
        return this.filters[filter];
    }
        

};

Object.append(Template, Template.adders);

Template.implement(Template.adders);

exports.init = function (paths) {
    //load all plugins/filters in paths
    Array.from(paths).each(function(path){
        path = fs.realpathSync(path);
        fs.readdirSync(path).each(function(file){
            var stat = fs.statSync(path + '/' + file);
            if (!stat.isDirectory()) {
                require(p.normalize(path + '/' + file));
            }
        });
    });
};
