
var Template = require('../lib/template'),
    fs = require('fs'),
    tpl = fs.readFileSync('./filters.tpl', 'utf-8'),
    t;
    
Template.init([
    __dirname + '/../lib/plugins',
    __dirname + '/../lib/plugins/filters'
]);
t = new Template.Template({
    basePaths: [__dirname]    
});
t.setTemplate(tpl);
t.render({
    title: 'test template',
    date: 'Saturday, August 28, 2011',
    word: 'test',
    upper: 'TEST',
    test: null,
    arr: ['one','two','three'],
    obj: {
        val1: 'one',
        val2: 'two',
        arr: ['three','four','five']
    },
    html: '<p>this is some html</p>'
}).then(function(output){
    console.log(output);
});