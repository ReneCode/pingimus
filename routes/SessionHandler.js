
//var Database = require('./db/database');
var User = require('./User');
var Sketch = require('./Sketch');

var SessionHandler = function (db) {

	var database = db;


	this.checkIfLoggedIn = function(req, res, next) {

		if (req.url == '/login'  ||
			req.url == '/signup') {
			return next();
		}

		var sessionId = req.cookies.session;
//		console.log("session:%s", sessionId);
		if (!sessionId) {
			res.redirect('/login');
		}
		else {
			database.getSession(sessionId, function(err, userid) {
				if (!err  &&  userid) {
					req.session.userid = userid;
					next();
				}
				else {
					console.log("session not found:%s",  sessionId);
					res.redirect('/login');
				}
			});
		}
	};


	this.handleLogin = function(req, res) {
		var userKey = req.body.username;
		var password = req.body.password;

		database.getUser(userKey, function(err, user) {
			if (user) {
				User.validatePassword(user, password, function(err, result) {
					if (result === true) {
						database.addSession(userKey, function(err, sessionId) {
							res.cookie('session', sessionId);
							res.redirect("/");
						});
					}
					else {
						res.render('login', {username:userKey, password:"", error:"invalid password"} );
					}
				});
			} 
			else {
				console.log("no user found");
				res.render('login', {username:userKey, password:"", error:"invalid user"} );
			}
		});



	};

	this.showLoginPage = function(req, res) {
		res.render('login', {username:"", password:"", error:""});
	};


	this.handleLogout = function(req, res) {
		var sessionId = req.cookies.session;

		database.deleteSession(sessionId, function(err, result) {
			res.clearCookie('session');
			res.redirect("/");
		});	
	}

	this.showSignupPage = function(req, res) {
		res.render('signup', {username:"", 
							password:"", 
							confirm_password:"", error:""});
	};

	this.handleSignup = function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
		var confirm_password = req.body.confirm_password;

		if (password != confirm_password) {
			return res.render('signup', {username:username, 
										password:"", 
										error:"password not identical"});			
		}
		database.existsUser(username, function(err, result) {
			if (!err  &&  result == true) {
				return res.render('signup', {username:username, 
										password:password, 
										confirm_password:password, 
										error:"username already is use"});			
			}

			// create user-object
			User.create(username, password, function(err, user) {
				if (err) {
					// todo
				}
				database.addUser(user, function(err, result) {
					if (err) {
						// todo
					}
					else {
						database.addSession(user.key, function(err, sessionId) {
							if (!err) {
								res.cookie('session', sessionId);
								return res.redirect("/");
							}
						});
					} 
				});
			});
		});
	};

	this.showRootPage = function(req, res) {
		var userId = req.session.userid;
		database.getUser(userId, function(err, user) {
			if (!err) {
				var allFollower = "";
				if (user.follower) {
					allFollower = user.follower.join(',');
				}
				res.render('index', {username:user.key, follower:allFollower});

			}
		});
	};

/*
	this.handleCommand = function(req, res) {
		var userId = req.session.userid;

		var cmd = req.body.cmd;
		var para = req.body.para;

		switch (cmd) {
			case 'dot':
		}

		console.dir(userId);
		console.dir(cmd);
		console.dir(para);

		res.send({cmd:cmd, result:true, para:para});

	};
	*/
};



module.exports = SessionHandler;
