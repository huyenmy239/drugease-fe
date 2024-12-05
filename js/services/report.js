import CONFIG from '../utils/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    // Gọi API tổng hợp thông tin người dùng
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/account-report`)
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
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/type-room-report`)
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
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/admin/reports/room-active-report`)
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
