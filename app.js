
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routes/index');
var Database = require('./routes/db/database');

// for sessions
app.use(express.cookieParser());
app.use(express.session({secret:'try-key-pass'}));

// for POST request   req.body.xyz
app.use(express.bodyParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// development only
if (app.get('env') == 'development') {
	app.use(express.errorHandler());
}

console.log("try connecting to redis database...");

var database = new Database();
database.connect( function(err) {
	// route requests
	routes(app, database);

	var port = 8080;
	app.listen(port, function() {
		console.log('listening on %d', port);
	});
});




