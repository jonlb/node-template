#node-template

A pretty basic templating engine for node. Partially inspired by [Twig](http://twig.sensiolabs.org/)

##Supported operations

node-template currently supports the following:

* includes/partials
* basic if statements
* iteration or arrays and objects using each
* comments (stripped from final output)
* assigning variables in the template as needed
* basic inheritance using extends and blocks
* output of variables with the following filters:
  * capitalize 
  * date
  * default
  * escape
  * join
  * json_encode
  * lower
  * title
  * upper

The templating system also has the ability to be easily extended for anything else that might be needed via
plugins and filters.

##Using node-template

The prefered method of installing is via git submodule. I may delve into packaging for NPM at some point if 
people want it. I don't really use NPM and like to have absolute control over my code and dependencies so I 
prefer submodules.

Once installed, you can use the engine like so (taken from basic.js in the examples folder):

```js
var Template = require('../lib/template'),
    fs = require('fs'),
    tpl = fs.readFileSync('./basic.tpl', 'utf-8'),
    t;

//First initialize the engine by telling it where the plugins and 
//filters are located. Add your own paths if you have custom ones.
//Be sure to include the paths to the ones provided as done here
Template.init([
    __dirname + '/../lib/plugins',
    __dirname + '/../lib/plugins/filters'
]);

//create the template object and pass it an array of paths where it 
//can find your templates. If you don't it won't be able to find
//templates referenced in the extends or include tags
t = new Template.Template({
    basePaths: [__dirname]    
});

//Now pass it your template as a string
t.setTemplate(tpl);

//now render that template. render() actually returns a promise
//which allows us to wait until it's done and then we simply output
//to the console
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
```


