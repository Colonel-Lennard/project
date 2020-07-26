const loginForm = document.getElementById("form-login");
const loginButton = document.getElementById("login-submit");
var socket = io();
// var myUsername = 'Lennard Polierer';
// const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    myUsername = loginForm.username.value;
    myPassword = loginForm.password.value;
    socket.emit('login', myUsername, myPassword);
    socket.on('login-result', function(login){
        if (login == true){
            // if (myPassword = password){
                window.location.href = 'main.html';
                loginForm.username.value = '';
                loginForm.password.value = '';
        }else{
            alert('wrong password');
            loginForm.password.value = '';
        }
        // }else{
        //     alert('wrong username or password');
        // }
    });
});