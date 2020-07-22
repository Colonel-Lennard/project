var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile('D:/Git/project/src/server/client/index.html');
    // res.sendFile('D:/Git/project/src/projectHTTPServer/src/client/main.html');
});

app.use(express.static('login'));
app.use(express.static('client'));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      console.log('message:' + msg);
    });
    io.emit('chat message', 'user connected');
    socket.on('disconnect', () => {
        io.emit('chat message', 'user disconnected');
    });
    socket.on('chat input', (username) => {
        io.emit('chat input', username);
    });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});