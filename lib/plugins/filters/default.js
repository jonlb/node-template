
var Template = require('../../template').Template,
    Promise = require('promise').Promise;


var filter = exports.filter = {
    $name: 'default',
    filter: function (value,params){
        var res;
        
        if (value === null || value === undefined) {
            if (params.length > 1) {
                res = params.join(' ').replace(/\'/g,'');
            } else {
                res = params[0];
            }
        } else {
            res = value;
        }
        return res;
    }
};


Template.addFilter(filter);

