
var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'title',
    filter: function (value,params){
        return value.capitalize();
    }
};


Template.addFilter(filter);

