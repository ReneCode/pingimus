var Sketch = require('./Sketch.js');

var CommandHandler = function (db) {

	var database = db;



	this.handleDot = function(userId, para) {
		database.addSketch

	}

	this.handleCommand = function(req, res) {
		var userId = req.session.userid;

		var cmd = req.body.cmd;
		var para = JSON.parse(req.body.para);


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
				break
			case 'reload':
				console.log('reload');
				Sketch.getAll(database, userId, function(err, data) {
					if (!err) {
						res.send({cmd:cmd, para:data});
					}
				});
		}

//		res.send({cmd:cmd, result:true, para:para});

	};
};



module.exports = CommandHandler;

	
