import CONFIG from '../utils/settings.js';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    // Gọi API tổng hợp thông tin người dùng
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/account-report`, {
        method: 'GET',  // Hoặc phương thức khác nếu cần, ví dụ 'POST'
        headers: {
          'Authorization': `Token ${token}`,  // Thêm token vào header Authorization
          'Content-Type': 'application/json',  // Thêm Content-Type nếu cần
        },
      })
        .then(response => response.json())
        .then(data => {
            const totalAccount = data.total_account;
            const accountInRoom = data.account_in_room;
            const onlinePercentage = (accountInRoom / totalAccount) * 100; // Tính tỷ lệ online
            const offlinePercentage = 100 - onlinePercentage;

            // Cập nhật nội dung cho phần "stats-user"
            document.querySelector('.stats-user .stats-number').textContent = totalAccount;
            document.querySelector('.stats-user .progress-fill').style.width = `${onlinePercentage}%`;
            document.querySelector('.stats-user .progress-text span:nth-child(1)').textContent = `(${accountInRoom}) ${onlinePercentage.toFixed(2)}% online`;
            document.querySelector('.stats-user .progress-text span:nth-child(2)').textContent = `(${totalAccount - accountInRoom}) ${offlinePercentage.toFixed(2)}% offline`;
        })
        .catch(error => console.error('Error fetching account report:', error));

    // Gọi API tổng hợp thông tin loại phòng
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/type-room-report`, {
        method: 'GET',  // Hoặc phương thức khác nếu cần
        headers: {
          'Authorization': `Token ${token}`,  // Thêm token vào header Authorization
          'Content-Type': 'application/json',  // Thêm Content-Type nếu cần thiết
        },
      })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const totalRoomActive = data.total_room_active;
            const totalPrivateRoom = data.total_private_room;
            const publicRoomPercentage = (totalRoomActive - totalPrivateRoom) / totalRoomActive * 100;
            const privateRoomPercentage = 100 - publicRoomPercentage;

            // Cập nhật nội dung cho phần "stats-mode-room"
            document.querySelector('.stats-mode-room .stats-number').textContent = totalRoomActive;
            document.querySelector('.stats-mode-room .progress-fill').style.width = `${publicRoomPercentage}%`;
            document.querySelector('.stats-mode-room .progress-text span:nth-child(1)').textContent = `(${totalRoomActive-totalPrivateRoom}) ${publicRoomPercentage.toFixed(2)}% public`;
            document.querySelector('.stats-mode-room .progress-text span:nth-child(2)').textContent = `(${totalPrivateRoom}) ${privateRoomPercentage.toFixed(2)}% private`;
        })
        .catch(error => console.error('Error fetching type room report:', error));

    // Gọi API tổng hợp thông tin phòng hoạt động
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/room-active-report`, {
        method: 'GET',  // Hoặc phương thức khác nếu cần
        headers: {
          'Authorization': `Token ${token}`,  // Thêm token vào header Authorization
          'Content-Type': 'application/json',  // Thêm Content-Type nếu cần thiết
        },
      })
        .then(response => response.json())
        .then(data => {
            const totalRoom = data.total_room;
            const totalRoomActive = data.total_room_active;
            const activeRoomPercentage = (totalRoomActive / totalRoom) * 100;
            const inactiveRoomPercentage = 100 - activeRoomPercentage;

            // Cập nhật nội dung cho phần "stats-active-room"
            document.querySelector('.stats-active-room .stats-number').textContent = totalRoom;
            document.querySelector('.stats-active-room .progress-fill').style.width = `${activeRoomPercentage}%`;
            document.querySelector('.stats-active-room .progress-text span:nth-child(1)').textContent = `(${totalRoomActive}) ${activeRoomPercentage.toFixed(2)}% occupied`;
            document.querySelector('.stats-active-room .progress-text span:nth-child(2)').textContent = `(${totalRoom-totalRoomActive}) ${inactiveRoomPercentage.toFixed(2)}% vacant`;
        })
        .catch(error => console.error('Error fetching room active report:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Gọi API room-created-report với POST
    const fromDateInput = document.getElementById('from-date');
    const toDateInput = document.getElementById('to-date');

    const fetchReport = () => {
        const startDate = fromDateInput.value;
        const endDate = toDateInput.value;

        if (startDate && endDate) {
            fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/room-created-report/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                })
            })
            .then(response => response.json())
            .then(data => {
                const roomsCreated = data.rooms_created;
                const tableBody = document.querySelector('.stats-creation .stats-table tbody');
                tableBody.innerHTML = '';

                roomsCreated.forEach(room => {
                    const tr = document.createElement('tr');
                    const createdAt = new Date(room.created_at);  // Chuyển đổi chuỗi thời gian thành đối tượng Date
                    
                    const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}/${(createdAt.getMonth() + 1).toString().padStart(2, '0')}/${createdAt.getFullYear()} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;

                    tr.innerHTML = `
                        <td>${room.title}</td>
                        <td>${room.created_by}</td>
                        <td>${formattedDate}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error fetching report:', error));
        } else {
            console.log("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
        }
    };

    fromDateInput.addEventListener('change', fetchReport);
    toDateInput.addEventListener('change', fetchReport);

    const popularRoomsCount = 10; // Số lượng phòng phổ biến cần lấy
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/room-popular-report?n=${popularRoomsCount}`, {
        method: 'GET',  // Phương thức có thể là 'GET' hoặc 'POST' nếu yêu cầu
        headers: {
          'Authorization': `Token ${token}`,  // Thêm token vào header Authorization
          'Content-Type': 'application/json',  // Thêm Content-Type nếu cần thiết
        },
      })
    .then(response => response.json())
    .then(data => {
        const rooms = data.rooms;
        const tableBody = document.querySelector('.stats-top .stats-table tbody');
        tableBody.innerHTML = ''; // Xóa dữ liệu mẫu

        rooms.forEach(room => {
            const tr = document.createElement('tr');
            const createdAt = new Date(room.created_at);  // Chuyển đổi chuỗi thời gian thành đối tượng Date
            
            // Định dạng ngày tháng giờ (DD/MM/YYYY HH:MM:SS)
            const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}/${(createdAt.getMonth() + 1).toString().padStart(2, '0')}/${createdAt.getFullYear()} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;

            tr.innerHTML = `
                <td>${room.title}</td>
                <td>${room.created_by}</td>
                <td>${room.members}</td>
                <td>${formattedDate}</td>
            `;
            tableBody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error fetching room popular report:', error));
    
    // 3. Xử lý phân trang (Pagination) nếu cần
    const prevButton = document.querySelector('.pagination .prev-page');
    const nextButton = document.querySelector('.pagination .next-page');

    prevButton.addEventListener('click', () => {
        // Logic phân trang trang trước
    });

    nextButton.addEventListener('click', () => {
        // Logic phân trang trang sau
    });
});
