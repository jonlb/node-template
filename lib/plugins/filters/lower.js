
var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'lower',
    filter: function (value,params){
        return value.toLowerCase();
    }
};


Template.addFilter(filter);

