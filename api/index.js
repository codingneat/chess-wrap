// /index.js
'use strict';

var server = require('./config/initializers/server');
var database = require('./config/initializers/database');
var async = require('async');

// Retreive environnment variables
require('dotenv').config();

// Start Server
console.log('[APP] Starting server initialization');


// Initialize Modules
async.series([
  function initializeDBConnection(cb) {
    // Initialize Database
    database(cb);
  },
  function startServer(cb) {
    // Initialize Server
    server(cb);
  }], function(err) {
    if (err) {
      console.log('[APP] initialization failed', err);
    } else {
      console.log('[APP] initialized SUCCESSFULLY');
    }
  }
);