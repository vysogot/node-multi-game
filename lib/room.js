var User = require("./user").User,
       _ = require('underscore'),
     sys = require('sys');

var Room = exports.Room = function(game_type) {
    this.gameClass = require('./games/' + game_type + '/' + game_type).Game;

    this.game = new this.gameClass();
    this.users = {};
};

Room.prototype.broadcast = function(client, message) {
    _.each(this.users, function(user, sessionId) {
        if (sessionId != client.sessionId) {
            user.client.send(message);
        }
    });
};

Room.prototype.sendToAll = function(message) {
    _.each(this.users, function(user, sessionId) {
        user.client.send(message);
    });
};

Room.prototype.join = function(client, username) {
    var user = new User(client, username);
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
    var scores = _.map(this.users, function(player) {
        return {name: player.name, points: player.points};
    });

    return {
        scores: scores.sort(function(a, b) {
            return b.points - a.points;
        })
    };
};

Room.prototype.processMessage = function(client, message) {
    if('username' in message){
        user = this.join(client, message.username);

        this.broadcast(client, {message: user.name + ' just joined the game!'});
        client.send(this.game.current());

        this.sendToAll(this.scores());

    } else if ('answer' in message) {
        var user = this.getBySessionId(client.sessionId);

        if (this.game.correct(message.answer)) {
            user.score();
            this.game = new this.gameClass();

            this.broadcast(client, {message: this.getBySessionId(client.sessionId).name + ' wins!'});
            client.send({message: 'You win!'});

            this.sendToAll(this.game.current());
            this.sendToAll(this.scores());

        } else {
            var game = this.game;
            client.send(game.wrong());
        }
    }
};
