// functions

var GameClient = function(gameName) {
    this.gameName = gameName;
    this.socket = new io.connect(window.location.protocol + '//' + window.location.host);
    this.socket.on('connect', function(){ this.afterConnect(); }.bind(this));
    this.socket.on('message', function(obj){ this.message(obj); }.bind(this));
};

GameClient.prototype.afterConnect = function() {
    var container = document.getElementById('connection-status');
    var username = "";

    while (!username) {
        username = prompt('Please, type your name:');
    }

    this.login(username);
    container.innerHTML = 'Welcome ' + username + '! You are connected!';
};

GameClient.prototype.message = function(obj) {
    if ('message' in obj) {
        var gameContainer = document.getElementById('game');
        var el = document.createElement('p');
        el.innerHTML = GameClient.esc(obj.message);
        gameContainer.appendChild(el);
        gameContainer.scrollTop = 1000000;
    } else if ('scores' in obj) {
        var scoresContainer = document.getElementById('scores');
        scoresContainer.innerHTML = '';
        var scoresList = document.createElement('ul');
        for (var i in obj.scores) {
            var user = obj.scores[i];
            var scoreItem = document.createElement('li');
            scoreItem.innerHTML = user.name + ': ' + user.points;
            scoresList.appendChild(scoreItem);
        }
        scoresContainer.appendChild(scoresList);
    }
};

GameClient.prototype.send = function() {
    var val = document.getElementById('text').value;
    this.socket.emit('message', {game: this.gameName, answer: val});
    document.getElementById('text').value = '';
};

GameClient.prototype.login = function(username) {
    this.socket.emit('message', {game: this.gameName, username: username});
};

GameClient.esc = function(msg) {
    return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};