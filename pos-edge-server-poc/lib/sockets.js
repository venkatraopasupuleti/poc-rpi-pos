const db = require("../models");
const { wrap: async}=require('co');
var io=null;
var firebase=null;
module.exports = function Server(socket, server,firebaseobj) {
	io = socket.listen(server);
	firebase=firebaseobj;
	console.log(server)
	io.sockets.on( 'connection', function( client ) {
		console.log( "New client !" );
		
		client.on( 'message', function( data ) {
			db.Message.create(data).then(function (dbMsg) {
				getAllMessages(function(dbMsgs){
					if(firebase){
						firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
					}
					io.sockets.emit( 'message', dbMsgs );
				});
			});	
			console.log( 'Message received ' + data.sender + ":" + data.text );
		});
	});
	this.getwebsocket=function(){
		return io;
	}
	return this;
};
const getAllMessages=function(callback){
    db.Message.findAll({
        where: {}
    }).then(callback);
}