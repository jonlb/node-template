

var Tokenizer = exports.Tokenizer = new Class({
    
    Implements: [Options, Events],
    
    options: {
        start: '{',
        end: '}'
    },
    
    template: null,
    
    /**
     * template is the Template Class
     */
    initialize: function (template, options) {
        this.setOptions(options); 
        this.template = template;
    },
    
    /**
     * pull substrings out of the given string by the following rules.
     * 
     *  - anything not inside a token or between start/end tokens gets saved 
     *      as a pure string.
     *  - all tokens start with this.options.start and end with this.options.end
     *  - all tokens will start with 1 additional character (i.e. {{, {!, {+, etc..)
     *  - this.template.getTokenClass() is used to get additional details about the
     *        token.
     *  - token classes are created and saved back into the template
     *  - {@ indicates functions
     * 
     */
    tokenize: function (str) {
        var t = this.template,
            params,
            body,
            token,
            pp = [];
            
        while (str.length > 0) {
            //find first brace
            var index = str.indexOf('{');
            if (index > 0) {
                //pull off all of the leading text and save it
                t.tokens.push(str.substring(0,index));
                //cut the text off the begining of the string.
                str = str.substring(index,str.length).trim();
            } else if (index == -1) {
                t.tokens.push(str);
                str = '';
            } else {
                //grab the starting token
                var plugin,
                    start = str.substr(0,2),
                    end;
                    
                //grab all of the params
                if (start[1] == '{') {
                    end = '}}';
                } else {
                    end = start[1] + '}';
                }
                var i = str.indexOf(end),
                    fnTxt = str.substring(2,i).trim(),
                    fn = null;
                params = fnTxt.split(' ');
                str = str.substring(i+2,str.length).trim();
                
                
                //if start is {@ then get the first word in the string after it
                //which would be the function name.
                
                if (start == '{@') {
                    start = params.shift();
                    if (start.contains('.')) {
                        var parts = start.split('.');
                        start = parts[0];
                        fn = parts[1];
                    }   
                }
                plugin = t.getTokenClass(start);
                if (plugin !== null && plugin !== undefined) {
                    
                    if (plugin.wrap) {
                        //get everything up to the closing tag
                        var closing;
                        if (plugin.fn && !plugin.useParam) {
                            closing = '{@/ ' + plugin.$name + ' @}';
                        } else if (plugin.useParam && typeof plugin.end !== 'undefined') {
                            closing = '{' + plugin.end + '/ ' + params[0] + ' ' + plugin.end + '}';
                        } else {
                            closing = '{' + plugin.end + '/ ' + plugin.$name + ' ' + plugin.end + '}';
                        }
                        var iClose = str.indexOf(closing);
                        body = str.substring(0,iClose);
                        str = str.substring(iClose + closing.length,str.length).trim();
                        token = new plugin(params,body,t);
                    } else {
                        token = new plugin(params,t);
                    }
                    if (fn !== null && fn !== undefined) {
                        token.fnName = fn;   
                        logger.debug('adding function name (' + fn + ') to plugin (' + plugin.$name + ')');
                    }
                    if (plugin.placeholder) {
                        //add a placeholder
                        t.tokens.push('');
                        //give the token a reference to the place in the queue
                        token.holder = t.tokens.length - 1;
                    }
                    if (plugin.preprocess) {
                        //add the actual token to the top of the queue so it 
                        //will be processed before the rest of the template
                        t.preprocess.push(token);
                    } else  if (plugin.postprocess) {
                        //hold this till we're done
                        t.postprocess.push(token);
                    } else {
                        t.tokens.push(token);
                    }
                } else {
                    //just strip the tag and contents out.
                    var ending = start[1] + '}',
                        i = str.indexOf(ending);
                    str = str.substring(i+2,str.length);
                }
                
            }  
        }
    }
});