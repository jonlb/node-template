

var Template = require('../template').Template,
    Promise = require('promise').Promise;


var plugin = exports.plugin = new Class({
    
    initialize: function (params, body) {
        var fnTxt = 'with (ctx) {';
        
        //wrap the if inside a try/catch block incase something goes wrong
        fnTxt += 'try {';
        fnTxt += 'if (' + params.join(' ') + ') {';
        
        
         
        //check body for an else
        if (body.contains('{e}')) {
            //separate at the else
            var parts = body.split('{e}');
            this.part1 = new Template();
            this.part1.setTemplate(parts[0]);
            
            this.part2 = new Template();
            this.part2.setTemplate(parts[1]);
            
            fnTxt += 'return this.part1;';
            fnTxt += '} else {';
            fnTxt += 'return this.part2;';
            fnTxt += '}';
            fnTxt += '} catch (e) {';
            fnTxt += 'return this.part2; }';
            
        } else {
           this.part1 = new Template();
           this.part1.setTemplate(body);
           fnTxt += 'return this.part1;';
            fnTxt += '} else {';
            fnTxt += 'return \'\';';
            fnTxt += '}' ;
            fnTxt += '} catch (e) {';
            fnTxt += 'return \'\'; }';
        }
        
        fnTxt += '}';
        
        this.fn = new Function('ctx', fnTxt);
    },
    
    render: function (ctx) {
        var p = new Promise(),
            part = this.fn(ctx);
        
        if (part !== '') {
            part.render(ctx).then(function(output){
                p.resolve(output);
            });
        } else {
            p.resolve('');
        }
        
        return p;
    }
    
});


plugin.fn = true;
plugin.wrap = true;
plugin.$name = 'if';


Template.add(plugin);