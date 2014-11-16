"use strict"


var Session = require('./session');
var Paint = require('./paint');
var Follow = require('./follow');

var CommandRouter = (function() {

	var _route = function(req, res) {
		var cmd = req.query.cmd;
		var userId = req.query.userId;
		if (!cmd) {
			res.send("missing command.");
			return;
		}
		var sCmd = cmd.cmd;
		switch (sCmd.toLowerCase()) {
			case 'login':
				var userId = Session.login(cmd.data);
				if (userId) {
//					req.session.user = userId;
					res.send({cmd:sCmd, result: true, userId:userId});
				};
				break;

			case 'paint':
				Paint.cmd(userId, cmd.data);
				break;

			case 'follow':
				Follow.follow(userId, cmd.Data);
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