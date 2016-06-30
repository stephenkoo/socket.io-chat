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
	connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnnected: %s sockets connected', connections.length); // Number of remaining sockets connected
});

server.listen(process.env.PORT || 3000);