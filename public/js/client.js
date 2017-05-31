'use strict';
$(function(){

	let socket = io.connect('http://localhost:3000');

	let insertMessage = function(message){
		let content = message.msg;
		let author = message.author;

		let $message = $(`<div class="alert alert-success"> <p class="author">${author}:</p> <span>${content}</span> </div>`);
		$('.chat-window').append($message);
	}

	socket.on('connect', function(data){
		let nickname = prompt("What is your nickname?");
		socket.emit('join', nickname);
		$('#nickname').html(nickname);
	});

	socket.on('message', function(data){
		insertMessage(data);
	});

	$('#chat-form').on('submit', function(e){
		e.preventDefault();
		var message = {};
		message.msg = $('#chat-input').val();
		// message.author = 'you';
		// insertMessage(message);
		socket.emit('message', message);
		this.reset();
	});

})
