document.addEventListener('DOMContentLoaded', function() {
    // Các phần tử DOM
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const switchToLogin = document.getElementById('switch-to-login');
    const switchToSignup = document.getElementById('switch-to-signup');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginFromForgot = document.getElementById('back-to-login');

    // Xử lý điều hướng bằng anchor từ URL
    const hash = window.location.hash;
    if (hash === '#signin') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        switchToLogin.classList.add('active');
        switchToSignup.classList.remove('active');
    } else if (hash === '#signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
        switchToSignup.classList.add('active');
        switchToLogin.classList.remove('active');
    }

    // Các sự kiện chuyển đổi form (giữ nguyên từ đoạn mã đã có)
    switchToLogin.addEventListener('click', function() {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'none';
        switchToLogin.classList.add('active');
        switchToSignup.classList.remove('active');
    });

    switchToSignup.addEventListener('click', function() {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
        switchToSignup.classList.add('active');
        switchToLogin.classList.remove('active');
    });

    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
    });

    backToLoginFromForgot.addEventListener('click', function() {
        forgotPasswordForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
});
