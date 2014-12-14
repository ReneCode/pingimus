"use strict"

var crypto = require('crypto');


var User = function() {

	var _create = function(userKey, clearPassword, callback) {
		var salt = crypto.randomBytes(128).toString('base64');
		crypto.pbkdf2(clearPassword, salt, 472, 128, function(err, key) {
			if (err) {
				callback(err, null);
			}
			else {
				var cryptPw = key.toString('base64');
				callback(null, {key:userKey, password:cryptPw, salt:salt} );
			}
		});
	};

	var _validatePassword = function(user, clearPassword, callback) {
		crypto.pbkdf2(clearPassword, user.salt, 472, 128, function(err, key) {
			if (err) {
				callback(err, null);
			}
			else {
				var cryptPw = key.toString('base64');
				if (cryptPw == user.password) {
					callback(null, true);
				}
				else {
					callback(err, "invalid password");
				}
			}
		});
	}


	/**
		user.key = 4711		// identification
		user.name = "paul"
		user.follower = [22,44]		// user is following user #22 and #44
		user.isFollowingMe = [77]	// user #77 follows paul

		A.follower = [B,C]
		B.whoIsFollowingMe = [A]
		C.whoIsFollowingMe = [A]
	*/
	var setFollower = function(oUser, oFollower)
	{
		// update  user.follower
		if (!oUser.hasOwnProperty('follower')) {
			oUser.follower = [oFollower.key];
		} 
		else {
			if (oUser.follower.indexOf(oFollower.key) < 0) {
				oUser.follower.push(oFollower.key);
			}
		} 

		// update  oFollower.isFolledBy
		if (!oFollower.hasOwnProperty('whoIsFollowingMe')) {
			oFollower.whoIsFollowingMe = [oUser.key];
		}
		else {
			// append to the array
			if (oFollower.whoIsFollowingMe.indexOf(oUser.key) < 0) {
				oFollower.whoIsFollowingMe.push(oUser.key);
			}
		}
	}

	/**
		para = userKey of follower
	*/
	var _follow = function(database, userKey, para, callback) {
		database.getUser(userKey, function(err, oUser) {
			if (err) {
				return callback(err, null);
			}
			else {
				if (userKey == para) {
					return callback(new Error("can't follow yourself", null), null);
				}
				
				database.getUser(para, function(err, oFollower) {
					if (err) {
						return callback(err, null);
					}
					else {
						if (!oFollower) {
							return callback("can't find follower", null);
						}
						else {
							setFollower(oUser, oFollower);
							// save both:  user and follower
							database.setUser(oUser, function(err, data) {
								if (!err) {
									database.setUser(oFollower, function(err, data) {
										return callback(null, oUser);
									});
								}
							})
						}
					}
				});
			}
		});
	};

	/**
		callback(err, userKeysWhoFollowsMe)
	*/
	var _whoIsFollowingMe = function(database, userKey, callback) {
		database.getUser(userKey, function(err, oUser) {
			if (err) {
				return callback(err, null);
			}
			else {
				return callback(null, oUser.whoIsFollowingMe);
			}
		});
	}



	return {
		/**
			callback(err, user)
				user.name
				user.password (crypted)
				user.salt (internal)
		*/
		create: function(name, clearPassword, callback) {
			return _create(name, clearPassword, callback);
		},

		/**
			callback(err, "ok" | "invalid password")			
		*/
		validatePassword: function(user, clearPassword, callback) {
			return _validatePassword(user, clearPassword, callback);
		},

		follow: function(database, userKey, para, callback) {
			return _follow(database, userKey, para, callback);
		},

		whoIsFollowingMe: function(database, userKey, callback) {
			return _whoIsFollowingMe(database, userKey, callback);
		}
	}
}();


module.exports = User;