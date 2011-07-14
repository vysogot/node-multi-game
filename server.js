var http    = require('http'),
    url     = require('url'),
    fs      = require('fs'),
    io      = require('socket.io'),
    express = require('express'),
    sys     = require('sys'),
    debug   = sys.debug,
    inspect = sys.inspect,
    Room    = require('./lib/room').Room,
    _       = require('underscore');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    // app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/games/:id', function(req, res) {
    res.render('games/' + req.params.id);
});

if (!module.parent) {
    io = io.listen(app);
    app.listen(8080);
    console.log("Express server listening on port %d", app.address().port);
}
//
// Game-Clients Logic
//

var rooms = {
    multiply: new Room('multiply'),
    sum: new Room('sum')
};

io.sockets.on('message', function(message) {
    console.log(message);
});

io.sockets.on('connection', function(socket){

    socket.on('message', function(message) {
        var room = rooms[message.game];
        console.log(room);
        if (room) {
            room.processMessage(socket, message);
        } else {
            socket.emit('message', {message: 'unrecognized message' + JSON.stringify(message)});
        }
    });

    socket.on('disconnect', function(){
        socket.broadcast.emit({ announcement: socket.id + ' disconnected'});
        // Since we don't down the room the user belongs to we call it on every room
        // this is not ideal but we'll leave it for now
        _.each(rooms, function(room) {
            room.removeUser(socket.id);
        });
    });
});
