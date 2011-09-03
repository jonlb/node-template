
var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'upper',
    filter: function (value,params){
        return value.toUpperCase();
    }
};


Template.addFilter(filter);

