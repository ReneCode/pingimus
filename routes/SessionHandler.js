
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
		if (!req.cookies.userId) {
			res.redirect('/login');
		}
		else {
			database.getUserIdFromSessionId(req.cookies.userId, function(err, user) {
				if (!err  &&  user.id) {
					req.session.user = user;
					next();
				}
				else {
					res.redirect('/login');
				}
			});
		}
		/*
		if (!req.session.userId) {
			if (req.url == '/login') {
				next();
			}
			else {
				res.render('login');
			}
		}
		else {
			next();
		}
		*/
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

	this.showSignupPage = function(req, res) {
		res.render('signup', {username:"", password:"", error:""});
	};

	this.handleSignup = function(req, res) {
		console.dir(req.body);
		var username = req.body.username;
		var password = req.body.password;
		var confirm_password = req.body.confirm_password;

		if (password != confirm_password) {
			return res.render('signup', {username:username, password:"", error:"password not identical"});			
		}
		// create user-object
		User.create(username, password, function(err, user) {
			if (err) {
				// todo
			}
			database.addNewUser(user, function(err, result) {
				if (err) {
					// todo
				}
				else {
					database.addNewSession(user, function(err, sessionId) {
						if (!err) {
							res.cookie('session', sessionId);
							return res.redirect("/welcome");
						}
					});

				} 

			});


		});
	};

	this.showRootPage = function(req, res) {
		res.render('index');
	};
};



module.exports = SessionHandler;
