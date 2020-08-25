var express = require('express');
const { domain } = require('process');
const { request } = require('http');
const { RequestError } = require('tedious');
const { isContext } = require('vm');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = [];
var activeSockets = new Array();
var rooms = [];

app.get('/', (req, res) => {
    res.sendFile('D:/Git/project/src/server/client/index.html');
});

app.use(express.static('login'));
app.use(express.static('client'));

io.on('connection', (socket) => {
    //add users array here
    // users.push(socket.id);
    io.emit('chat message', {
      from: socket.id,
      msg: 'user connected',
    });
    socket.on('chat message', (msg) => {
      var data = {
        from: socket.id,
        msg: msg,
      }
      io.emit('chat message', data);
      // console.log('message:' + msg);
    });
    socket.on('disconnect', () => {
      // delete users here
        io.emit('chat message', {
        from: socket.id,
        msg: 'user disconnected',
    })}
    );
    socket.on('login', (username, password) => {
      checkLogin(username, password);
      // users.push(new User(userName));
    });
    socket.on('signup', (password, username, email, birthday) => {
      console.log('about to create an account');  
      createAcccount(password, username, email, birthday);
    });
    socket.on('getUserList', (username) => {
      rooms[0] = {name: 'raum1', id: '0'};
      rooms[1] = {name: 'raum2', id: '1'};
      rooms[2] = {name: 'raum3', id: '2'};
      io.emit('returnUserList', rooms);
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

    function createAcccount(password, username, email, birthday){
      var options = { keepNulls: true };
      var bulkLoad = connection.newBulkLoad('Users', options, function (error, rowCount) {
        if (error){
          console.log(error);
        }
        console.log('inserted %d rows', rowCount);
      });
      
      // setup your columns - always indicate whether the column is nullable
      bulkLoad.addColumn('Password', TYPES.NVarChar, { nullable: false });
      bulkLoad.addColumn('Username', TYPES.NVarChar, { nullable: false });
      bulkLoad.addColumn('Email', TYPES.NVarChar, { nullable: false });
      // bulkLoad.addColumn('Birthday', TYPES.NVarChar, { nullable: false });
      // add rows
      bulkLoad.addRow(password, username, email); // birthday);
      
      
      // execute
      connection.execBulkLoad(bulkLoad);
      console.log('account created');
    }
      // request = new Request("INSERT Users (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);", function(err) {  
      //   if (err) {  
      //      console.log(err);}  
      //  });  
      //  request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');  
      //  request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');  
      //  request.addParameter('Cost', TYPES.Int, 11);  
      //  request.addParameter('Price', TYPES.Int,11);  
      //  request.on('row', function(columns) {  
      //      columns.forEach(function(column) {  
      //        if (column.value === null) {  
      //          console.log('NULL');  
      //        } else {  
      //          console.log("Product id of inserted item is " + column.value);  
      //        }  
      //      });  
      //  });       
      //  connection.execSql(request);  
    