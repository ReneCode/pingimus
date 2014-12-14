var Sketch = require('./Sketch.js');
var User = require('./User.js');
var ServerTime = require('./ServerTime.js');

var CommandHandler = function (db) {

	var database = db;


	this.handleCommand = function(req, res) {
		var userId = req.session.userid;

		var cmd = req.body.cmd;
		var para = JSON.parse(req.body.para);

		switch (cmd) {

			case 'cmdlist':
				var create = undefined;
				var expire = undefined;
				para.forEach(function(c) {

					console.dir(c);
				});
				res.send({cmd:cmd, para:{expire:ServerTime.getExpireTime(), 
										create:ServerTime.getCurrentTime()}});

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
					if (!err) {
						Sketch.getFromMe(database, userId, function(err, myData) {
							if (!err) {
								if (!data) {
									data = myData;
								}
								else {
									data = data.concat(myData);
								}
							}

//							console.dir(data);
							res.send({cmd:cmd, 
									stime:ServerTime.getCurrentTime(),
									para:data});

						});
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


		}

//		res.send({cmd:cmd, result:true, para:para});

	};
};



module.exports = CommandHandler;

	
