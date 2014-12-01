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
				var obj = {cmd:'dot', exp:getExpire(), x:para.x, y:para.y}
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