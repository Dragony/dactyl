var express = require('express');
var bodyParser = require('body-parser');

module.exports = {
    express: function(app, config){
        var cookieParser = require('cookie-parser')(config.general.framework.views);
        var session = require('cookie-session')({ secret: config.general.framework.views });
        app.use(express.static(global.base + '/assets'));
        app.use(bodyParser.json());
        app.use(cookieParser);
        app.use(session);
        app.use(bodyParser.urlencoded({ extended: 'qs' }));
        app.set('views', config.general.framework.views);
        app.set("twig options", {
            strict_variables: false
        });
        return app;
    },
    socketio: function(io){
        io.use(function(socket, next) {
            var req = socket.handshake;
            var res = {};
            cookieParser(req, res, function(err) {
                if (err) return next(err);
                session(req, res, next);
            });
        });
        return io;
    }
}