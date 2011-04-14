//
// Game Interface
//

var Utils = require('./utils').Utils;

var Game = exports.Game = function() {
};

Game.prototype.current = function() {
    throw "Implement 'current' prototype function in your game!";
};

Game.prototype.correct = function(answer) {
    throw "Implement 'answer' prototype function in your game!";
};

// Make it prototype so game can change when wrong answer appears
// Base function returns random game defined insult
Game.prototype.wrong = function() {
    return { message: this.insults[Utils.randomInt(this.insults.length)] };
};

Game.prototype.insults = ["Give me a break!"];