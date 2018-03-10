
'use strict'

const messageController = require('../controllers/messageController.js');
module.exports = function(app,io,firebase){
  console.log(app)
  messageController.setwebsocket(io);
  messageController.setfirebase(firebase);
  app.options("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin", req.get("Origin")||"*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //other headers here
    res.status(200).end();
  });
  
  app.post('/api/message',messageController.set);
  app.get('/api/message',messageController.get);
}