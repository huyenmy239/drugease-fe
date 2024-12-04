import CONFIG from '../utils/settings.js';

// Function to format the date to a "relative" time format (e.g., "3h ago")
function formatRelativeTime(dateString) {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000); // Difference in seconds

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Return relative time
    if (diffInYears > 0) {
        return `${diffInYears}y ago`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths}m ago`;
    } else if (diffInDays > 0) {
        return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}m ago`;
    } else {
        return `${diffInSeconds}s ago`;
    }
}

// Hàm debounce để giảm số lần gọi API
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Hàm gọi API
async function searchRooms(query) {

    query = query.trim();

    const response = await fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/room-active/?query=${query}`);
    const data = await response.json();

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    data.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.classList.add('card');
        roomCard.setAttribute('data-room-id', room.id); // Add the data-room-id attribute

        // Add the 'Join' button
        const joinButton = document.createElement('button');
        joinButton.classList.add('join-button');
        joinButton.innerText = 'Join';
        joinButton.id = 'join-btn';
        roomCard.appendChild(joinButton);

        // Thay đổi background image của roomCard
        // if (profileData.avatar && profileData.avatar.includes('/media/')) {
        //     profileData.avatar = profileData.avatar.replace('/media/', '/api/accounts/media/');
        // }
        if (room.background.bg) {
            let bg = room.background.bg;
            bg = bg.replace('/media/', '/api/rooms/media/');
            bg = `http://${CONFIG.BASE_URL}` + bg;
            roomCard.style.backgroundImage = `url(${bg})`;
        }

        // Create the card content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        // Add room title and conditionally add lock icon for private rooms
        const roomTitle = document.createElement('h3');
        roomTitle.innerHTML = room.title;
        if (room.is_private) {
            roomTitle.innerHTML += ' <i class="fas fa-lock"></i>'; // Add lock icon for private rooms
        }
        cardContent.appendChild(roomTitle);

        // Add room creation time
        const cardTimer = document.createElement('div');
        cardTimer.classList.add('card-timer');
        const clockIcon = document.createElement('i');
        clockIcon.classList.add('fas', 'fa-clock');
        cardTimer.appendChild(clockIcon);
        const creationTime = document.createElement('span');
        creationTime.innerText = `${formatRelativeTime(room.created_at)}`; // Use relative time format
        cardTimer.appendChild(creationTime);
        cardContent.appendChild(cardTimer);

        // Add the tags (topics) of the room
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags');

        // Show only the first two tags
        const visibleTags = room.subjects.slice(0, 2); // Get the first two subjects
        visibleTags.forEach(subject => {
            const tag = document.createElement('span');
            tag.innerText = `${subject.name}`;
            tagsContainer.appendChild(tag);
        });

        // Only show the "..." if there are more than 2 tags
        if (room.subjects.length > 2) {
            const moreTags = room.subjects.slice(2); // Get the remaining subjects
            const moreTagSpan = document.createElement('span');
            moreTagSpan.innerText = '...';

            // Add hidden tags
            moreTags.forEach(subject => {
                const tag = document.createElement('span');
                tag.innerText = `${subject.name}`;
                tag.classList.add('hidden-tag'); // Initially hide these tags
                tagsContainer.appendChild(tag);
            });

            // Append the '...' and handle hover functionality
            tagsContainer.appendChild(moreTagSpan);

            // Add hover functionality to show more tags
            moreTagSpan.addEventListener('mouseenter', () => {
                const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
                hiddenTags.forEach(tag => tag.style.display = 'inline-block'); // Show the hidden tags
            });

            moreTagSpan.addEventListener('mouseleave', () => {
                const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
                hiddenTags.forEach(tag => tag.style.display = 'none'); // Hide the hidden tags again
            });
        }

        // Append the tags container to the card content
        cardContent.appendChild(tagsContainer);


        // Append card content to the room card
        roomCard.appendChild(cardContent);

        // Create and append the card footer (showing members count)
        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');
        const memberCount = document.createElement('span');
        memberCount.innerText = room.members;
        cardFooter.appendChild(memberCount);
        const usersIcon = document.createElement('i');
        usersIcon.classList.add('fas', 'fa-users');
        cardFooter.appendChild(usersIcon);
        roomCard.appendChild(cardFooter);

        // Add the room card to the card container
        document.querySelector('.card-container').appendChild(roomCard);
    });
}

