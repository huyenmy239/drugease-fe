// Thêm sự kiện cho các nút điều hướng
document.addEventListener('DOMContentLoaded', function () {
    const signInButton = document.querySelector('.sign-in');
    const signUpButton = document.querySelector('.sign-up');
    const getStartedButton = document.querySelector('.get-started');

    // Chuyển hướng đến trang đăng nhập
    signInButton.addEventListener('click', function () {
        window.location.href = 'signup.html#signin';
    });

    // Chuyển hướng đến trang đăng ký
    signUpButton.addEventListener('click', function () {
        window.location.href = 'signup.html#signup';
    });

    // Chuyển hướng đến trang đăng ký khi nhấp vào "Get Started"
    getStartedButton.addEventListener('click', function () {
        window.location.href = 'signup.html#signup';
    });
});
