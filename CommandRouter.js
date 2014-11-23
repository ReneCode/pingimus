"use strict"


var Session = require('./session');
var Paint = require('./paint');
var Follow = require('./follow');

var CommandRouter = (function() {

	var _route = function(req, res) {
		var cmd = req.query.cmd;
		var userId = req.session.userId
		console.log("cmd from:%s:%s", userId, cmd);
		// var userId = req.query.userId;
		if (!cmd) {
			res.send("missing command.");
			return;
		}
		var sCmd = cmd.cmd;
		switch (sCmd.toLowerCase()) {
			case 'paint':
				Paint.paint(userId, cmd.data);
				break;

			case 'getpaint':
				var paint = Paint.getAllPaints(userId);
				res.send({cmd:sCmd, result:true, getpaint:paint});
				break;

			case 'follow':
				Follow.follow(userId, cmd.data);
				break;

			case 'getfollower':
				var follower = Follow.getMyFollower(userId);
				res.send({cmd:sCmd, result:true, follower:follower});
				break;
		}
	};



	return {
		route: function(req, res) {
			_route(req, res);
	},


	}
})();


module.exports = CommandRouter;