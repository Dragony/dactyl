var merge = require('merge');

module.exports = function(routedFunction, req, res, next){

    this.render = function(req, res, path, options){
        res.render(path, merge(options, {
            host: req.headers.host,
            storage: req.storage
        }));
    }.bind(this, req, res);

    routedFunction.call(this, req, res, next);
};