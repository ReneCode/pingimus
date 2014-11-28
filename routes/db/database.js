
var redis = require('redis');

var KEY_USER_SESSION = 'us';
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

	this.setUserSession = function(sessionId, user, callback) {
		var userId = user.id;
		client.hset(KEY_USER_SESSION, sessionId, userId, function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				// 
				callback(null, result);
			}
		});

	};

	this.getUserFromSessionId = function(sessionId, callback) {
		client.hget(KEY_USER_SESSION, sessionId, function(err, result){
			console.log("err %s / %s", err, result);
			if (err) {
				callback(err, null);
			}
			else {
				if (result) {
					callback(null, {id:result});
					/*
					this.getUserFromId(result, function(err, user) {
						if (err) {
							callback(err, null);
						}
						else {
							callback(null, user);
						}
					});
*/

				}
				else {
					callback('session not found', null);
				}
			}
		});
	};

	this.createNewUser = function(user, callback) {
		client.incr(KEY_USER_ID, function(err, result) {
			if (err) {
				callback(err, null);
			}
			else {
				user.id=result;
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
	

	this.getUserFromId = function(id, callback) {
		client.hget(KEY_USER, id, function(err, user) {
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

