Multiplayer metagame to which you can add your own game.
===

To install:

1. install [nodejs](https://github.com/joyent/node) and [npm](https://github.com/isaacs/npm)
2. install [socket.io](https://github.com/LearnBoost/Socket.IO) through npm
2. install jade npm [npm install jade]

    git clone git://github.com/vysogot/node-multi-game.git

To run:

    change in multiply.html port from 80 to 8080
    node server.js

To play:


    http://localhost:8080/



What it is about?
==

Having fun! Idea behind is to develop multiplayer games through a simple template that is in game.js

How to create my own game?
==

You can add your game in new folder in lib/games/yourGame/ with two files: yourGame.js and yourGame.html
Soon it will need test files also.

yourGame class needs to inherit after Game class. Idea is to make a that can:
- be initialized
- interpret a client message
- response with a client message

Handling different games is not implemented yet though :)

Feel free to contribute.
