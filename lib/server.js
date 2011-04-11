var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    sys = require('sys'),
    debug = sys.debug,
    inspect = sys.inspect,
    Room = require('./room').Room,

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


//
// Game-Clients Logic
//

var room = new Room();

io.on('connection', function(client){
    console.log('connected: '+ client.sessionId);
    client.on('message', function(message) {
        room.processMessage(client, message);
    });

    client.on('disconnect', function(){
        client.broadcast({ announcement: client.sessionId + ' disconnected'});
        User.destroy(client.sessionId);
    });
});
