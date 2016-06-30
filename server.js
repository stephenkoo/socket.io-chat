var express = require('express'),
	app     = express(),
	server  = require('http').createServer(app);
	io      = require('socket.io').listen(server);

var users       = [],
	connections = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket); // Push socket in connections array. 
	console.log('Connected: %s sockets connected.', connections.length); // Number of sockets connected

	// Disconnect
	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnnected: %s sockets connected', connections.length); // Number of remaining sockets connected
	});

	// Send message
	socket.on('send message', function(data){
		// Currently, this will just emit data. When we implement usernames, make this include username as well.
		io.sockets.emit('new message', { msg: data });
	});
});

server.listen(process.env.PORT || 3000);