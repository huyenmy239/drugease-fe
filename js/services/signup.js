import CONFIG from '../utils/settings.js';


// const baseURL = "http://127.0.0.1:8000/api/accounts/users/"; // Adjust base URL if needed
const baseURL = `http://${CONFIG.BASE_URL}/api/accounts/users`; // Adjust base URL if needed
let token = ""; // Store token after login
let role = "";  // Store role (User/Admin)

// Register API
async function register() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch(`${baseURL}register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        document.getElementById("register-response").innerText = JSON.stringify(data, null, 2);

        if (response.status === 201) {
            alert("Registration successful! Please login.");
        }
    } catch (error) {
        console.error(error);
    }
}

// Login API
async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${baseURL}login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        document.getElementById("login-response").innerText = JSON.stringify(data, null, 2);

        if (response.status === 200) {
            // Save token to localStorage
            localStorage.setItem("token", data.token);

            // Redirect to profile page
            window.location.href = "pro.html";
        } else {
            alert("Login failed! Check your credentials.");
        }
    } catch (error) {
        console.error(error);
    }
}