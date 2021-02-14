const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const formatMessage = require('./message');

// Set static folder to display on the front-end
app.use(express.static(path.join(__dirname, 'public')));

const users = [];

// Run when client visits front-end page
io.on('connection', socket => {
	
	//When we recieve a join event from client
	socket.on('join', (name) => {
		//Emit join message to all clients
		io.emit('join', `${name} has entered the chat.`);
		const id = socket.conn.id;
		users.push({id, name});
	});

	//When we recieve a join event from client
	socket.on('message', (message) => {
		//Emit join message to all clients
		io.emit('message', formatMessage(message.name, message.msg));
	});


	socket.on('disconnect', () => {
		// Emits message to all clients to pingback their name to the server
		const disconnectedUserObj = users.find(user => user.id === socket.conn.id);
		const disconnectedUserIdx = users.indexOf(disconnectedUserObj);
		io.emit('disconnectedUser', users[disconnectedUserIdx].name); 
		users.splice(disconnectedUserIdx, 1);
	});


});

// assuming io is the Socket.IO server object – Fix for 503 errors crashing on Heroku
io.configure(function () { 
	io.set("transports", ["xhr-polling"]); 
	io.set("polling duration", 10); 
});

// Starts server
const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
	console.log(`running on ${PORT}`);
});

