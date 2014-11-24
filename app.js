
var express = require('express');
var app = express();
var path = require('path');
var clients = require('./clientCollection');
var cmdRouter = require('./CommandRouter');

// for sessions
app.use(express.cookieParser());
app.use(express.session({secret:'try-key-pass'}));

// for POST request   req.body.xyz
app.use(express.bodyParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use( function(req, res, next) {
//	console.log("request:%s %s", req.method, req.url);

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

});

app.post('/login', function(req, res) {
	console.log("login:%s", req.body.username);
	var userId = req.body.username;
	req.session.userId = userId;
	// login done - now goto main page
	res.redirect("/")
});

app.get('/', function(req, res) {
	var user = req.session.userId;
	res.render('index', {user:user});
});

app.get('/cmd', function(req, res) {
//	console.dir(req.query);
	cmdRouter.route(req, res);
});

var port = 8080;
app.listen(port, function() {
	console.log('listening on %d', port);
});


