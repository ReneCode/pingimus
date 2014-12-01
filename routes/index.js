
var SessionHandler = require('./SessionHandler');
var CommandHandler = require('./CommandHandler');

var route = function(app, database) {
	var sessionHandler = new SessionHandler(database);
	var commandHandler = new CommandHandler(database);

	// middleware
	app.use( sessionHandler.checkIfLoggedIn );

	app.post('/login', sessionHandler.handleLogin );
	app.get ('/login', sessionHandler.showLoginPage );

	app.post('/signup', sessionHandler.handleSignup);
	app.get('/signup', sessionHandler.showSignupPage);

	app.get('/logout', sessionHandler.handleLogout);

	app.get ('/', sessionHandler.showRootPage );
	
	app.post('/cmd', commandHandler.handleCommand);

	app.get('/test', function(req, res) {
	//	console.dir(req.query);
		cmdRouter.route(req, res);
	});
};

module.exports = route;