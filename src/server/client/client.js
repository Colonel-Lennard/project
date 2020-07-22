var socket = io();
$(function () {
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', document.getElementById('message').value);
      document.getElementById('message').value = '';
      document.getElementById('inputRow').textContent = '';
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
    
    socket.on('chat input', function(username){
      if (document.getElementById('message').value == ''){
        document.getElementById('inputRow').textContent = '';
      }else{
        document.getElementById('inputRow').textContent = username + ' is typing...';
      }
    });
});

function onChatInput(username){
    socket.emit('chat input', myUsername);
};