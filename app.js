
var express = require('express');
var app = express();
var path = require('path');
var clients = require('./clientCollection');


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res) {
//	res.sendFile(path.join(__dirname, '/index.html'));
	res.render('index');
});

app.get('/cmd', function(req, res) {
	console.log("cmd:" + req.query.cmd);
});

var port = 8080;
app.listen(port, function() {
	console.log('listening on %d', port);
});


