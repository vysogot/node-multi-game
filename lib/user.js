//
// User
//
var User = exports.User = function(socket, username) {
    this.name = username;
    this.points = 0;
    this.socket = socket;
};

User.prototype.score = function(){
    this.points++;
};
