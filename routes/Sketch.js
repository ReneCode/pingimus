var ServerTime = require('./ServerTime.js')
var User = require('./user.js');

var async = require('async');


var Sketch = (function() {


	/**
		para has to be   { x:43, y:4234 }
	*/
	var validatePoint = function(point) {
		if (typeof point["x"] === 'number'  &&  Math.floor(point.x) === point.x  &&
			typeof point["y"] === 'number'  &&  Math.floor(point.y) === point.y) {
			return true;
		}
		else {
			return false;
		}

	};


	var validatePoints = function(points) {
		var resultPoints = [];
		points.forEach(function(p) {
			if (!validatePoint(p)) {
				return undefined;
			}
			resultPoints.push({x:p.x,y:p.y});
		});
		return resultPoints;
	};

	var _getFromMyFollower = function(database, userId, callback) {
		database.getUser(userId, function(err, oUser) {
			if (!oUser) {
				return callback(new Error('user not found'), null);
			}
			if (!oUser.follower) {
				// user follows no other
				return callback(null, null)
			}
			var result = [];
			var currentTime = ServerTime.getCurrentTime();
			async.map(oUser.follower, 

				function(oneFollower,doneCb,c) {
					database.getSketch(oneFollower, function(err, data) {
						data.forEach(function(cmd) {
							if (cmd.expire > currentTime) {
								result.push(cmd);
							}
						});
						doneCb(null);
					});
				}, 
				function(err, r) {
					callback(null, result);
			});
		});
	}

	var _getFromMe = function(database,  userId, callback) {
		database.getSketch(userId, function(err, data) {
			if (!err) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, data);
				}
			};
		});
	}

	return {
		addDot: function(database, userId, cmd, callback) {
			if (!validatePoint(cmd.point)) {
				callback("invalid parameter", null);
			}
			else {
				var obj = { cmd:'dot', 
							create:ServerTime.getCurrentTime(),
							expire:ServerTime.getExpireTime(), 
							point: {x:cmd.point.x, y:cmd.point.y} };
				database.addSketch(userId, obj, function(err, data) {
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, obj);
					}
				});
			}
		},

		addPolygon: function(database, userId, cmd, callback) {
			var points = validatePoints(cmd.points);
			if (!points) {
				callback("invalid parameter", null);
			}
			else {
				var obj = {cmd:'poly', 
							create:ServerTime.getCurrentTime(),
							expire:ServerTime.getExpireTime(), 
							points:points}
				database.addSketch(userId, obj, function(err, data) {
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, obj);
					}
				});
			}
		},



		getFromMe: function(database, userId, callback) {
			_getFromMe(database, userId, callback);
		},

		getFromMyFollower: function(database, userId, callback) {
			_getFromMyFollower(database, userId, callback);
		}

	};

})();

module.exports = Sketch;