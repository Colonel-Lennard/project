const signUpButton = document.getElementById('signup-submit');
const signUpForm = document.getElementById('form-signup');
var socket = io();

signUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    password = signUpForm.password.value;
    if (password != signUpForm.passwordValidation.value ){
        alert('password does\'nt match');
    }
    username = signUpForm.username.value; 
    email = signUpForm.email.value;
    birthday = signUpForm.birthday.value;
    socket.emit('signup', password, username, email, birthday);
});

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};