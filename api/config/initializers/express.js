// config/initializers/express.js

var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var morgan 		   = require('morgan'); 
var methodOverride = require('method-override');


var start =  function(app) {
  'use strict';


    // get all data/stuff of the body (POST) parameters
	// parse application/json 
	app.use(morgan('dev'));  
	app.use(cookieParser());
	app.use(bodyParser.json()); 

	// parse application/vnd.api+json as json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false })); 

	// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
	app.use(methodOverride('X-HTTP-Method-Override')); 

	// set the static files location /public/img will be /img for users
	app.use(express.static(__dirname + '/public')); 
	
	// set CORS Headers and Other Stuffs
	app.all('*', function(req, res, next) {
		var allowedOrigins = process.env.NODE_PROD_SITES;
 		var origin = req.headers.origin;
    	if(process.env.NODE_ENV=='production'&&allowedOrigins.indexOf(origin) > -1){
		    res.setHeader('Access-Control-Allow-Origin', origin);
		} else{
				res.set('Access-Control-Allow-Origin',  process.env.NODE_DEV_SITE);
		}
		res.set('Access-Control-Allow-Credentials', true);
		res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, x-access-token');
		if ('OPTIONS' == req.method) return res.send(200);
		next();
	}); 

};

module.exports = start;


	




