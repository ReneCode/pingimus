var Sketch = require('./Sketch.js');
var User = require('./User.js');

var CommandHandler = function (db) {

	var database = db;


	this.handleCommand = function(req, res) {
		var userId = req.session.userid;

		var cmd = req.body.cmd;
		var para = JSON.parse(req.body.para);
/*
		console.dir(cmd);
		console.dir(para);
*/

		switch (cmd) {
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
				Sketch.getAll(database, userId, function(err, data) {
					if (!err) {
						res.send({cmd:cmd, para:data});
					}
				});
				break;

			case 'follow':
				User.follow(database, userId, para, function(err, user) {
					console.dir(para);
					if (!err  &&  user) {
						res.send({cmd:cmd, para:user.follower});
					}
				});


				break;


		}

//		res.send({cmd:cmd, result:true, para:para});

	};
};



module.exports = CommandHandler;

	
