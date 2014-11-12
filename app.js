
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//var route = require('./route/index.js');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res) {
//	res.sendFile(path.join(__dirname, '/index.html'));
	res.render('index');
});


io.on('connection', function(client){
	console.log('a user connected');
	if (!client.usernameSet) {
		client.emit('join', "please enter your name:");
	}
	client.on('join', function(user) {
		client.username = user;
		client.usernameSet = true;
		console.log("user:" + user + " joined:");
	});	
	client.on('pmsg', function(msg) {
		console.log(client.username + ':' + msg);
		// send back to client
		client.emit('pmsg', msg);
		// send to all other clients
		client.broadcast.emit('pmsg', msg);
	});
	// socket.on('disconnect', function(){
	// 	console.log('user disconnect');
	// });
});

var port = 8080;
server.listen(port, function() {
	console.log('listening on %d', port);
});


