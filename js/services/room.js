import CONFIG from '../utils/settings.js';

const baseURL = `http://${CONFIG.BASE_URL}/api/accounts`;

// Lấy thông tin room_id từ URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room_id');

// Claa room oject --------------------------------------
// Kiểm tra nếu roomId hợp lệ
if (roomId) {
  // Gọi API với roomId
  fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/${roomId}/`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

        // Xử lý dữ liệu từ response API
        const roomData = data;
        const title = roomData.title;
        const description = roomData.description;
        const createdBy = roomData.created_by;
        const createdAt = roomData.created_at;
        const isPrivate = roomData.is_private;
        let background = roomData.background.bg;
        const subjects = roomData.subjects;

        // Hiển thị dữ liệu trên UI hoặc xử lý theo cách bạn muốn
        document.getElementById('meeting-title').innerText = title;

        console.log(background);
        if (background && background.includes('/media/')) {
            background = background.replace('/media/', '/api/rooms/media/');
        }
        document.getElementById('background-img').src = background;

      // Cập nhật background, mic enable, v.v.
      // Các phần khác của UI cũng có thể được cập nhật tương tự
    })
    .catch(error => {
      console.error('Có lỗi khi gọi API:', error);
    });
} else {
  console.error('Room ID không hợp lệ!');
}

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

function updateMicState(micState) {
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/${roomId}/mic/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,  // Thêm token vào header
        },
        body: JSON.stringify({
            mic_allow: micState,  // Trạng thái mic (true: cho phép, false: tắt)
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Mic state updated:', data);
    })
    .catch(error => {
        console.error('Error updating mic state:', error);
    });
}

// Chuyển đổi trạng thái micro (mute/unmute)
toggleMicButton.addEventListener('click', function() {
    // const audioTrack = localStream.getAudioTracks()[0];
    // Chuyển trạng thái mute/unmute
    if (isMicMuted) {
        // audioTrack.enabled = true;
        toggleMicButton.classList.remove('active');
        updateMicState(true);  // Gọi API để bật mic
    } else {
        // audioTrack.enabled = false;
        toggleMicButton.classList.add('active');
        updateMicState(false);  // Gọi API để tắt mic
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

// User list section ------------------------------->
// Hàm để tạo phần tử li cho mỗi người dùng
function createUserList(userData) {
    const ul = document.getElementById('user-list');
    const memberCount = document.getElementById('member-count');
    ul.innerHTML = '';  // Xóa nội dung cũ trong danh sách trước khi thêm mới

    // Cập nhật số lượng thành viên
    memberCount.textContent = userData.length;

    userData.forEach(userObj => {
        const li = document.createElement('li');
        
        // Tạo hình đại diện người dùng
        const img = document.createElement('img');
        let avtUrl = userObj.user.avatar;
        if (avtUrl && avtUrl.includes('/media/')) {
            avtUrl = avtUrl.replace('/media/', '/api/accounts/media/');
        }
        img.src = avtUrl;
        img.alt = userObj.user.username;
        img.classList.add('member-avatar');
        
        // Tạo tên người dùng
        const span = document.createElement('span');
        span.textContent = userObj.user.username;

        li.appendChild(img);
        li.appendChild(span);
        // Kiểm tra nếu người dùng là host, thêm biểu tượng vương miện
        if (userObj.user.id === userObj.room_owner[0]) { // Giả sử id của host là 1
            const crownIcon = document.createElement('i');
            crownIcon.classList.add('fas', 'fa-crown');
            crownIcon.id = 'host';
            li.appendChild(crownIcon);
        } else {            
            // Tạo phần tử hiển thị mic
            const micIcon = document.createElement('i');
            micIcon.classList.add('fas');  // Thêm lớp chung cho tất cả các icon
            
            if (userObj.mic_allow) {
                // Nếu mic được phép, dùng icon mic bật
                micIcon.classList.add('fa-microphone');
            } else {
                // Nếu mic bị tắt, dùng icon mic tắt
                micIcon.classList.add('fa-microphone-slash');
            }
            micIcon.id = `mic-${userObj.user.id}`;
            
            const blockIcon = document.createElement('i');
            blockIcon.classList.add('fas', 'fa-ban');
            blockIcon.id = `block-${userObj.user.id}`;
    
            // Tạo phần tử block (biểu tượng "cấm")
            li.appendChild(micIcon);  // Thêm mic vào list
            li.appendChild(blockIcon);  // Thêm block vào list

            micIcon.addEventListener('click', () => toggleMicPermission(userObj.user.id, micIcon));
            blockIcon.addEventListener('click', () => toggleBlockPermission(userObj.user.id, blockIcon));
        }

        // Thêm hình đại diện và tên người dùng vào li
        
        // Thêm li vào ul
        ul.appendChild(li);


    });
}

// Hàm gọi API để lấy danh sách người dùng
function fetchUserList() {
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/room/${roomId}/members-in-room/`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Chuyển đổi dữ liệu thành JSON
        })
        .then(function(data) {
            createUserList(data);  // Gọi hàm xử lý dữ liệu
        })
        .catch(function(error) {
            console.error('Error fetching user list:', error);  // Xử lý lỗi nếu có
        });
}


