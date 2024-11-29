document.querySelectorAll('.join-button').forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'room.html';
    });
});
