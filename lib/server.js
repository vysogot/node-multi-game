var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    sys = require('sys'),
    debug = sys.debug,
    inspect = sys.inspect // for npm, otherwise use require('./path/to/socket.io')

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

sendAll = function(client, message) {
  client.broadcast(message);
  client.send(message);
}

var users = {};
var game = new Game();

io.on('connection', function(client){
  client.send({ buffer: buffer });

  client.on('message', function(message) {
    if('username' in message){
      users[client.sessionId.toString()] = message.username;
      client.broadcast({message: message.username + ' just joined the game!'});
      client.send(game.current());
    } else if ('answer' in message) {
      if (game.correct(message.answer)) {
        client.broadcast({message: users[client.sessionId.toString()] + ' Wins!'});
        client.send({message: 'You win!'});

        game = new Game();
        sendAll(client, game.current());
      } else {
        client.send({message: 'Nice try looser'});
      }
    }
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected'});
  });
});
