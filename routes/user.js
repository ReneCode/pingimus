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
		para = userKey of follower
	*/
	var _follow = function(database, userKey, para, callback) {
		database.getUser(userKey, function(err, oUser) {
			if (err) {
				return callback(err, null);
			}
			else {
				database.getUser(para, function(err, oFollower) {
					if (err) {
						return callback(err, null);
					}
					else {
						if (!oFollower) {
							return callback("can't find follower", null);
						}
						else {
							if (!oUser.hasOwnProperty('follower')) {
								oUser.follower = [oFollower.key];
							} 
							else {
								if (oUser.follower.indexOf(oFollower.key) < 0) {
									oUser.follower.push(oFollower.key);
								}
							} 
							database.setUser(oUser, callback);
						}
					}
				});
			}
		});
	};

	/**
		callback(err, userKeysWhoFollowsMe)
	*/
	var _whoFollowsMe = function(database, userKey, callback) {
		database.whoFollowsMe(userKey, callback);
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

		whoFollowsMe: function(database, userKey, callback) {
			return _whoFollowsMe(database, userKey, callback);
		}
	}
}();


module.exports = User;