const editPermissionUrl = `http://${CONFIG.BASE_URL}/api/rooms/room/${roomId}/edit-permissions/`;

// Giả sử token được lưu trong localStorage (có thể thay đổi tùy vào cách bạn lưu trữ token)
const token = localStorage.getItem('token');  // Lấy token từ localStorage

function toggleMicPermission(userId, micIcon) {
    const currentState = micIcon.classList.contains('fa-microphone'); // Kiểm tra mic hiện tại
    const newMicState = !currentState;  // Lấy trạng thái ngược lại (bật/tắt)

    // Gửi yêu cầu tới API để cập nhật mic permission
    fetch(editPermissionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,  // Thêm token vào header
        },
        body: JSON.stringify({
            user_id: userId,
            mic_allow: newMicState,  // Cập nhật trạng thái mic
        })
    })
    .then(response => response.json())
    .then(data => {
        // Cập nhật icon mic dựa trên trạng thái mới
        if (newMicState) {
            micIcon.classList.remove('fa-microphone-slash');
            micIcon.classList.add('fa-microphone');
        } else {
            micIcon.classList.remove('fa-microphone');
            micIcon.classList.add('fa-microphone-slash');
        }
    })
    .catch(error => {
        console.error('Error updating mic permission:', error);
    });
}

function toggleBlockPermission(userId, blockIcon) {

    // Hiển thị hộp thoại xác nhận
    const confirmation = window.confirm("Bạn có chắc chắn muốn block người dùng này?");

    if (!confirmation) {
        // Nếu người dùng không đồng ý (nhấn 'Cancel'), không thực hiện gì
        return;
    }

    const currentState = blockIcon.classList.contains('blocked'); // Kiểm tra block hiện tại
    const newBlockState = !currentState; // Lấy trạng thái ngược lại (block/unblock)

    // Gửi yêu cầu tới API để cập nhật block permission
    fetch(editPermissionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,  // Thêm token vào header
        },
        body: JSON.stringify({
            user_id: userId,
            is_blocked: 1,  // Cập nhật trạng thái block
        })
    })
    .then(response => response.json())
    .then(data => {
        fetchUserList();
    })
    .catch(error => {
        console.error('Error updating block permission:', error);
    });
}

// Hàm để lấy trạng thái mic khi tải trang
function loadMicState() {
    fetch(`http://${CONFIG.BASE_URL}/api/rooms/${roomId}/mic/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,  // Thêm token vào header
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.mic_allow !== undefined) {
            // Cập nhật giao diện tùy thuộc vào trạng thái mic_allow
            const micButton = document.querySelector('.control-button-microphone');
            if (data.mic_allow) {
                micButton.classList.add('active');
                isMicMuted = true;
            } else {
                micButton.classList.remove('active');
                isMicMuted = false;
            }
        }
    })
    .catch(error => {
        console.error('Error fetching mic state:', error);
    });
}



// Gọi hàm khi trang được tải
window.onload = function () {
    // Lấy room_id và user_id từ URL hoặc từ các giá trị khác nếu có
    fetchUserList();
    loadMicState();
};

// window.onload = fetchUserList;