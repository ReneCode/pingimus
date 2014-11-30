
//var Database = require('./db/database');
var User = require('./user');

var SessionHandler = function (db) {

	var database = db;


	this.checkIfLoggedIn = function(req, res, next) {

		if (req.url == '/login'  ||
			req.url == '/signup') {
			return next();
		}

		var sessionId = req.cookies.session;
		console.dir(sessionId);
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
		var userId = req.body.username;
		req.session.userId = userId;
		// login done - now goto main page
		res.redirect("/")
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
		res.render('signup', {username:"", password:"", confirm_password:"", error:""});
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
			console.log("check:%s, result:%s", username, result);
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
								res.cookie('session', sessionId, { maxAge: 3600, httpOnly: true });
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
				res.render('index', {username:user.key});

			}
		})
	};
};



module.exports = SessionHandler;
