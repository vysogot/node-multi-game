var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    sys = require('sys'),
    debug = sys.debug,
    inspect = sys.inspect

    server = http.createServer(function(req, res){

      var path = url.parse(req.url).pathname;

      switch (path){
        case '/':
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('Welocome to the game');
          res.end();
          break;
        case '/game.html':
          fs.readFile(__dirname + getView(path), function(err, data){
            if (err) return send404(res);
            res.writeHead(200, {'Content-Type': 'text/html' });
            res.write(data, 'utf8');
            res.end();
          });
          break;
        default: send404(res);
      }
    }),

    getView = function(path){
      return '/views' + path;
    }

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(8080);

var io = io.listen(server),
    buffer = [];

//
// Helpers
//

sendToAll = function(client, message) {
  client.broadcast(message);
  client.send(message);
}

//
// Game
//

function Game() {
  this.x = Math.floor(Math.random()*32+1);
  this.y = Math.floor(Math.random()*32+1);
  this.finished = false;
}

Game.prototype.current = function() {
  return { message: 'How much is ' + this.x + ' * ' + this.y + '?' };
}

Game.prototype.correct = function(answer) {
  return answer == (this.x * this.y).toString();
}

//
// User
//

var users = {};

function User(sessionId, username) {
  this.name = username;
  this.points = 0;
  users[sessionId] = this;
}

User.getBySessionId = function(sessionId) {
  return users[sessionId];
}

User.destroy = function(sessionId) {
  delete users[sessionId];
}

User.scores = function() {
  var scores = [];
  for (var user in users) {
    var player = users[user];
    scores.push({name: player.name, points: player.points});
  }
  return {scores: scores.sort(function(a, b) {
    return b.points - a.points;
  })};
}

User.prototype.correctAnswer = function(){
  this.points = this.points + 1;
}

//
// Game-Clients Logic
//

var game = new Game();

io.on('connection', function(client){
  client.send({ buffer: buffer });

  client.on('message', function(message) {
    if('username' in message){
      user = new User(client.sessionId, message.username);

      client.broadcast({message: user.name + ' just joined the game!'});
      client.send(game.current());

      sendToAll(client, User.scores());

    } else if ('answer' in message) {

      var user = User.getBySessionId(client.sessionId);

      if (game.correct(message.answer)) {
        user.correctAnswer();
        game = new Game();

        client.broadcast({message: users[client.sessionId].name + ' wins!'});
        client.send({message: 'You win!'});

        sendToAll(client, game.current());
        sendToAll(client, User.scores());

      } else {
        client.send({message: 'Nice try looser'});
      }
    }
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected'});
    User.destroy(client.sessionId);
  });
});
