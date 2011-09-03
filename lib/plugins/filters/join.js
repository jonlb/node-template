

var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'join',
    filter: function (value,params){
        var res;
        if (params.length > 0) {
            res = value.join(params[0]);
        } else {
            res = value.join();
        }
        return res;
    }
};


Template.addFilter(filter);












