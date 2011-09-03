
var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'date',
    filter: function (value,params){
        var d = new Date();
        d.parse(value);
        return d.format(params[0]);
    }
};


Template.addFilter(filter);

