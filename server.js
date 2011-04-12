var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    express = require('express'),
    sys = require('sys'),
    debug = sys.debug,
    inspect = sys.inspect,
    Room = require('./lib/room').Room;


var app = express.createServer();

app.use(express.static(__dirname + '/public'));

app.get('/games/:id', function(req, res) {
    res.sendfile(__dirname + getView(req.params.id));
});

getView = function(path){
    return '/lib/games/' + path + '/' + path + '.html';
};

app.listen(8080);

var io = io.listen(app),
    buffer = [];

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
        room.removeUser(client.sessionId);
    });
});
