
var Template = require('../lib/template'),
    fs = require('fs'),
    t;
    
Template.init([
    __dirname + '/../lib/plugins',
    __dirname + '/../lib/plugins/filters'
]);
Template.scanDirectory(__dirname,{});
var t = Template.Template.getTemplate('basic',false);
t.render({
    title: 'Test Template',
    test: true,
    test2: 3,
    test3: {
        some: {
            nested: {
                'var': 'Found the nested variable.'
            }
        }
    },
    compoundIf: 'Compound if works!!',
    testEach1: ['one','two', 'three','four','five'],
    testEach2: {
        key1: 'one',
        key2: 'two',
        key3: 'three',
        key4: 4,
        key5: 'five'
    },
    content: 'This is a test template'
}).then(function(output){
    console.log(output);
});