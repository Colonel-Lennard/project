const loginForm = document.getElementById("form-login");
const loginButton = document.getElementById("login-submit");
// const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "admin" && password === "admin") {
        alert("You have successfully logged in.");
        window.location.href = "index.html";
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})