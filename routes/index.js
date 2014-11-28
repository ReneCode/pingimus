
var SessionHandler = require('./SessionHandler');
var sessionHandler = new SessionHandler();

var route = function(app) {

	// middleware
	app.use( sessionHandler.checkIfLoggedIn );

	app.post('/login', sessionHandler.handleLogin );
	app.get ('/login', sessionHandler.showLoginPage );

	app.get ('/', sessionHandler.showRootPage );
	
	app.get('/cmd', function(req, res) {
	//	console.dir(req.query);
		cmdRouter.route(req, res);
	});
};

module.exports = route;