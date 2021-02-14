formEl = document.getElementById('form');
messagesEl = document.getElementById('messages');

// Initialise client-side socket
const socket = io();

//Get name from query string and sends join event to server
const {name} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});
socket.emit('join', name);

// Listens for join event to be passed back from server
socket.on('join', messsage => {
	const div = document.createElement('div', 'mb-2');
	div.classList.add('notification');
	div.innerHTML = `<p class="message-body">${messsage}</p>`;
	messagesEl.appendChild(div);
});

socket.on('userCheck', () => {
	socket.emit('userNamePingback', name);
})

formEl.addEventListener('submit', (e) =>{
	e.preventDefault();
	const msg = e.target.elements['message'].value;
	if(msg.length > 0) {
		e.target.elements['message'].value = "";
		socket.emit('message', {name, msg});
	}
});

socket.on('message', (obj) => {
	const div = document.createElement('div');
	div.classList.add('message', 'bg-purple-100', 'my-2', 'rounded-md', 'p-3');
	div.innerHTML = `
		<div class="flex flex-wrap items-center space-x-2">
			<p class="name text-xs sm:text-small mb-1">${obj.name}</p>
			<p class="time text-xs text-purple-500 mb-1">${obj.time}</p>
		</div>
		<p class="message-body text-small sm:text-base">${obj.message}</p>
	`;
	messagesEl.appendChild(div);

	messagesEl.scrollTop = messagesEl.scrollHeight;
});

socket.on('disconnectedUser', (obj) => {
	const div = document.createElement('div', 'mb-2');
	div.classList.add('notification');
	div.innerHTML = `<p class="message-body">${obj} has left the chat</p>`;
	messagesEl.appendChild(div);
})