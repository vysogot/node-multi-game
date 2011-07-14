var User = require("./user").User,
       _ = require('underscore'),
     sys = require('sys');

var Room = exports.Room = function(game_type) {
    this.gameClass = require('./games/' + game_type + '/' + game_type).Game;

    this.game = new this.gameClass();
    this.users = {};
};

Room.prototype.broadcast = function(socket, message) {
    _.each(this.users, function(user, id) {
        if (id != socket.id) {
            user.socket.emit('message',  message);
        }
    });
};

Room.prototype.sendToAll = function(message) {
    _.each(this.users, function(user, id) {
        user.socket.emit('message',  message);
    });
};

Room.prototype.join = function(socket, username) {
    var user = new User(socket, username);
    this.users[socket.id] = user;
    return user;
};

Room.prototype.getById = function(id) {
    return this.users[id];
};

Room.prototype.removeUser = function(id) {
    delete this.users[id];
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

Room.prototype.processMessage = function(socket, message) {
    if('username' in message){
        user = this.join(socket, message.username);

        this.broadcast(socket, {message: user.name + ' just joined the game!'});
        socket.emit('message',  this.game.current());

        this.sendToAll(this.scores());

    } else if ('answer' in message) {
        var user = this.getById(socket.id);

        if (this.game.correct(message.answer)) {
            user.score();
            this.game = new this.gameClass();

            this.broadcast(socket, {message: this.getById(socket.id).name + ' wins!'});
            socket.emit('message',  {message: 'You win!'});

            this.sendToAll(this.game.current());
            this.sendToAll(this.scores());

        } else {
            var game = this.game;
            socket.emit('message', game.wrong());
        }
    }
};
