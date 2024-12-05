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

let autoSearchInterval;

async function searchRooms(query) {

    query = query.trim();

    const response = await fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/room-active/?query=${query}`);
    const data = await response.json();

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    data.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.classList.add('card');
        roomCard.setAttribute('data-room-id', room.id);

        const joinButton = document.createElement('button');
        joinButton.classList.add('join-button');
        joinButton.innerText = 'Join';
        joinButton.id = 'join-btn';
        roomCard.appendChild(joinButton);

        if (room.background.bg) {
            let bg = room.background.bg;
            bg = bg.replace('/media/', '/api/rooms/media/');
            bg = `http://${CONFIG.BASE_URL}` + bg;
            roomCard.style.backgroundImage = `url(${bg})`;
        }

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const roomTitle = document.createElement('h3');
        roomTitle.innerHTML = room.title;
        if (room.is_private) {
            roomTitle.innerHTML += ' <i class="fas fa-lock"></i>';
        }
        cardContent.appendChild(roomTitle);

        const cardTimer = document.createElement('div');
        cardTimer.classList.add('card-timer');
        const clockIcon = document.createElement('i');
        clockIcon.classList.add('fas', 'fa-clock');
        cardTimer.appendChild(clockIcon);
        const creationTime = document.createElement('span');
        creationTime.innerText = `${formatRelativeTime(room.created_at)}`;
        cardTimer.appendChild(creationTime);
        cardContent.appendChild(cardTimer);

        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('tags');

        const visibleTags = room.subjects.slice(0, 2);
        visibleTags.forEach(subject => {
            const tag = document.createElement('span');
            tag.innerText = `${subject.name}`;
            tagsContainer.appendChild(tag);
        });

        if (room.subjects.length > 2) {
            const moreTags = room.subjects.slice(2);
            const moreTagSpan = document.createElement('span');
            moreTagSpan.innerText = '...';

            moreTags.forEach(subject => {
                const tag = document.createElement('span');
                tag.innerText = `${subject.name}`;
                tag.classList.add('hidden-tag');
                tagsContainer.appendChild(tag);
            });

            tagsContainer.appendChild(moreTagSpan);

            moreTagSpan.addEventListener('mouseenter', () => {
                const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
                hiddenTags.forEach(tag => tag.style.display = 'inline-block');
            });

            moreTagSpan.addEventListener('mouseleave', () => {
                const hiddenTags = tagsContainer.querySelectorAll('.hidden-tag');
                hiddenTags.forEach(tag => tag.style.display = 'none');
            });
        }

        cardContent.appendChild(tagsContainer);

        roomCard.appendChild(cardContent);

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');
        const memberCount = document.createElement('span');
        memberCount.innerText = room.members;
        cardFooter.appendChild(memberCount);
        const usersIcon = document.createElement('i');
        usersIcon.classList.add('fas', 'fa-users');
        cardFooter.appendChild(usersIcon);
        roomCard.appendChild(cardFooter);

        document.querySelector('.card-container').appendChild(roomCard);
    });
}

function autoSearchRooms() {
    const defaultQuery = ''; // Tìm kiếm tất cả các phòng, hoặc bạn có thể thay đổi query mặc định
    autoSearchInterval = setInterval(() => {
        searchRooms(defaultQuery); // Gọi hàm tìm kiếm với query mặc định
    }, 3000); // Mỗi 10 giây 
}

// Dừng tìm kiếm tự động khi người dùng nhập liệu
document.getElementById('search-input').addEventListener('input', debounce(function (event) {
    clearInterval(autoSearchInterval); // Dừng tự động tìm kiếm khi có người dùng nhập
    searchRooms(event.target.value); // Tìm kiếm theo giá trị người dùng nhập
}, 500));

// Kích hoạt lại tìm kiếm tự động sau khi không có nhập liệu trong 1 khoảng thời gian
document.getElementById('search-input').addEventListener('blur', () => {
    setTimeout(() => {
        autoSearchRooms(); // Kích hoạt lại autoSearch sau khi người dùng ngừng nhập
    }, 1000); // Sau 1 giây không nhập liệu
});

// Gọi autoSearchRooms khi trang được load
document.addEventListener("DOMContentLoaded", function() {
    autoSearchRooms();
});


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
                    // Thêm sự kiện khi chọn radio button
                    input.addEventListener('change', () => {
                        // Xóa lớp 'selected' khỏi tất cả các label
                        const allLabels = backgroundOptions.querySelectorAll('label');
                        allLabels.forEach(label => {
                            label.classList.remove('selected');
                        });

                        // Thêm lớp 'selected' cho label của background được chọn
                        label.classList.add('selected');
                    });
                });

                resolve();
            })
            .catch(error => reject(error));
        });
    }

    // Hàm lấy giá trị background đã chọn
    function getSelectedBackground() {
        const selectedBackground = document.querySelector('input[name="background"]:checked');
        // Nếu có background được chọn, trả về giá trị của nó
        if (selectedBackground) {
            return parseInt(selectedBackground.value);
        }

        // Nếu không có background nào được chọn, mặc định lấy background đầu tiên
        const firstBackground = document.querySelector('input[name="background"]');
        return firstBackground ? parseInt(firstBackground.value) : null;
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
                    // Gửi thông tin về phòng mới qua WebSocket
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

