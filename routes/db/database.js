
var redis = require('redis');
var crypto = require('crypto');

var KEY_SESSION = 'ses:';
var KEY_USER = 'usr:';
var KEY_USER_ID = 'usrkey'

var Database = function() {

	"use strict"
	var client;

	this.connect = function( callback ) {
		client = redis.createClient();
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

	this.addSession = function(userId, callback) {
		// generate Session id
		var current_date = (new Date()).valueOf().toString();
		var random = Math.random().toString();
		var sessionId = crypto.createHash('sha1').update(current_date + random).digest('hex');

		client.hset(KEY_SESSION, sessionId, userId, function(err, result) {
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
	}

	this.addUser = function(u, callback) {
		var user = u;
		client.incr(KEY_USER_ID, function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				user.id=result;
				// make string out of user-object
				client.hset(KEY_USER, result, JSON.stringify(user), function(err, result) {
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, user);
					}
				});
			}
		});
	};
	

	this.getUser = function(userId, callback) {
		client.hget(KEY_USER, userId, function(err, user) {
			// convert to object
			user = JSON.parse(user);
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, user);
			}
		});

	};

};

module.exports = Database;

