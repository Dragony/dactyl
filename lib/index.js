// Module imports
var Twig = require('twig'),
    express = require('express'),
    app = express(),
    sockets = require('socket.io'),
    boot = require('./boot'),
    router = require('./routing'),
    socketRouter = require('./sockets'),
    utils = require('./utils')
;

var Start = function(configPath, cwd){
    var config = utils.readConfigs(configPath);
    var http = app.listen(config.general.server.port);
    var io = sockets.listen(http);

    // express settings
    app = boot.express(app, config);

    // socket.io settings
    io = boot.socketio(io);

    // update database
    /*db.sequelize.sync({ force: true }).complete(function(err) {
     if (err) {
     throw err;
     }
     })*/

    // bind all routes
    for(name in config.routing){
        var element = config.routing[name];
        var controller = element.controller.split(":");
        var controllerFunc = require(cwd + config.general.framework.controllers + controller[0] + 'Controller')[controller[1]];
        app.get(element.path, router.bind(router, controllerFunc));
    }

    // bind all socket events on connection
    io.sockets.on('connection', function (socket){
        var session = socket.handshake.session;
        for(event in config.socket_events){
            var element = config.socket_events[event];
            var socketName = element.socket.split(":");
            var socketClass = require(cwd + config.general.framework.sockets + socketName[0] + 'Socket');
            var socketFunc = socketClass[socketName[1]];
            socket.on(event, socketRouter.bind(socketRouter, event, socket, socketFunc));
        }
    });

    return {
        express: app,
        io: io
    }
};

module.exports = Start;