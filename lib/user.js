//
// User
//

var User = exports.User = function(sessionId, username) {
    this.name = username;
    this.points = 0;
};

User.prototype.score = function(){
    this.points++;
};
