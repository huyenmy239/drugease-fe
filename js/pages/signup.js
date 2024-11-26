document.addEventListener('DOMContentLoaded', function () {
    // Lấy các phần tử form
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Lấy các nút chuyển đổi giữa đăng nhập và đăng ký
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    
    // Đảm bảo rằng form đăng ký không hiển thị mặc định
    signupForm.style.display = 'none';
    
    // Chuyển đổi giữa form đăng nhập và đăng ký
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
    
    // Xử lý form đăng nhập
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Ngừng việc gửi form tự động
        
        const username = loginForm.querySelector('input[name="username"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        
        // Gọi API đăng nhập
        loginUser(username, password);
    });
    
    // Xử lý form đăng ký
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Ngừng việc gửi form tự động
        
        const username = signupForm.querySelector('input[name="username"]').value;
        const email = signupForm.querySelector('input[name="email"]').value;
        const password = signupForm.querySelector('input[name="password"]').value;
        const confirmPassword = signupForm.querySelector('input[name="confirm-password"]').value;
        
        // Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Gọi API đăng ký
        registerUser(username, email, password);
    });
    
    const baseURL = "http://127.0.0.1:8000/api/accounts/users/"; // Adjust base URL if needed
    let token = ""; // Store token after login
    let role = "";  // Store role (User/Admin)

    // Hàm gọi API đăng nhập
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
                // Save token to localStorage
                localStorage.setItem("token", data.token);
                alert("Login successful!");

                // Redirect to profile page
                window.location.href = "home.html";
            } else {
                alert("Login failed! Check your credentials.");
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    
    // Hàm gọi API đăng ký
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
                window.location.href = "home.html";
            } else {
                alert(data.username + data.email);
            }
        } catch (error) {
            console.error(error);
            alert(data);
        }
    }
});
