var express = require('express');
const { domain } = require('process');
const { request } = require('http');
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
    socket.on('login'), (username, password) => {
      io.emit('login', checkLogin(username, password));
    }
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});

var Connection = require('tedious').Connection;  
    var config = {
      server: "LPLAPTOP.local",
      authentication: {
          type: "ntlm",
          options: {
              userName: "lennard.polierer",
              password: "SirHackALot_SBW1998",
              domain: "SBW",
          }
      },
      options: {
          port: 1433,
          database: "LOGINDIGITALCOLLAB",
          encrypt: false,
      }
    };  

    console.log(config);
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        if (err){
          console.log(err);
        }else{
          console.log('Database connected');
          // executeStatement();
        }
    });  
  
    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  
  
    function checkLogin(username, password) {  
        request = new Request("SELECT * FROM Users WHERE Username = " + username + " And Password = " + password + "", function(err, rowCount) {  
        if (err) {  
            console.log(err);}  
        });
        if (rowCount > 0){
          return true;
        }
        return false;
        var result = "";  
        request.
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            result ="";  
        });  
  
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        connection.execSql(request);  
    }  