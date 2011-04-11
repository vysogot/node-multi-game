var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    sys = require('sys'),
    debug = sys.debug,
    inspect = sys.inspect,
    User = require('./lib/user').User,
    Game = require('./lib/game').Game,
    Multiply = require('./lib/games/multiply').Multiply;

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
      return '/lib/views' + path;
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
};

//
// Game-Clients Logic
//

//
// TODO: switch for which game user wants to play
//       to do something like game rooms
//

var game = new Multiply();

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

        // TODO: the switch thing or some other approach
        game = new Multiply();

        client.broadcast({message: User.getBySessionId(client.sessionId).name + ' wins!'});
        client.send({message: 'You win!'});

        sendToAll(client, game.current());
        sendToAll(client, User.scores());

      } else {
        client.send(game.wrong());
      }
    }
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected'});
    User.destroy(client.sessionId);
  });
});
