// config/initializers/server.js

var express = require('express');
var path = require('path');
var logger = require('winston');
var redis = require('redis');
var routes         = require('require-all')(path.join(__dirname,'/../../app/routes'));
var app;


var start =  function(cb) {
  'use strict';
  
    app = express();

    var server = require('http').createServer(app);
    var io     = require('socket.io')(server);

     // Redis
    var client = redis.createClient(process.env.NODE_REDIS_PORT,process.env.NODE_REDIS_HOST);

    client.on('connect', function() {});

    client.flushall( function() {});





    require('./express')(app);


    // Put IO in Request
    app.use(function(req, res, next) {
        req.io = io;
        req.client = client;
        next();
    });

   



    // Public
    app.use("/public", express.static(path.join(__dirname,'/public')));


    // Go route
    require('../routes/routes')(app);

    // Import Sockets
    require('../../sockets/base')(io,client);




    // Initialize Server
    server.listen(process.env.NODE_PORT);

    console.log('Magic happens on port ' + process.env.NODE_PORT);
    console.log('env:  '+ process.env.NODE_ENV);

  
    if (cb) {
      return cb();
    }
};

module.exports = start;