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
		// Remove username which has disconnected
		if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();

		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnnected: %s sockets connected', connections.length); // Number of remaining sockets connected
	});

	// Send message
	socket.on('send message', function(data){
		// Testing if data sent from textarea is received in this function.
		console.log(data);
		// Currently, this will just emit data. When we implement usernames, make this include username as well.
		io.sockets.emit('new message', { msg: data, user: socket.username });
	});

	// New user. Pushes username in users array.
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	// So on client side, we will need to get 'get users'
	function updateUsernames(){
		io.sockets.emit('get users', users);
	};
});

server.listen(process.env.PORT || 3000);