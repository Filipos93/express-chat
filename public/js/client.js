'use strict';
$(function(){

	$('#chat-window').children('div').remove();

	let socket = io.connect('http://localhost:3000');

	let insertMessage = function(message){
		if(typeof message != 'object'){
			message = JSON.parse(message);
		};
		let content = message.msg;
		let author = message.author;

		let messageToAppend = $(`<div class="alert alert-success"> <p class="author">${author}:</p> <span>${content}</span> </div>`);
		messageToAppend.hide().appendTo('.chat-window').fadeIn(300);
	}

	socket.on('connect', function(data){
		let nickname = prompt("What is your nickname?");
		socket.emit('join', nickname);
		$('#nickname').html(nickname);
	});

	socket.on('message', function(data){
		insertMessage(data);
		let chatWindow = $('.chat-window');
		let windowHeight = chatWindow[0].scrollHeight;
		chatWindow.scrollTop(windowHeight);
	});

	$('#chat-form').on('submit', function(e){
		e.preventDefault();
		let message = {};
		let chatInput = $('#chat-input');
		message.msg = chatInput.val();
		socket.emit('message', message);
		this.reset();
		chatInput.focus();
	});

})
