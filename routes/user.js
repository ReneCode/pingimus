"use strict"

var crypto = require('crypto');

var User = function() {

	var _create = function(name, clearPassword, callback) {
		var salt = crypto.randomBytes(128).toString('base64');
		crypto.pbkdf2(clearPassword, salt, 10000, 128, function(err, key) {
			if (err) {
				callback(err, null);
			}
			else {
				var cryptPw = key.toString('base64');
				callback(null, {name:name, password:cryptPw, salt:salt} );
			}
		});
	};

	var _validatePassword = function(user, clearPassword, callback) {
		crypto.pbkdf2(clearPassword, user.salt, 10000, 128, function(err, key) {
			if (err) {
				callback(err, null);
			}
			else {
				var cryptPw = key.toString('base64');
				if (cryptPw == user.password) {
					callback(null, "ok");
				}
				else {
					callback(err, "invalid password");
				}
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
		}
	}
}();


module.exports = User;