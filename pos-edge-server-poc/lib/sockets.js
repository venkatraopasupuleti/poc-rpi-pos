const db = require("../models");
const { wrap: async}=require('co');
var io=null;
module.exports = function Server(socket, server) {
	io = socket.listen(server);
	console.log(server)
	io.sockets.on( 'connection', function( client ) {
		console.log( "New client !" );
		
		client.on( 'message', function( data ) {
			db.Message.create(data).then(function (dbMsg) {
				io.sockets.emit( 'message', data );
			});
			console.log( 'Message received ' + data.sender + ":" + data.text );
		});
	});
	this.getwebsocket=function(){
		return io;
	}
	return this;
};