module.exports = function(event, socket, socketFunction, data){

    this.session = socket.handshake.session;
    this.event = event;
    this.socket = socket;

    this.respond = function(data){
        this.socket.emit(this.event, data);
    }.bind(this);

    socketFunction.call(this, data);
}