'use strict';
var express = require('express');
var app = express();
var io = require('socket.io');
var redisClient = require('redis').createClient();

// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

var server  = app.listen(3000, function(){console.log('listening on port 3000')});
var io      = require('socket.io').listen(server);

var storeMessages = function(name, data){
	redisClient.lpush("messages", JSON.stringify({author: name, msg: data}), function(err, res){
		if(err){
			throw err;
		}
		console.log('messages stored in redis: ', res);
	});
	redisClient.ltrim("messages", 0, 9);
}

io.on('connection', function(client){
	console.log('client connected');
	client.emit('message', {author: 'server', msg: ' Connected to chat'});
	
	redisClient.lrange("messages", 0, -1, function(err, messages){
		// console.log(messages);
		messages = messages.reverse();
		messages.forEach(function(message){
			client.emit('message', message);
			console.log(message);
		});	
	});
	
	client.on('join', function(data){
		client.nickname = data;
		client.broadcast.emit('new user joined', data);
		redisClient.smembers("users", function(err, names) {
			names.forEach(function(name){	
			client.emit('new user joined', name);	
			});	
		});
		redisClient.sadd("users", data);
	});

	client.on('disconnect', function(name){
		client.broadcast.emit("user disconnected", client.nickname);
		redisClient.srem("users", client.nickname);	
	});

	client.on('message', function (data){
		console.log(data);
		let message = {};
		message.msg = data.msg;
		message.author = client.nickname;
		client.broadcast.emit('message', message);
		client.emit('message', message);
		storeMessages(client.nickname, data.msg);
	});
});


app.use(express.static('public'));

module.exports = app;