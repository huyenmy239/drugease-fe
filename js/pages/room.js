document.addEventListener('DOMContentLoaded', function () {
    const meetingScreen = document.querySelector('.meeting-screen');
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

    const chatBox = document.getElementById('chat-box'); // Phần tử chứa tin nhắn
    const chatInput = document.getElementById('chat-input'); // Ô nhập tin nhắn

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.classList.contains('control-button-microphone')) {
                
            } else if (button.classList.contains('control-button-chat')) {
                button.classList.toggle('active'); // Bật/tắt trạng thái nút chat
                if (button.classList.contains('active')) {
                    meetingChat.style.display = 'block'; // Hiển thị khung chat
                } else {
                    meetingChat.style.display = 'none'; // Ẩn khung chat
                }
            } 
        });
    });
    

    dropupButton.style.display = 'none'; // Ẩn nút dropup mặc định

    dropdownButton.addEventListener('click', function () {
        dropdownMenu.style.display = 'block'; // Hiển thị menu
        dropdownButton.style.display = 'none'; // Ẩn nút dropdown
        dropupButton.style.display = 'inline-block'; // Hiện nút dropup
    });

    dropupButton.addEventListener('click', function () {
        dropdownMenu.style.display = 'none'; // Ẩn menu
        dropdownButton.style.display = 'inline-block'; // Hiện nút dropdown
        dropupButton.style.display = 'none'; // Ẩn nút dropup
    });

    chatCloseBtn.addEventListener('click', () => {
        meetingChat.style.display = 'none';  // Ẩn khung chat
        controlButtonChat.classList.remove('active');
    });

    chatDetailBtn.addEventListener('click', () => {
        chatDetailsContainer.style.display = 'block'; // Mở chi tiết
    });

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
        document.querySelector('.chat-details-container').style.display = 'none';
        document.querySelector('.meeting-chat').style.display = 'block';
    });

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    const observer = new MutationObserver(scrollToBottom);
    observer.observe(chatBox, { childList: true, subtree: true });
    
});
