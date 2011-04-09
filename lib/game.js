//
// Game
//

var Game = exports.Game = function() {
    this.x = randomInt(32, 1);
    this.y = randomInt(32, 1);
};

Game.prototype.current = function() {
    return { message: 'How much is ' + this.x + ' * ' + this.y + '?' };
};

Game.prototype.correct = function(answer) {
    return answer == (this.x * this.y).toString();
};

Game.wrongAnswer = function() {
    return { message: Game.insults[randomInt(Game.insults.length)] };
};

Game.insults = ['Nice try looser',
                'Did you go to school?',
                'Come on! really?',
                'My mom does better than that',
                'Yeah sure!!!'];
