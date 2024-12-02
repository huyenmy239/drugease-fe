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

    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const createRoomBtn = document.querySelector(".create-room-btn");
    const closePopupCancel = document.getElementById("close-popup");
    const backgroundOptions = document.querySelectorAll("#background-options img");
    const topicSelect = document.getElementById("room-topic");
    const selectedTopics = document.getElementById("selected-topics");
    const closePopupBtn = document.querySelector(".close-popup-btn");

    // Show popup
    createRoomBtn.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        popup.classList.remove("hidden");
    });

    // Hide popup
    closePopupCancel.addEventListener("click", () => {
        overlay.classList.add("hidden");
        popup.classList.add("hidden");
    });

    // Close popup when clicking outside
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.add("hidden");
            popup.classList.add("hidden");
        }
    });

    closePopupBtn.addEventListener("click", () => {
        overlay.classList.add("hidden");
        popup.classList.add("hidden");
    });

    // Select background
    backgroundOptions.forEach((img) => {
        img.addEventListener("click", () => {
            backgroundOptions.forEach((i) => i.classList.remove("selected"));
            img.classList.add("selected");
            // Set the value of the selected background to a hidden input
            const backgroundInput = document.querySelector("input[name='background']");
            if (backgroundInput) {
                backgroundInput.value = img.getAttribute("data-value");
            }
        });
    });

    // Handle topic selection
    topicSelect.addEventListener("change", () => {
        const topic = topicSelect.options[topicSelect.selectedIndex].text;
        if (![...selectedTopics.children].some((span) => span.textContent === topic)) {
            const span = document.createElement("span");
            span.textContent = topic;
            selectedTopics.appendChild(span);

            // Allow removal of topics by clicking on them
            span.addEventListener("click", () => {
                selectedTopics.removeChild(span);
            });
        }
    });
});