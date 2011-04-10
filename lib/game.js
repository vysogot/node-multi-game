//
// Game Interface
//

var Game = exports.Game = function() {
};

Game.prototype.current = function() {
    throw "Implement 'current' prototype function in your game!"
};

Game.prototype.correct = function(answer) {
    throw "Implement 'answer' prototype function in your game!"
};

// Make it prototype so game can change when wrong answer appears
Game.prototype.wrong = function() {
    throw "Implement 'wrong' static function in your game!";
};

Game.insults = ["Give me a break!"];
