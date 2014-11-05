var merge = require('connect').utils.merge
;

module.exports = function(routedFunction, req, res){

    this.render = function(req, res, path, options){
        res.render(path, merge(options, {
            host: req.headers.host,
            sessionId: req.sessionID,
            user: req.session.user
        }));
    }.bind(this, req, res);

    routedFunction.call(this, req, res);
}