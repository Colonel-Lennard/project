const loginForm = document.getElementById("form-login");
const loginButton = document.getElementById("login-submit");
var socket = io();
// var myUsername = 'Lennard Polierer';
// const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    var userdata = {
        username: loginForm.username.value, 
        password: loginForm.password.value,
        socketid: socket.id,  
    };
    socket.emit('login', userdata);
    socket.on('login-result', function(login){
        if (login == true){
            window.location.href = 'main.html';
            loginForm.username.value = '';
            loginForm.password.value = '';
        }else{
            alert('wrong password');
            loginForm.password.value = '';
        }
    });
});