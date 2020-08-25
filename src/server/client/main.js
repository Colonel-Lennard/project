var socket = io();
initializeRoomlist('');
// $(function () {
//     $('form').submit(function(e){
//       e.preventDefault(); // prevents page reloading
//       socket.emit('chat message', document.getElementById('message-input').value);
//       document.getElementById('message-input').value = '';
//       document.getElementById('inputRow').textContent = '';
//       return false;
//     });
//     socket.on('chat message', function(data){
//       $('#messages').append($('<li>').text(data.msg));
//     });
    
//     socket.on('chat input', function(username){
//       if (document.getElementById('message-input').value == ''){
//         document.getElementById('inputRow').textContent = '';
//       }else{
//         document.getElementById('inputRow').textContent = username + ' is typing...';
//       }
//     });
// });

function initializeRoomlist(username){
    socket.emit('getUserList', username);
};

socket.on('returnUserList', (rooms) => {
  var userList = document.getElementById('rooms');
  for (i = 0; i > rooms.length -1; i++){
    userList.append($('<li>').text(rooms[i].name));
  }
});

navigator.getUserMedia(
  { video: true, audio: true },
  stream => {
    const localVideo = document.getElementById("local-video");
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  },
  error => {
    console.warn(error.message);
  }
 );

//  socket.on("update-user-list", ({ users }) => {
//   updateUserList(users);
//  });
  
//  socket.on("remove-user", ({ socketId }) => {
//   const elToRemove = document.getElementById(socketId);
  
//   if (elToRemove) {
//     elToRemove.remove();
//   }
//  });

//  function updateUserList(socketIds) {
//   const activeUserContainer = document.getElementById("active-user-container");
  
//   socketIds.forEach(socketId => {
//     const alreadyExistingUser = document.getElementById(socketId);
//     if (!alreadyExistingUser) {
//       const userContainerEl = createUserItemContainer(socketId);
//       activeUserContainer.appendChild(userContainerEl);
//     }
//   });
//  }

 
// function createUserItemContainer(socketId) {
//   const userContainerEl = document.createElement("div");
  
//   const usernameEl = document.createElement("p");
  
//   userContainerEl.setAttribute("class", "active-user");
//   userContainerEl.setAttribute("id", socketId);
//   usernameEl.setAttribute("class", "username");
//   usernameEl.innerHTML = `Socket: ${socketId}`;
  
//   userContainerEl.appendChild(usernameEl);
  
//   userContainerEl.addEventListener("click", () => {
//     unselectUsersFromList();
//     userContainerEl.setAttribute("class", "active-user active-user--selected");
//     const talkingWithInfo = document.getElementById("talking-with-info");
//     talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
//     callUser(socketId);
//   }); 
//   return userContainerEl;
//  }