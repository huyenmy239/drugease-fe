import CONFIG from '../utils/settings.js';

function joinRoom(roomId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Bạn cần đăng nhập để tham gia phòng.");
        return;
    }

    fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/${roomId}/join/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);

            if (data.message === "Bạn đã tham gia phòng thành công.") {
                window.location.href = `room.html?room_id=${roomId}`; // Ví dụ chuyển hướng đến trang phòng học
            }
        }
    })
    .catch(error => {
        console.error('Error joining room:', error);
        alert('Có lỗi xảy ra khi tham gia phòng.');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.card-container').addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('join-button')) {
            const card = event.target.closest('.card');
            if (card) {
                const roomId = card.getAttribute('data-room-id');
                console.log('Room ID from Join button click:', roomId);

                joinRoom(roomId);
            }
        }
    });

    const username = localStorage.getItem('username');
    
    if (username) {
        document.getElementById('username').innerText = username;
    }

    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const createRoomBtn = document.querySelector(".create-room-btn");
    const closePopupCancel = document.getElementById("close-popup");
    const backgroundOptions = document.querySelectorAll("#background-options img");
    const topicSelect = document.getElementById("room-topic");
    const selectedTopics = document.getElementById("selected-topics");
    const closePopupBtn = document.querySelector(".close-popup-btn");

    createRoomBtn.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        popup.classList.remove("hidden");
    });

    closePopupCancel.addEventListener("click", () => {
        overlay.classList.add("hidden");
        popup.classList.add("hidden");
    });

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

    backgroundOptions.forEach((img) => {
        img.addEventListener("click", () => {
            backgroundOptions.forEach((i) => i.classList.remove("selected"));
            img.classList.add("selected");
            const backgroundInput = document.querySelector("input[name='background']");
            if (backgroundInput) {
                backgroundInput.value = img.getAttribute("data-value");
            }
        });
    });

    topicSelect.addEventListener("change", () => {
        const selectedOptions = Array.from(topicSelect.selectedOptions);
        selectedTopics.innerHTML = "";
    
        selectedOptions.forEach(option => {
            const topic = option.text;
    
            if (![...selectedTopics.children].some((span) => span.textContent === topic)) {
                const span = document.createElement("span");
                span.textContent = topic;
                selectedTopics.appendChild(span);
    
                span.addEventListener("click", () => {
                    selectedTopics.removeChild(span);
                    
                    const optionToRemove = Array.from(topicSelect.options).find(opt => opt.text === topic);
                    if (optionToRemove) {
                        optionToRemove.selected = false;
                    }
                });
            }
        });
    });
});