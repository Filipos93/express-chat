'use strict';
var express = require('express');
var app = express();
var io = require('socket.io');

// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

var server  = app.listen(3000, function(){console.log('listening on port 3000')});
var io      = require('socket.io').listen(server);

io.on('connection', function(client){
	console.log('client connected');
	client.emit('message', {author: 'server', msg: 'Connected to chat'});

	client.on('join', function(data){
		client.nickname = data;
	});

	client.on('message', function (data){
		console.log(data);
		let message = {};
		message.msg = data.msg;
		message.author = client.nickname;
		client.broadcast.emit('message', message);
		client.emit('message', message);
	});
});


app.use(express.static('public'));

module.exports = app;