// app/routes/Try.js

var express	= require('express');
var router	= express.Router();
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var Game 	= require('../models/game');



router.get('/games',function(req, res) {

  Game
	.find()
	.exec(function(err, games) {
    	if (err) res.send(err);
    	res.json(games);
	}); 
					
});

router.get('/game/:id',function(req, res) {

  Game
	.findOne({_id:req.params.id})
	.exec(function(err, game) {
    	if (err) res.send(err);
    	res.json(game);
	}); 
					
});

router.route('/')
		.get(function(req, res) { 
						var users = [];

			    req.client.keys('*', function (err, keys) {
					if (err) return console.log(err);

						async.each(keys, function(key, cb) {
						    req.client.hgetall(key, function(err, value) {
						      if(value.tipo==0) users.push(value);

						      cb(err);
						    });
						  }, function() {
						    res.json(users);
						  });
				});  
		})
		.post(function(req, res) {
			
					var game = Game(req.body);

				    game
				    	.save(function(err) {
				    		if (err) res.send(err);
				      		res.send('ok');
						}); 

		});










module.exports = router;	