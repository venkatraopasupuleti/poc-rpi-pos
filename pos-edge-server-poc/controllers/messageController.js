'use strict';
// Requiring our models
const db = require("../models");
const { wrap: async}=require('co');

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
            res.json(dbMsg);
        });
    }catch(e){
        console.log(e)
		res.status(400);
		res.json(e)
    }
});