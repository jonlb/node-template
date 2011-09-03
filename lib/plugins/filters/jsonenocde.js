

var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'json_encode',
    filter: function (value,params){
        return JSON.stringify(value);
    }
};


Template.addFilter(filter);












