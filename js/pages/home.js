document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(event) {
        // Lấy ID phòng từ thuộc tính data-room-id của card
        const roomId = event.currentTarget.getAttribute('data-room-id');
        console.log(roomId);

        // Chuyển hướng sang room.html với ID phòng
        window.location.href = `room.html?room_id=${roomId}`;
    });
});