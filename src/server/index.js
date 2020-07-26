var express = require('express');
const { domain } = require('process');
const { request } = require('http');
const { RequestError } = require('tedious');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = [];

app.get('/', (req, res) => {
    res.sendFile('D:/Git/project/src/server/client/index.html');
    // res.sendFile('D:/Git/project/src/projectHTTPServer/src/client/main.html');
});

app.use(express.static('login'));
app.use(express.static('client'));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      var data = {
        from: socketid,
        msg: msg,
      }
      io.emit('chat message', data);
      // console.log('message:' + msg);
    });
    io.emit('chat message', 'user connected');
    socket.on('disconnect', () => {
        io.emit('chat message', 'user disconnected');
    });
    socket.on('login', (username, password) => {
      checkLogin(username, password);
      // users[socketid] = username; 
    });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});

var Connection = require('tedious').Connection;  
    var config = {
      server: "LPLAPTOP.local",
      authentication: {
          type: "default", //ntlm
          options: {
              userName: "testuser",
              password: "testuser123",
              domain: "SBW",
          }
      },
      options: {
          port: 1433,
          database: "DIGITALCOLLAB",
          encrypt: false,
      }
    };  

    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        if (err){
          console.log(err);
        }else{
          console.log('Database connected');
          // checkLogin('test', 'test');
          // console.log(bool);
          // executeStatement();
        }
    });  
  
    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  
  
    function checkLogin(username, password) {
        var request = new Request("select * from dbo.Users where Username = '" + username + "' And Password = '" + password + "'", function(err) {  
          if (err) {  
            console.log(err);}
        });
        // var result = "";  
        // request.on('row', function(columns) {  
        //     columns.forEach(function(column) {  
        //       if (column.value === null) {  
        //         console.log('NULL');  
        //       } else {  
        //         result+= column.value + " ";  
        //       }  
        //     });  
        //     console.log(result);  
        //     result ="";  
        // });  
        request.on('done', function(rowCount, more, rows) {  
          console.log(rowCount);
          if (rowCount > 0){
            io.emit('login-result', true);
          } else{
            io.emit('login-result', false);
          }
        }); 
        connection.execSqlBatch(request);
    }  