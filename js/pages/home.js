document.addEventListener("DOMContentLoaded", function () {
    // Event delegation on the card-container for "Join" buttons
    document.querySelector('.card-container').addEventListener('click', function (event) {
        // Check if the clicked element is a 'join-button'
        if (event.target && event.target.classList.contains('join-button')) {
            // Find the parent card element
            const card = event.target.closest('.card');
            if (card) {
                const roomId = card.getAttribute('data-room-id'); // Get room id from data attribute
                console.log('Room ID from Join button click:', roomId);

                // Redirect to room page with the room id
                window.location.href = `room.html?room_id=${roomId}`;
            }
        }
    });

    const username = localStorage.getItem('username'); // Replace with actual method to get the current username
    
    if (username) {
        document.getElementById('username').innerText = username; // Replace with the current username
    }
});