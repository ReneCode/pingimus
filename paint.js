"use strict"


var Paint = function() {
	
	var list = [];

	var _paint = function(userId, cmd) {
		list.push( {userId:userId, cmd:cmd});
	}

	var _getAll = function(userId) {
		var myList = [];

		list.forEach( function(p) {
			if (p.userId == userId) {
				myList.push(p.cmd);
			}
		});
		return myList;
	}

	return {
		paint: function(userId, cmd) {
			_paint(userId, cmd);
		},

		getAll: function(userId) {

		}
	}
}();

module.exports = Paint;