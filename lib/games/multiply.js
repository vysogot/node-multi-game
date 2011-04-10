//
// Multiplication game
//

var inherits = require('sys').inherits,
    Game = require('../game').Game;

var Multiply = exports.Multiply = function() {
  this.x = randomInt(32, 1);
  this.y = randomInt(32, 1);
}

inherits(Multiply, Game);

Multiply.prototype.current = function() {
    return { message: 'How much is ' + this.x + ' * ' + this.y + '?' };
};

Multiply.prototype.correct = function(answer) {
    return answer == (this.x * this.y).toString();
};

Multiply.prototype.wrong = function() {
    return { message: Multiply.insults[randomInt(Multiply.insults.length)] };
};

Multiply.insults = ['Nice try looser',
                'Did you go to school?',
                'Come on! really?',
                'My mom does better than that',
                'Yeah sure!!!'];
