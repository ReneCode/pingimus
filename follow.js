"use strict"


var Follow = function(){

	var userToItsFollower = {};

	var _follow = function(userId, data) {
		var f = userToItsFollower[userId];
		if (f) {
			f.push(data);
		}
	}

	return {
		follow: function(userId, data) {
			_follow(userId, data);
		}
	};
}();

module.exports = Follow;