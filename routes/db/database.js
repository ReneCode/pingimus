
var redis = require('redis');
var crypto = require('crypto');

var KEY_SESSION = 'ses:';
var KEY_USER = 'usr:';
var KEY_SKETCH = 'ske:';

var Database = function() {

	"use strict"
	var client;

	this.connect = function( callback ) {

		console.dir(process.env.REDISTOGO_URL);



		var s = "redis://redistogo:88944017f79beed1627039f4112fdcc7@jack.redistogo.com:11254/";

		s = process.env.REDISTOGO_URL;
		if (s) {
//		if (process.env.REDISTOGO_URL) {
//			var rtg   = require("url").parse(process.env.REDISTOGO_URL);
			var rtg   = require("url").parse(s);
			client = redis.createClient(rtg.port, rtg.hostname);
console.log(rtg.auth);
			client.auth(rtg.auth.split(":")[1]);
		}
		else {
			client = redis.createClient();
		}

		client.on('connect', function(err) {
			if (err) {
				callback(err);
			}
			else {
				callback(null);
			}
		} );
	};

	this.clearDb = function(callback) {
		client.flushdb();
	}

	this.addSession = function(userKey, callback) {
		// generate Session id
		var current_date = (new Date()).valueOf().toString();
		var random = Math.random().toString();
		var sessionId = crypto.createHash('sha1').update(current_date + random).digest('hex');

		client.hset(KEY_SESSION, sessionId, userKey, function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				// 
				callback(null, sessionId);
			}
		});
	};

	this.getSession = function(sessionId, callback) {
		client.hget(KEY_SESSION, sessionId, function(err, result){
			if (err) {
				callback(err, null);
			}
			else {
				if (result) {
					callback(null, result);
				}
				else {
					callback('session not found', null);
				}
			}
		});
	};

	this.deleteSession = function(sessionId, callback) {
		client.hdel(KEY_SESSION, sessionId, function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, result);
			}
		});
	}; 


	// =========================================================


	this.setUser = function(user, callback) {
		// make string out of user-object
		client.hset(KEY_USER, user.key, JSON.stringify(user), function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, user);
			}
		});
	};
	

	/**
		user has to have property "key". This is unique for all users
	*/
	this.addUser = function(user, callback) {
		// todo: look if user allready exists

		this.setUser(user, callback);
	};



	this.getUser = function(userKey, callback) {
		client.hget(KEY_USER, userKey, function(err, user) {
			if (err) {
				callback(err, null);
			}
			else {
				// convert to object
				var oUser = JSON.parse(user);
				callback(null, oUser);
			}
		});
	};

	/**
		callback(err, result)
			result = true    =>  user already exists
	*/
	this.existsUser = function(userKey, callback) {
		client.hget(KEY_USER, userKey, function(err, user) {
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, user ? true: false);
			}
		});
	};



	// -------------------------------------


	var getSketchKey = function(userKey) {
		return KEY_SKETCH + userKey;
	};

	this.addSketch = function(userKey, sketch, callback) {
		// convert sketch-object to string
		client.rpush(getSketchKey(userKey), JSON.stringify(sketch), function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, sketch);
			}
		});
	};

	this.getSketch = function(userKey, callback) {
		client.lrange(getSketchKey(userKey), 0, -1, function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				// result is a list of stringified objects
				// convert it to a list of objects
				var list = [];
				result.forEach( function(r) {
					list.push(JSON.parse(r));
				})
				callback(null, list);
			}
		});
	}

};

module.exports = Database;

