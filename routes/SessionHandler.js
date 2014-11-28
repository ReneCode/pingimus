
var database = require('./db/database');

var SessionHandler = function (database) {



	this.checkIfLoggedIn = function(req, res, next) {
		var sessionId = req.cookies.session;

		database.getUser(sessionId, function(err, user) {

		});
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
	};



	this.handleLogin = function(req, res) {
		var userId = req.body.username;
		req.session.userId = userId;
		// login done - now goto main page
		res.redirect("/")
	};

	this.showLoginPage = function(req, res) {
		res.render('login');


	// var user = req.session.userId;
	// res.render('index', {user:user});

	};

	this.showRootPage = function(req, res) {
		res.render('index');
	}
};



module.exports = SessionHandler;
