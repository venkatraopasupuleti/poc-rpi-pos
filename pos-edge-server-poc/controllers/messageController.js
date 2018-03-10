'use strict';
// Requiring our models
const db = require("../models");
const { wrap: async}=require('co');
var firebase = null;
var io=null;

exports.get=async(function* (req,res){
    try{
        /*var query = {};
        db.Message.findAll({
            where: query
        }).then(function (dbMsgs) {
            res.json(dbMsgs);
        });*/
        getAllMessages(function(dbMsgs){
            res.json(dbMsgs);
        });
    }catch(e){
        console.log(e);
        res.status(400);
        res.json(e)
    }
});
exports.set=async(function* (req,res){
    try{
        /*db.Message.create(req.body).then(function (dbMsg) {
            db.Message.findAll({
                where: {}
            }).then(function (dbMsgs) {
                firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
            });
            res.json(dbMsg);
        });*/
        insertMessages([req.body],function(insertedMsgs){
            if(io){
                io.sockets.emit( 'broadcast', data );
            }
            getAllMessages(function(dbMsgs){
                if(firebase){
                    firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
                }
                res.json(dbMsgs);
            });
        });

    }catch(e){
        console.log(e)
		res.status(400);
		res.json(e)
    }
});

const getAllMessages=function(callback){
    db.Message.findAll({
        where: {}
    }).then(callback);
}

const insertMessages=function(entries,callback){
    db.Message.bulkCreate(entries,{ignoreDuplicates:true}).then(callback);
}

exports.setwebsocket=function(websocket){
    io=websocket;
}

exports.setfirebase=function(firebaseobj){
    firebase=firebaseobj;
    firebase.database().ref('/events').on('value',function(snapshot){
        try{
            var entries=snapshot.val();
            
            if(!(entries instanceof Array)){
                var keys = Object.keys(entries);
                var entriesArray=[];
                for(var i=0;i<keys.length;i++){
                    entriesArray.push(entries[keys[i]]);
                }
                entries=entriesArray;
            }
    
            insertMessages(entries,function(insertedMsgs){
                firebase.database().ref('/events').set([]);
                if(io){
                    io.sockets.emit( 'broadcast', insertedMsgs );
                }
                getAllMessages(function(dbMsgs){
                    firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
                });
            });
            /*db.Message.bulkCreate(entries).then(()=>{
                db.Message.findAll({
                    where: {}
                }).then(function (dbMsgs) {
                    firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
                });
            });*/
        }catch(e){
            return;
        }
    });
}