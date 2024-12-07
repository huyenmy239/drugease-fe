document.addEventListener('DOMContentLoaded', function () {
    const signInButton = document.querySelector('.sign-in');
    const signUpButton = document.querySelector('.sign-up');
    const getStartedButton = document.querySelector('.get-started');

    signInButton.addEventListener('click', function () {
        window.location.href = 'signup.html#signin';
    });

    signUpButton.addEventListener('click', function () {
        window.location.href = 'signup.html#signup';
    });

    getStartedButton.addEventListener('click', function () {
        window.location.href = 'signup.html#signup';
    });
});
