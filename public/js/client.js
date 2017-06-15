'use strict';
$(function(){

	$('#chat-window').children('div').remove();

	let socket = io.connect('http://localhost:3000');

	let appendMessage = function(message){
		if(typeof message != 'object'){
			message = JSON.parse(message);
		};
		let content = message.msg;
		let author = message.author;

		let messageToAppend = $(`<div class="alert alert-success"> <p class="author">${author}:</p> <span>${content}</span> </div>`);
		messageToAppend.hide().appendTo('.chat-window').fadeIn(300);

		let chatWindow = $('.chat-window');
		let windowHeight = chatWindow[0].scrollHeight;
		chatWindow.scrollTop(windowHeight);
	}

	let appendUser = function(data, isYou){
		let userToAppend;
		if(isYou){
			userToAppend = $(`<a href="#" class="list-group-item you">${data}</a>`);
		}else{
			userToAppend = $(`<a href="#" data-name="${data}" class="list-group-item">${data}</a>`);
		}
		userToAppend.hide().appendTo('.users').fadeIn(300);
	}

	socket.on('connect', function(data){
		$('#nickNameModal').modal();
	});

	// on NickNameModal form submit
	$('#nickNameForm').on('submit', function(e){
			console.log('submitted');
			e.preventDefault();
			let nickname = $('#nickNameInput').val();
			socket.emit('join', nickname);
			$('#nickname').html(nickname);
			$('#nickNameModal').modal('hide');
			appendUser(nickname, true);
	});

	socket.on('message', function(data){
		appendMessage(data);
	});

	socket.on('new user joined', function(data){
		appendUser(data);
	});

	socket.on('user disconnected', function(data){
		$('.users a[data-name ='+data+']').remove();
		appendMessage({author: 'server ', msg: 'user ' + data +' disconnected from the chat'});
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
