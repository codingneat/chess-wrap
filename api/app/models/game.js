 // app/models/game.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  pgn: String,
  white: String,
  black: String,
  created_at: Date,
  updated_at: Date
});

gameSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) {
     this.created_at = currentDate;
     this.updated_at = currentDate;
  }
  next();
});




var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
