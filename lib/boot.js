var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var sessionManager = require('./sessionManager');

module.exports = {
    express: function(app, config){
        var cookieParser = require('cookie-parser')(config.general.framework.views);
        var session = require('cookie-session')({
            secret: config.general.framework.views,
            name: config.general.framework.cookieName
        });
        app.use(express.static(config.general.framework.assets));
        app.use(bodyParser.json());
        app.use(cookieParser);
        app.use(session);
        app.use(bodyParser.urlencoded({ extended: 'qs' }));
        app.use(function(req, res, next){
            if(req.session.id == undefined || !sessionManager.get(req.session.id)){
                req.session.id = sessionManager.spawn();
            }
            req.storage = sessionManager.get(req.session.id);
            next();
        });

        app.engine('twig', swig.renderFile);

        app.set('views', config.general.framework.views);
        app.set('view cache', false);
        swig.setDefaults({ cache: false });
        return app;
    },
    socketio: function(io, config){
        var cookieParser = require('cookie-parser')(config.general.framework.views);
        var session = require('cookie-session')({
            secret: config.general.framework.views,
            name: config.general.framework.cookieName
        });
        io.use(function(socket, next) {
            var req = socket.handshake;
            var res = {};
            cookieParser(req, res, function(err) {
                if (err) return next(err);
                session(req, res, next);
            });
        });
        io.use(function(socket, next){
            if(!sessionManager.get(socket.handshake.session.id)){
                sessionManager.spawn(socket.handshake.session.id);
            }
            socket.storage = sessionManager.get(socket.handshake.session.id);
            next();
        });
        return io;
    }
};