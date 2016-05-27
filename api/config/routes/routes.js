// config/routes/routes.js

var routes         = require('require-all')(__dirname+'/../../app/routes');


var start = function (app) {
	'use strict';

	app.use('/try', routes.Try);
	

};

module.exports = start;