// Sự kiện khi người dùng gõ vào thanh tìm kiếm
document.getElementById('search-input').addEventListener('input', debounce(function (event) {
    searchRooms(event.target.value);
}, 500)); // 500ms delay trước khi gọi API

window.onload = function () {
    // You can either call it with an empty string or a specific query, for example:
    searchRooms('');
};



// Call API to create a room
document.addEventListener("DOMContentLoaded", function () {
    // Lấy nút tạo phòng và popup
    const createRoomBtn = document.querySelector('.create-room-btn');
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('create-room-form');

    // Lắng nghe sự kiện khi nhấn nút "+ Create"
    createRoomBtn.addEventListener('click', function () {
        // Fetch dữ liệu topics và backgrounds khi người dùng nhấn "Create"
        fetchTopicsAndBackgrounds().then(() => {
            // Sau khi fetch xong dữ liệu, mở form để người dùng có thể nhập dữ liệu phòng
            popup.classList.remove('hidden'); // Hiển thị form
        }).catch(error => {
            console.error('Error fetching topics or backgrounds:', error);
        });
    });

    // Hàm lấy token từ localStorage hoặc sessionStorage
    function getAuthToken() {
        return localStorage.getItem('token'); // Hoặc sessionStorage.getItem('auth_token');
    }

    // Hàm gọi API lấy danh sách topic và background
    function fetchTopicsAndBackgrounds() {
        return new Promise((resolve, reject) => {
            // Lấy token
            const token = getAuthToken();
            
            // Fetch topics và backgrounds cùng lúc, thêm token vào header
            Promise.all([
                fetch(`http://${CONFIG.BASE_URL}/api/rooms/subjects`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }).then(response => response.json()),
                fetch(`http://${CONFIG.BASE_URL}/api/rooms/backgrounds`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }).then(response => response.json())
            ])
            .then(([topicsData, backgroundsData]) => {
                // Xử lý dữ liệu topic
                const topicSelect = document.getElementById('room-topic');
                topicsData.forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic.id;
                    option.textContent = topic.name;
                    topicSelect.appendChild(option);
                });

                // Xử lý dữ liệu backgrounds
                const backgroundOptions = document.getElementById('background-options');
                backgroundsData.forEach((background, index) => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = 'background';
                    input.value = background.id;
                    input.dataset.bgImg = background.bg;
                    label.appendChild(input);

                    if (background.bg && background.bg.includes('/media/')) {
                        background.bg = background.bg.replace('/media/', '/api/rooms/media/');
                    }
                    console.log(background.bg);

                    const img = document.createElement('img');
                    img.src = background.bg;
                    img.classList.add('background-image');
                    img.alt = `cover${index + 1}`;
                    label.appendChild(img);

                    backgroundOptions.appendChild(label);
                });

                resolve();
            })
            .catch(error => reject(error));
        });
    }

    // Hàm lấy giá trị background đã chọn
    function getSelectedBackground() {
        const selectedBackground = document.querySelector('input[name="background"]:checked');
        return selectedBackground ? parseInt(selectedBackground.value) : null;
    }

    // Lắng nghe sự kiện submit của form
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const title = document.getElementById('room-title').value;
        const description = document.getElementById('room-description').value.trim() || '';
        const isPrivate = document.querySelector('input[name="mode"]:checked').value === "private";
        const enableMic = document.querySelector('input[name="mic"]:checked').value === "enable";
        const topic = Array.from(document.querySelectorAll('select[name="topic"] option:checked')).map(option => parseInt(option.value));
        const background = getSelectedBackground(); // Hàm để lấy background đã chọn
        
        const data = {
            title: title,
            description: description,
            is_private: isPrivate,
            background: background,
            enable_mic: enableMic,
            subject: topic
        };

        // Gọi API để tạo phòng
        createRoom(data);
    });

    // Hàm gọi API tạo phòng
    function createRoom(data) {
        // Lấy token
        const token = getAuthToken();

        fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` // Thêm token vào header
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Room created successfully:', result);
            // Hiển thị thông báo hoặc thực hiện các hành động sau khi tạo phòng thành công
            if (result && result.id) {
                // Redirect người dùng vào phòng mới
                window.location.href = `room.html?room_id=${result.id}`;
            } else {
                alert('Room created successfully, but no room URL returned.');
                popup.classList.add('hidden'); // Đóng form
                overlay.classList.add('hidden'); // Đóng overlay
            }
        })
        .catch(error => {
            console.error('Error creating room:', error);
            alert('Error creating room');
        });
    }
});
