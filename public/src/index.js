

const BaseUrl = "http://localhost:8080";
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const signup = document.getElementById('createForm');
const roomSelect = document.getElementById('room');
const taskList = document.getElementById('task-list');


function addRoom() {
  const roomInput = document.getElementById('RoomName');
  const roomValue = roomInput.value;
  const option = new Option(roomValue, roomValue);
  roomSelect.appendChild(option);

  alert('Room added!');
  window.location = '../join.html';
};
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users}) => {
  outputRoomName(room);
  outputUsers(users);
  
});

socket.on('viewTask', (task) => {
  console.log('in socket.on createTasks');
  outputTasks(task);
});

socket.on('Projects', ({ room }) => {
  outputRoomName(room);

});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("initialTasks", (initialTasks) => {
  const taskList = document.getElementById('task-list');
taskList.innerHTML='';
  initialTasks.forEach((task) => {
    const listCard = `
    <li>
      <input type="checkbox" id="task-${task.id}" name="task-${task.id}">
      <label for="task-${task.id}">${task.name}</label>
    </li>`;
    taskList.innerHTML+=listCard;
  });
});


// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username + ' ';
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
function outputTasks(tasks) {
  const taskList = document.getElementById('task-list');

  console.log('in outputTasks');
  if (!taskList) {
    console.error("Task list element not found.");
    return;
  }
  taskList.innerHTML='';

  tasks.forEach((task) => {
    const listCard = `
      <li>
        <input type="checkbox" id="task-${task.id}" name="task-${task.id}">
        <label for="task-${task.id}">${task.name}</label>
      </li>`;
      taskList.innerHTML+=listCard;
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../join.html';
  } else {
  }
});


function createTask() {

  const taskName = prompt("Enter the task name:");
  const task = {
    name: taskName
  }
  console.log('in create task function');
  socket.emit("createTask", task);
}


