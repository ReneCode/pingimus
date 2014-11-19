"use strict"


var Follow = function(){

	var userToItsFollower = {};

	var _clear = function() {
		userToItsFollower = {};
	}

	var _follow = function(userId, data) {
		var f = userToItsFollower[userId];
		if (f) {
			// append follwer to the other in the array
			if (f.indexOf(data) < 0) {
				// only add once
				f.push(data);
			}
		}
		else {
			// new follwer-array
			userToItsFollower[userId] = [data];
		}
	}

	var _whoIsFollowingMe = function(userId) {
		var lst = [];
		for (var key in userToItsFollower) {
			if (userToItsFollower.hasOwnProperty(key)) {
				if (userToItsFollower[key].indexOf(userId) >= 0) {
					lst.push(key);
				}
			}
		}
		return lst;
	}

	var _whomDoIFollow = function(userId) {
		if (userToItsFollower.hasOwnProperty(userId)) {
			return userToItsFollower[userId];
		}
		else {
			return [];
		}
	}

	return {
		clear: function() {
			_clear();
		},

		follow: function(userId, data) {
			_follow(userId, data);
		},

		whoIsFollowingMe: function(userId) {
			return _whoIsFollowingMe(userId);
		},

		whomDoIFollow: function(userId) {
			return _whomDoIFollow(userId)
		}
	};
}();

module.exports = Follow;