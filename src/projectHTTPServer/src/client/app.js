!function () {
    'use strict';
   
    var controls, socket;
   
    function initialize() {
      initializeControls();
      initializeSocketIo();
    }
   
    function initializeControls() {
      controls = {
        name: document.querySelector('#name'),
        newRoomName: document.querySelector('#new-room-name'),
        chatters: document.querySelector('#chatters'),
        rooms: document.querySelector('#rooms'),
        messageLog: document.querySelector('#message-log'),
        messageText: document.querySelector('#message-text'),
   
        nameForm: document.querySelector('#name-form'),
        newRoomForm: document.querySelector('#new-room-form'),
        addMessageForm: document.querySelector('#add-message-form')
      };
   
      controls.nameForm.addEventListener('submit', function (event) {
        event.preventDefault();
        changeName();
      });
   
      controls.newRoomForm.addEventListener('submit', function (event) {
        event.preventDefault();
        createRoom();
      });
   
      controls.addMessageForm.addEventListener('submit', function (event) {
        event.preventDefault();
        sendMessage();
      });
    }
   
    function initializeSocketIo() {
      socket = io.connect('http://localhost:8080');
   
      socket.on('connect', changeName);
      socket.on('rooms', refreshRooms);
      socket.on('message', function (message) {
        addMessage(message.message, message.from);
      });
    }
   
    window.addEventListener('load', initialize);

    function changeName() {
        var newName = controls.name.value;
        socket.emit('change-name', newName);
      }
       
      function createRoom() {
        var newRoom = controls.newRoomName.value;
        changeRoom(newRoom);
      }
       
      function changeRoom(roomName) {
        socket.emit('join-room', roomName);
        addMessage('You are now in room ' + roomName);
      }
       
      function refreshRooms(allRooms) {
        while (controls.rooms.firstChild) {
          controls.rooms.removeChild(controls.rooms.firstChild);
        }
       
        allRooms.forEach(function (room) {
          var item = createListItem(room);
       
          item.addEventListener('click', function () {
            changeRoom(room);
          });
       
          controls.rooms.appendChild(item);
        });
      }
       
      function addMessage(message, from) {
        var text = from ? '<strong>' + from + ':</strong> ' + message : message;
        controls.messageLog.appendChild(createListItem(text));
      }
       
      function sendMessage() {
        var message = controls.messageText.value;
        socket.emit('message', message);
        controls.messageText.value = '';
      }
       
      function createListItem(text) {
        var item = document.createElement('li');
        item.classList.add('list-group-item');
        item.innerHTML = text;
       
        return item;
      }
  }();