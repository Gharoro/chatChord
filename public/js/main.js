const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatRoom
socket.emit('joinRoom', { username, room });

// Get room users
socket.on('roomUsers', ({ room, users }) => {
    ouputRoomName(room);
    ouputRoomUsers(users);

});

// Get message from server
socket.on('message', (message) => {
    ouputMessage(message);
    //Auto scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Send chat messages via form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    // Emit msg to server
    socket.emit('chatMessage', msg);
    // Clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
const ouputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
};

// Output room name to DOM
const ouputRoomName = (room) => {
    roomName.innerText = room;
};

// Add users to DOM
const ouputRoomUsers = (users) => {
    userList.innerHTML = `
        ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `;
};