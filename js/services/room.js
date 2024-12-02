import CONFIG from '../utils/settings.js';

const baseURL = `http://${CONFIG.BASE_URL}/api/accounts`;

// Lấy thông tin room_id từ URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room_id');

// Lấy các phần tử trong DOM
const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendMessageButton = document.getElementById("send-message");
const toggleMicButton = document.getElementById("toggle-mic");
const shareScreenButton = document.getElementById("share-screen");

let localStream;
let remoteStream;
let peerConnection;
let isMicMuted = false;
let isScreenSharing = false;

const username = localStorage.getItem("username");
console.log(username);

const socket = new WebSocket(`ws://${CONFIG.BASE_URL}/ws/room/${roomId}/`);


socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    
    // Xử lý offer
    if (data.type === 'offer') {
        handleOffer(data.offer);
    }
    
    // Xử lý answer
    if (data.type === 'answer') {
        handleAnswer(data.answer);
    }
    
    // Xử lý ICE candidate
    if (data.type === 'candidate') {
        handleCandidate(data.candidate);
    }
    
    // Xử lý message chat
    if (data.type === 'message') {
        displayMessage(data);
    }

    if (data.type === 'initial_messages') {
        displayInitialMessages(data.messages);
    }
};

// Tạo peer connection
function createPeerConnection() {
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }  // STUN server của Google
        ]
    };
    peerConnection = new RTCPeerConnection(configuration);

    // Lắng nghe sự kiện ICE candidate
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            socket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };

    // Lắng nghe khi có video từ remote peer
    peerConnection.ontrack = function(event) {
        remoteVideo.srcObject = event.streams[0];
        remoteStream = event.streams[0];
    };

    // Thêm stream (audio/video) từ local vào peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
}

// Xử lý offer
async function handleOffer(offer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Gửi answer về server
    socket.send(JSON.stringify({
        type: 'answer',
        answer: peerConnection.localDescription
    }));
}

// Xử lý answer
function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Xử lý ICE candidate
function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// Chạy getUserMedia để lấy quyền truy cập vào microphone và camera
async function getUserMedia() {
    try {
        const constraints = {
            audio: true
        };

        // Lấy quyền truy cập vào microphone và camera
        localStream = await navigator.mediaDevices.getUserMedia(constraints);

        // Gán stream cho video local
        localVideo.srcObject = localStream;

        // Tạo peer connection khi đã có local stream
        createPeerConnection();
    } catch (err) {
        console.error("Error getting media: ", err);
    }
}

// Khởi tạo cuộc gọi
async function startCall() {
    await getUserMedia();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Gửi offer qua WebSocket
    socket.send(JSON.stringify({
        type: 'offer',
        offer: peerConnection.localDescription
    }));
}

// Chuyển đổi trạng thái micro (mute/unmute)
toggleMicButton.addEventListener('click', function() {
    const audioTrack = localStream.getAudioTracks()[0];
    if (isMicMuted) {
        audioTrack.enabled = true;
    } else {
        audioTrack.enabled = false;
    }
    isMicMuted = !isMicMuted;
});

// Cập nhật biến để chứa nút tắt chia sẻ
const stopShareScreenButton = document.getElementById("stop-share-screen");

// Chia sẻ màn hình
shareScreenButton.addEventListener('click', async function() {
    try {
        // Thêm class active khi người dùng bắt đầu thao tác chia sẻ màn hình
        shareScreenButton.classList.add('active');
        
        // Yêu cầu quyền truy cập màn hình để chia sẻ
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        // Dừng tất cả các track video hiện tại
        localStream.getTracks().forEach(track => track.stop());
        
        // Cập nhật stream màn hình mới cho video local
        localStream = screenStream;
        localVideo.srcObject = screenStream;

        // Cập nhật trạng thái chia sẻ màn hình
        isScreenSharing = true;

        // Cập nhật peer connection với stream mới
        peerConnection.getSenders().forEach(sender => sender.replaceTrack(screenStream.getTracks()[0]));

        // Hiển thị nút tắt chia sẻ màn hình
        stopShareScreenButton.style.display = 'inline-block';
        shareScreenButton.style.display = 'none';  // Ẩn nút chia sẻ khi đang chia sẻ màn hình

        // Xóa class active khi chia sẻ màn hình đã hoàn tất
        screenStream.getVideoTracks()[0].addEventListener('ended', function() {
            shareScreenButton.classList.remove('active'); // Xóa class active khi người dùng dừng chia sẻ màn hình
        });
    } catch (err) {
        console.error("Error sharing screen: ", err);

        // Xóa class active nếu có lỗi trong quá trình chia sẻ
        shareScreenButton.classList.remove('active');
    }
});


