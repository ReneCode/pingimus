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

	/**
		callback( {
			cmd: [cmd1, cmd2, cmd3],
			servertime: <servertime>,
			maxcreatetime: <time>
					})
	*/
	var _getFromMyFollower = function(database, userId, callback) {
		database.getUser(userId, function(err, oUser) {
			if (!oUser) {
				return callback(new Error('user not found'), null);
			}

			if (!oUser.follower) {
				// user follows no other
				oUser.follower = [];
			}
			var result = undefined;
			var serverTime = ServerTime.getCurrentTime();
			var maxCreate = 0;
			async.map(oUser.follower, 

				function(oneFollower,doneCb,c) {
					database.getSketch(oneFollower, function(err, data) {
						data.forEach(function(cmd) {
							if (cmd.expire > maxCreate) {
								cmd.color = 'red';
								if (!result) {
									result = [cmd];
								}
								else {
									result.push(cmd);
								}
								if (cmd.create > maxCreate) {
									maxCreate = cmd.create;
								}
							}
							else {
								// remove that cmd
								// TODO
							}
						});
						doneCb(null);
					});
				}, 
				function(err, r) {
					callback(null, {cmdlist:result, 
									servertime:serverTime, 
									maxcreatetime:maxCreate} );
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
							create:cmd.create,
							expire:cmd.expire, 
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
							create:cmd.create,
							expire:cmd.expire, 
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