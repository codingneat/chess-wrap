// config/initializers/database.js

var mongoose       = require('mongoose');
var winston       = require('winston');




var start = function(cb) {
  'use strict';
  
    mongoose.connect(process.env.NODE_DATABASE);


    require('winston-mongodb').MongoDB;
    winston.add(winston.transports.MongoDB, {db: process.env.NODE_DATABASE});

  	cb();
};

module.exports = start;