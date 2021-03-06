var Sketch = require('./Sketch.js');
var User = require('./user.js');
var ServerTime = require('./ServerTime.js');
var async = require('async');

var CommandHandler = function (db) {
	var database = db;

	this.handleCommand = function(req, res) {
		var userId = req.session.userid;

		var cmd = req.body.cmd;
		var para = JSON.parse(req.body.para);

		switch (cmd) {

			case 'cmdlist':
				async.map(para,
					// function for each element
					function(oneCmd, doneCb, c) {
						switch (oneCmd.cmd) {
							case 'dot':
								Sketch.addDot(database, userId, oneCmd, function(err, data) {
									doneCb(null);
								});
								break;
							case 'poly':
								Sketch.addPolygon(database, userId, oneCmd, function(err, data) {
									doneCb(null);
								});
								break;
						}
					},
					// final function
					function(err, r) {
						res.send({cmd:cmd, para:{expire:expire, create:create}});
					}
				);
				break;

			case 'dot':
				Sketch.addDot(database, userId, para, function(err, data) {
					if (!err) {
						res.send({cmd:cmd, para:data});
					}
				});
				break;

			case 'poly':
				Sketch.addPolygon(database, userId, para, function(err, data) {
					if (!err) {
						res.send({cmd:cmd, para:data});
					}
				});
				break;

			case 'reload':
				Sketch.getFromMyFollower(database, userId, function(err, data) {
					if (!err  && data) {
						if (data.cmdlist) {
//							console.log("reload:%d, servertime:%d", data.cmdlist.length, data.servertime);
						}

						res.send({cmd:cmd, 
							servertime: (data.servertime - 10*1000),
							maxcreatetime:data.maxcreatetime,
							cmdlist:data.cmdlist});
					}
				});
				break;

			case 'follow':
				User.follow(database, userId, para, function(err, user) {
					if (!err  &&  user) {
						console.log("%s follows %s", userId, user.follower)
						res.send({cmd:cmd, para:user.follower});
					}
				});
				break;


			case 'flushdb':
				database.clearDb();
				break;

		}

//		res.send({cmd:cmd, result:true, para:para});

	};
};



module.exports = CommandHandler;

	
