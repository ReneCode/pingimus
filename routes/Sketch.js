var ServerTime = require('./ServerTime.js')
var User = require('./user.js');

var async = require('async');


var Sketch = (function() {


	var validateDot = function(para) {
		if (typeof para["x"] === 'number'  &&  Math.floor(para.x) === para.x  &&
			typeof para["y"] === 'number'  &&  Math.floor(para.y) === para.y) {
			return true;
		}
		else {
			return false;
		}

	};



	var validatePolygon = function(para) {
		var points = [];
		para.forEach(function(p) {
			if (!validateDot(p)) {
				return undefined;
			}
			points.push({x:p.x,y:p.y});
		});
		return points;
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
			async.map(oUser.follower, 
				function(oneFollower,doneCb,c) {
					database.getSketch(oneFollower, function(err, data) {
						data.forEach(function(c) {
							result.push(c);
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
		addDot: function(database, userId, para, callback) {
			if (!validateDot(para)) {
				callback("invalid parameter", null);
			}
			else {
				var obj = {cmd:'dot', 
							create:ServerTime.getCurrentTime(),
							expire:ServerTime.getExpireTime(), 
							point: {x:para.x, y:para.y} };
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

		addPolygon: function(database, userId, para, callback) {
			var points = validatePolygon(para);
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