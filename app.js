
var express = require('express');
var app = express();
var path = require('path');
var clients = require('./clientCollection');
var cmdRouter = require('./CommandRouter');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware
app.use( function(req, res, next) {
	console.log("request:%s %s", req.method, req.url);
	// TODO: check if user logged in
	next();
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/cmd', function(req, res) {
	console.dir(req.query);
	cmdRouter.route(req, res);
});

var port = 8080;
app.listen(port, function() {
	console.log('listening on %d', port);
});


