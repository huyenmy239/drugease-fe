document.addEventListener('DOMContentLoaded', function () {
    const meetingScreen = document.querySelector('.meeting-screen');
    // const mainContent = document.querySelector('.main-content');

    const dropdownButton = document.querySelector('.dropdown-button');
    const dropupButton = document.querySelector('.dropup-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    const buttons = document.querySelectorAll('.control-button');
    const controlButtonChat = document.querySelector('.control-button-chat');
    const meetingChat = document.querySelector('.meeting-chat'); // Cửa sổ Chat
    const chatCloseBtn = document.querySelector('.chat-close-btn');
    const chatDetailBtn = document.querySelector('.chat-detail-btn');

    const chatDetailsContainer = document.querySelector('.chat-details-container');
    const mediaBtn = document.querySelector('.details-media-btn');
    const filesBtn = document.querySelector('.details-files-btn');
    const mediaContent = document.querySelector('.media-content');
    const filesContent = document.querySelector('.files-content');

    // Thêm sự kiện cho từng button
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            // Xử lý riêng cho microphone
            if (button.classList.contains('control-button-microphone')) {
                button.classList.toggle('active'); // Bật/tắt trạng thái microphone
            } 
            // Xử lý riêng cho nút hangup
            else if (button.classList.contains('control-button-hangup')) {
                window.location.href = 'home.html';
            } 
            // Xử lý riêng cho nút chat
            else if (button.classList.contains('control-button-chat')) {
                button.classList.toggle('active'); // Bật/tắt trạng thái nút chat
                // Hiển thị hoặc ẩn khung chat
                if (button.classList.contains('active')) {
                    meetingChat.style.display = 'block'; // Hiển thị khung chat
                } else {
                    meetingChat.style.display = 'none'; // Ẩn khung chat
                }
            } 
            // Xử lý cho các nút khác
            else {
                button.classList.toggle('active'); // Bật/tắt trạng thái các button khác
            }
        });
    });
    

    // Đảm bảo các nút không đè lên nhau
    dropupButton.style.display = 'none'; // Ẩn nút dropup mặc định

    // Sự kiện khi click vào dropdown
    dropdownButton.addEventListener('click', function () {
        dropdownMenu.style.display = 'block'; // Hiển thị menu
        dropdownButton.style.display = 'none'; // Ẩn nút dropdown
        dropupButton.style.display = 'inline-block'; // Hiện nút dropup
    });

    // Sự kiện khi click vào dropup
    dropupButton.addEventListener('click', function () {
        dropdownMenu.style.display = 'none'; // Ẩn menu
        dropdownButton.style.display = 'inline-block'; // Hiện nút dropdown
        dropupButton.style.display = 'none'; // Ẩn nút dropup
    });

    // Thêm sự kiện cho nút "Đóng"
    chatCloseBtn.addEventListener('click', () => {
        meetingChat.style.display = 'none';  // Ẩn khung chat
        controlButtonChat.classList.remove('active');
    });

    // Hiển thị chi tiết
    chatDetailBtn.addEventListener('click', () => {
        chatDetailsContainer.style.display = 'block'; // Mở chi tiết
    });

    // Chuyển đổi giữa Media và Files
    mediaBtn.addEventListener('click', () => {
        mediaContent.style.display = 'flex'; // Hiển thị Media
        filesContent.style.display = 'none'; // Ẩn Files
        mediaBtn.classList.add('active'); // Đánh dấu nút
        filesBtn.classList.remove('active');
    });

    filesBtn.addEventListener('click', () => {
        filesContent.style.display = 'block'; // Hiển thị Files
        mediaContent.style.display = 'none'; // Ẩn Media
        filesBtn.classList.add('active'); // Đánh dấu nút
        mediaBtn.classList.remove('active');
    });

    document.querySelector('.details-back-btn').addEventListener('click', function () {
        // Ẩn chi tiết
        document.querySelector('.chat-details-container').style.display = 'none';
        // Hiển thị lại đoạn chat
        document.querySelector('.meeting-chat').style.display = 'block';
    });
    
});