// Dừng chia sẻ màn hình
stopShareScreenButton.addEventListener('click', function() {
    // Dừng chia sẻ màn hình
    localStream.getTracks().forEach(track => track.stop());
    
    // Quay lại với video từ camera
    getUserMedia();  // Gọi lại getUserMedia để bắt lại stream từ camera
    
    // Ẩn nút tắt chia sẻ và hiển thị lại nút chia sẻ
    stopShareScreenButton.style.display = 'none';
    shareScreenButton.style.display = 'inline-block';
    shareScreenButton.classList.remove('active');
});

// Hàm gửi tin nhắn
function sendChatMessage() {
  const message = chatInput.value;
  if (message.trim() !== '') {
      socket.send(JSON.stringify({
          type: 'message',
          content: message,
          user: username
      }));
      chatInput.value = '';  // Xóa nội dung input sau khi gửi tin nhắn
  }
}

// Gửi tin nhắn khi nhấn nút Send
sendMessageButton.addEventListener('click', sendChatMessage);

// Gửi tin nhắn khi nhấn phím Enter
chatInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
});

// Hiển thị các tin nhắn ban đầu (trước khi người dùng gửi tin nhắn)
function displayInitialMessages(messages) {
    messages.forEach(function(msg) {
        let avtUrl = `${baseURL}${msg.user.avatar}`;
        const messageElement = document.createElement('div');
        // Kiểm tra nếu tin nhắn là của chủ sở hữu
        if (msg.user.username === username) {
            messageElement.classList.add('chat-message-owner'); // Gán class cho tin nhắn của owner
            messageElement.innerHTML = `
                <div class="chat-content-owner">
                    <span class="chat-name-owner">${msg.user.username}</span>
                    <p class="chat-text-owner">${msg.message}</p>
                </div>
                <img src="${avtUrl}" alt="Avatar" class="chat-avatar-owner">
            `;
        } else {
            messageElement.classList.add('chat-message');
            messageElement.innerHTML = `
                <img src="${avtUrl}" alt="Avatar" class="chat-avatar">
                <div class="chat-content">
                    <span class="chat-name">${msg.user.username}</span>
                    <p class="chat-text">${msg.message}</p>
                </div>
            `;
        }
        chatBox.appendChild(messageElement);
    });
}

function displayMessage(data) {
    let avtUrl = `${baseURL}${data.user.avatar}`;
    const messageElement = document.createElement('div');
    if (data.user.username === username) {
        messageElement.classList.add('chat-message-owner'); // Gán class cho tin nhắn của owner
        messageElement.innerHTML = `
            <div class="chat-content-owner">
                <span class="chat-name-owner">${data.user.username}</span>
                <p class="chat-text-owner">${data.message}</p>
            </div>
            <img src="${avtUrl}" alt="Avatar" class="chat-avatar-owner">
        `;
    } else {
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `
            <img src="${avtUrl}" alt="Avatar" class="chat-avatar">
            <div class="chat-content">
                <span class="chat-name">${data.user.username}</span>
                <p class="chat-text">${data.message}</p>
            </div>
        `;
    }
    chatBox.appendChild(messageElement);
}


// Bắt đầu cuộc gọi khi trang web tải
window.onload = function() {
    startCall();
};