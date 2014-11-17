"use strict"


var Follow = function(){

	var userToItsFollower = {};

	var _follow = function(userId, data) {
		var f = userToItsFollower[userId];
		if (f) {
			// append follwer to the other in the array
			f.push(data);
		}
		else {
			// new follwer-array
			userToItsFollower[userId] = [data];
		}
	}

	var _getMyFollower = function(userId) {
		return userToItsFollower[userId];
	}

	return {
		follow: function(userId, data) {
			_follow(userId, data);
		},

		getMyFollower: function(userId) {
			return _getMyFollower(userId);
		}
	};
}();

module.exports = Follow;