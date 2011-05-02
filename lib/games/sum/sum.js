//
// Sum game
//

var inherits = require('sys').inherits,
    Base = require('../../game').Game,
    Utils = require('../../utils').Utils;

var Game = exports.Game = function() {
  this.x = Utils.randomInt(32, 1);
  this.y = Utils.randomInt(32, 1);
};

inherits(Game, Base);

Game.prototype.current = function() {
    return { message: 'How much is ' + this.x + ' + ' + this.y + '?' };
};

Game.prototype.correct = function(answer) {
    return answer == (this.x + this.y).toString();
};

Game.prototype.insults = ['Nice try looser',
                          'Did you go to school?',
                          'Come on! really?',
                          'My mom does better than that',
                          'Yeah sure!!!'];
