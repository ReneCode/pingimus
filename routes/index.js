
var SessionHandler = require('./SessionHandler');

var route = function(app, database) {
	var sessionHandler = new SessionHandler(database);

	// middleware
	app.use( sessionHandler.checkIfLoggedIn );

	app.post('/login', sessionHandler.handleLogin );
	app.get ('/login', sessionHandler.showLoginPage );

	app.post('/signup', sessionHandler.handleSignup);
	app.get('/signup', sessionHandler.showSignupPage);

	app.get ('/', sessionHandler.showRootPage );
	
	app.get('/cmd', function(req, res) {
	//	console.dir(req.query);
		cmdRouter.route(req, res);
	});
};

module.exports = route;