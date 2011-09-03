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

Once installed, you can use the engine in javascript like so (taken from basic.js in the examples folder):

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

//Now pass it your template as a string. Eventually this will take a filename
//but I haven't gotten there yet.
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

The above code is for rendering this template:

```html
{*
An exmple of a basic template. This is a block comment that will be stripped.
*}
{= var1 'some random text' =}
{= var2 354 =}
<html>
<head>
  <title>{{title}}</title>
</head>
<body>
  <p>{{content}}</p>
  <p>{{test3.some.nested.var}}</p>
  <P>
    {@ if test @}
        test defined
    {e} 
        test not defined
    {@/ if @}
  </p>
  <p>
    {@ if test && test2>0 @}
        {{compoundIf}}
    {@/ if @}
  </p>
  <ul>
    {@ each testEach1 @}
        <li>{{item}}</li>
    {@/ each @}
  </ul>
  <ul>
    {@ each testEach2 @}
        <li>{{key}}, {{item}}</li>
    {@/ each @}
  </ul>
  <p>The value of the assign at the top of the template is {{var1}}</p>
  <p>And the second one was {{var2}}</p>
  {! 'footer' !}
</body>
</html>
```

You can see more examples in the examples directory. Every current function and
filter is covered in the examples.

##Extending node-template

You can extend node template by writing your own plugins and filters. This system
uses mootools at it's base so if your familiar with it this should be relatively
easy to understand.

###Plugins

All plugins are mootools Class objects. They must each have 2 methods at minimum:
initialize and render. Here's what a basic plugin looks like:

```js
var Template = require('../template').Template,
    Promise = require('promise').Promise;

//Create your plugin
var plugin = exports.plugin = new Class({
  //initialize accepts an array of params, any body templating, and a reference to the template class
  initialize: function(params,body,template){},
  //render gets an object that contains the context (basically a data object)
  render: function(ctx){}
});

//What follows here is the important stuff for making sure the tokenizer 
//will recognize and correctly parse/render your markup

//indicates the starting mark for your tags which in this case will be {!
plugin.start = '!';  
//indicates the closing mark. Will be !}
plugin.end = '!' 
//whether your plugin expects a body (the stuff between 
//{! plugin !} and {!/ plugin !}
plugin.wrap = false;  
//the name of your plugin. This must be unique in the system
plugin.$name = 'include';  
//indicator as to whether this plugin should be processed before 
//the bulk of the template (such as includes)
plugin.preprocess = true;  
//whether we need a placeholder within the body of the template to put 
//our output. Has no meaning or effect without preprocess=true
plugin.placeholder = true;  
//whether the plugin should be processed after everything else (such as extends).
plugin.postprocess = false; 

//register your plugin by calling
Template.add(plugin);
```

###Filters

Filters are just plain objects. You create them like so:

```js
var Template = require('../../template').Template,
    Promise = require('promise').Promise;

var filter = exports.filter = {
    //The name of your filter. Used in the template after the | symbol. Must be unique.
    $name: 'lower',
    //the filter itself. Takes the value to be filtered and any params that were passed (broken up on commas).
    filter: function (value,params){
        return value.toLowerCase();
    }
};

//Register your filter by calling
Template.addFilter(filter);
```

###ToDo list

First, feel free to send me ideas or file tickets in the issues. Here is a list
of what I'm going to be trying to get done eventually:

* More plugins
  * creating style elements
  * creating link elements (for js files)
  * possibly for handling html generation itself (though I'm not sure I want to add this)


