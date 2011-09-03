
var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'capitalize',
    filter: function (value,params){
        //check if we have a string..
        if (value.contains(' ')) {
            parts = value.split(' ');
            parts[0] = parts[0].capitalize();
            value = parts.join(' ');
        } else {
            value = value.capitalize();
        }
        return value;
    }
};


Template.addFilter(filter);

