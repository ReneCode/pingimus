var moment = require('moment');


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

	var getExpire = function() {
		return moment().add(10, 'm').valueOf();
	};


	var _getAll = function(database,  userId, callback) {
		database.getSketch(userId, function(err, data) {
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, data);
			}
		});
	}

	return {
		addDot: function(database, userId, para, callback) {
			if (!validateDot(para)) {
				callback("invalid parameter", null);
			}
			else {
				var obj = {cmd:'dot', exp:getExpire(), point: {x:para.x, y:para.y} };
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
				var obj = {cmd:'poly', exp:getExpire(), points:points}
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



		getAll: function(database, userId, callback) {
			_getAll(database, userId, callback);
		}
	};

})();

module.exports = Sketch;