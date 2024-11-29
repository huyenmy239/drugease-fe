import CONFIG from '../utils/settings.js';


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    
    signupForm.style.display = 'none';
    
    switchToLoginBtn.addEventListener('click', function () {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        switchToLoginBtn.classList.add('active');
        switchToSignupBtn.classList.remove('active');
    });
    
    switchToSignupBtn.addEventListener('click', function () {
        switchToSignupBtn.classList.add('active');
        switchToLoginBtn.classList.remove('active');
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = loginForm.querySelector('input[name="username"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        
        loginUser(username, password);
    });
    
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = signupForm.querySelector('input[name="username"]').value;
        const email = signupForm.querySelector('input[name="email"]').value;
        const password = signupForm.querySelector('input[name="password"]').value;
        const confirmPassword = signupForm.querySelector('input[name="confirm-password"]').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        registerUser(username, email, password);
    });
    
    // const baseURL = "http://127.0.0.1:8000/api/accounts/users/";
    const baseURL = `http://${CONFIG.BASE_URL}/api/accounts/users/`;
    let token = "";
    let role = "";

    async function loginUser(username, password) {
        const data = {
            username: username,
            password: password
        };
        
        try {
            const response = await fetch(`${baseURL}login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem("token", data.token);
                alert("Login successful!");

                window.location.href = "home.html";
            } else {
                alert("Login failed! Check your credentials.");
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    
    async function registerUser(username, email, password) {
        const data = {
            username: username,
            email: email,
            password: password
        };
        
        try {
            const response = await fetch(`${baseURL}register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();

            if (response.status === 201) {
                alert("Registration successful!");
                window.location.href = "signup.html";
            } else {
                alert(data.username + data.email);
            }
        } catch (error) {
            console.error(error);
            alert(data);
        }
    }
});
