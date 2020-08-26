// import User from './User.js';
var express = require('express');
const { domain } = require('process');
const { request } = require('http');
const { RequestError } = require('tedious');
const { isContext } = require('vm');
var app = express();
var http = require('http').createServer(app);
var users = [];
var rooms = [];

app.get('/', (req, res) => {
    res.sendFile('D:/Git/project/src/server/client/index.html');
});


io.on('connection', (socket) => {
    console.log('connection initiated '+ socket.id);
    socket.on('login', (userdata) => {
        console.log('on to check login for: ' + userdata);
        checkLogin(userdata, socket);
    });
    socket.on('logout', function(userdata) {
        if (socket.handshake.session.userdata) {
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        }
    });  
    //add users array here
    // users.push(new User());
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
      removeUser(socket.id, 'user disconnected');
    });
    // socket.on('login', (username, password, socketid) => {
      
    //   // users.push(new User(userName));
    // });
    socket.on('isUserLoggedIn', (socketid) => {
      socket.emit('returnUserLoggedIn', users.find(element => element.userName == socketid) != null);
    });
    socket.on('signup', (password, username, email, birthday) => {
      console.log('about to create an account');  
      createAcccount(password, username, email, birthday);
    });
    // socket.on('logout', (socketid) => {
    //   removeUser(socket.id, 'user logged out');
    //   console.log(socket.id);
    // });
    socket.on('getMyUserName', (socketid) =>{
      var foundElement = users.find(element => element.socketid == socketid);
      console.log('getMyUserName = ' + foundElement.userName);
      socket.emit('returnMyUserName', foundElement.userName);
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

function removeUser(socketid, message){
  var foundElement = users.find(element => element.socketid == socketid); //find user in users array with socket id
  io.emit('chat message', {
  from: socketid,
  msg: message,
  })
  delete users[foundElement]; //delete found user
  console.log(users);
}

var Connection = require('tedious').Connection;  
    var config = {
      server: "LPLAPTOP.local",
      authentication: {
          type: "default", //ntlm
          options: {
              userName: "sa",
              password: "sysman$42",
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
  
    function checkLogin(userdata, socket) {
        var request = new Request("select * from dbo.Users where Username = '" + userdata.username + "' And Password = '" + userdata.password + "'", function(err) {  
          if (err) {  
            console.log(err);}
        });
        request.on('done', function(rowCount, more, rows) {  
          console.log(rowCount);
          if (rowCount > 0){
            console.log('logged in');
            io.emit('login-result', true);
            user = new User(userdata);
            user.setAdminRights();
            users.push(user);
            socket.handshake.session.userdata = userdata;
            socket.handshake.session.save();
          } else{
            console.log('not logged in');
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
      bulkLoad.addColumn('IsAdmin', Types.Boolean, {nullable: false});
      // bulkLoad.addColumn('Birthday', TYPES.NVarChar, { nullable: false });
      // add rows
      bulkLoad.addRow(password, username, email, 0); // birthday);
      
      
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
    class User{
      userName;
      socketID;
      canUploadDocument = true;
      canDownLoadDocument = true;
      canUseMic = true;
      canUseCam = true;
      canShareScreen = true;
      canCreateRoom = false;
      canDeleteRoom = false;
      canCreateUser = false;
      canDeleteUser = false;
      canChangeUser = false;
      canGiveUserRights = false;
      canKickUser = false;
  
      constructor (userdata){
          this.userName = userdata.userName;
          this.socketID = userdata.socketID;
      }
  
      setAdminRights(){
          this.canCreateRoom = true;
          this.canDeleteRoom = true;
          this.canCreateUser = true;
          this.canDeleteUser = true;
          this.canChangeUser = true;
          this.canGiveUserRights = true;
          this.canKickUser = true;
      }
    }