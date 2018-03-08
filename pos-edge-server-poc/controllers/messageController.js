'use strict';
// Requiring our models
const db = require("../models");
const { wrap: async}=require('co');
var firebase = require("firebase");
var config = require("../config/firebase.conf.json");
firebase.initializeApp(config);
firebase.database().ref('/events').on('value',function(snapshot){
    try{
        var entries=snapshot.val();
        db.Message.bulkCreate(entries).then(()=>{
            db.Message.findAll({
                where: {}
            }).then(function (dbMsgs) {
                firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
            });
        });
        firebase.database().ref('/events').set([]);
    }catch(e){
        return;
    }
});

exports.get=async(function* (req,res){
    try{
        var query = {};
        db.Message.findAll({
            where: query
        }).then(function (dbMsgs) {
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
        db.Message.create(req.body).then(function (dbMsg) {
            db.Message.findAll({
                where: {}
            }).then(function (dbMsgs) {
                firebase.database().ref('/messages').set(JSON.parse(JSON.stringify(dbMsgs)));
            });
            res.json(dbMsg);
        });

    }catch(e){
        console.log(e)
		res.status(400);
		res.json(e)
    }
});