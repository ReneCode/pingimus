"use strict"

var Follow = require('./follow');

var Paint = function() {
	
	var list = [];

	var _paint = function(userId, cmd) {
		list.push( {userId:userId, cmd:cmd});
	}

	var _getAllPaints = function(userId) {
		var allPaint = [];

		follower = Follow.whomDoIFollow(userId);
		list.forEach( function(p) {
			// if that paint was created by on user out of my follower-list
			// than that its paint.cmd
			if (follower.indexOf(p.userId) >= 0) {
				allPaint.push(p.cmd);
			}
		});
		return allPaint;
	}


	return {
		paint: function(userId, cmd) {
			_paint(userId, cmd);
		},

		getAllPaints: function(userId) {
			_getAllPaints(userId)
		}
	}
}();

module.exports = Paint;