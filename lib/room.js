sendToAll = function(client, message) {
  client.broadcast(message);
  client.send(message);
};


var User = require("./user").User,

    // TODO: we need a Strategy Pattern to handle many games
    Game = require("./games/multiply/multiply").Multiply;

var Room = exports.Room = function() {
    this.game = new Game();
    this.users = {};
};

Room.prototype.join = function(client, username) {
    var user = new User(client.sessionId, username);
    this.users[client.sessionId] = user;
    return user;
};

Room.prototype.getBySessionId = function(sessionId) {
    return this.users[sessionId];
};

Room.prototype.removeUser = function(sessionId) {
    delete this.users[sessionId];
};

Room.prototype.scores = function() {
    var scores = [];
    for (var user in this.users) {
        var player = this.users[user];
            scores.push({name: player.name, points: player.points});
        }
    return {
        scores: scores.sort(function(a, b) {
            return b.points - a.points;
        })
    };
};

Room.prototype.processMessage = function(client, message) {
    if('username' in message){
        user = this.join(client, message.username);

        client.broadcast({message: user.name + ' just joined the game!'});
        client.send(this.game.current());

        sendToAll(client, this.scores());

    } else if ('answer' in message) {
        var user = this.getBySessionId(client.sessionId);

        if (this.game.correct(message.answer)) {
            user.score();
            this.game = new Game();

            client.broadcast({message: this.getBySessionId(client.sessionId).name + ' wins!'});
            client.send({message: 'You win!'});

            sendToAll(client, this.game.current());
            sendToAll(client, this.scores());

        } else {
            var game = this.game;
            client.send(game.wrong());
        }
    }
};
