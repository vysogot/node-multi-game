//
// User
//

var users = {};

var User = exports.User = function(sessionId, username) {
	this.name = username;
	this.points = 0;
	users[sessionId] = this;
} 

User.getBySessionId = function(sessionId) {
	return users[sessionId];
};

User.destroy = function(sessionId) {
	delete users[sessionId];
};

User.scores = function() {
	var scores = [];
	for (var user in users) {
		var player = users[user];
		scores.push({name: player.name, points: player.points});
	}
	return {scores: scores.sort(function(a, b) {
			return b.points - a.points;
			})};
};

User.prototype.correctAnswer = function(){
	this.points = this.points + 1;
};

User.users = function() {
	return users;
}
