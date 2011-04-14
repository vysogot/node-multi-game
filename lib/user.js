//
// User
//
var User = exports.User = function(client, username) {
    this.name = username;
    this.points = 0;
    this.client = client;
};

User.prototype.score = function(){
    this.points++;
};
