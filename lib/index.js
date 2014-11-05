// Module imports
var Twig = require("twig")
express = require('express')
app = express()
sockets = require('socket.io')
http = app.listen(process.env.PORT || 8080)
io = sockets.listen(http)

fs = require('fs')
db = require('./app/models')
boot = require("./app/services/boot")
router = require("./app/services/routing")
socketRouter = require("./app/services/sockets.js")
;

// Set global base to avoid using relative paths
global.base = __dirname;
global.sessionSecret = '3k45X4da7AhaCH77qRKY';

// Set getter for application paths
global.get = function(path){
    return global.base + '/app/' + path;
}

// express settings
app = boot.express(app);

// socket.io settings
io = boot.socketio(io);

// update database
/*db.sequelize.sync({ force: true }).complete(function(err) {
    if (err) {
        throw err;
    }
})*/

// bind all routes
for(name in routing){
    var element = routing[name];
    var controller = element.controller.split(":");
    var controllerFunc = require(global.base + '/app/controllers/' + controller[0] + 'Controller')[controller[1]];
    app.get(element.path, router.bind(router, controllerFunc));
}

// bind all socket events on connection
io.sockets.on('connection', function (socket){
    var session = socket.handshake.session;
    for(event in socketEvents){
        var element = socketEvents[event];
        var socketName = element.socket.split(":");
        var socketClass = require(global.base + '/app/sockets/' + socketName[0] + 'Socket')
        var socketFunc = socketClass[socketName[1]];
        socket.on(event, socketRouter.bind(socketRouter, event, socket, socketFunc));
    }
})