
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var clients = require('./clientCollection');


var users = {};
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
/*	
	if (!client.usernameSet) {
		client.emit('join', "please enter your name:");
	}
	*/
	client.on('join', function(user) {
//		client.set('name', user);
		client.name = user;
		client.usernameSet = true;
		console.log("user:" + user + " joined:");
//		clients.add(user);

		user[user] = client.id;
		client.join(user);
		if (user == 'a') 
	 		client.join('c');
	});	

	client.on('disconnect', function(name) {
		console.log('user:' + client.name + " disconnect");
//		clients.remove(name);
	});

	client.on('pmsg', function(msg) {
		// get the name of the client
//		client.get('name', function(err, name) {

		var name = client.name;
/*
		var arr = msg.split(',');
		var cmd = arr.shift();
		switch (cmd) {
			case 'follow':
//				clients.follow(name, cmd);
				break;
		}
*/
//		io.sockets.socket(users['a']).emit('pmsg', msg);
		io.to(name).emit('pmsg', msg);
//		io.to('c').emit('pmsg', msg);

		console.log(name + ':' + msg);
		// send back to client
//		client.emit('pmsg', msg);
		// send to all other clients
//		client.broadcast.emit('pmsg', msg);

//		});
	});
	// socket.on('disconnect', function(){
	// 	console.log('user disconnect');
	// });
});

var port = 8080;
server.listen(port, function() {
	console.log('listening on %d', port);
});


