import CONFIG from '../utils/settings.js';


const roomId = 1; // Đảm bảo bạn thay thế bằng room_id thực tế của mình
const ws_url = `ws://${CONFIG.BASE_URL}/ws/rooms/${roomId}/`;

// Khởi tạo WebSocket để nhận tín hiệu WebRTC
const socket = new WebSocket(ws_url);

// Khởi tạo PeerConnection
let localConnection = null;
let remoteConnection = null;
let localStream = null;

// Cấu hình STUN/TURN server (nếu có)
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN server
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.type === 'offer') {
    handleOffer(data.offer, data.from);
  } else if (data.type === 'answer') {
    handleAnswer(data.answer, data.from);
  } else if (data.type === 'candidate') {
    handleCandidate(data.candidate, data.from);
  }
};

// Gửi tín hiệu Offer
function sendOffer(offer) {
  socket.send(JSON.stringify({
    type: 'offer',
    offer: offer,
    from: 'client_1'  // Đây là ID của client, bạn có thể thay đổi theo ý muốn
  }));
}

// Gửi tín hiệu Answer
function sendAnswer(answer) {
  socket.send(JSON.stringify({
    type: 'answer',
    answer: answer,
    from: 'client_1'
  }));
}

// Gửi ICE Candidate
function sendCandidate(candidate) {
  socket.send(JSON.stringify({
    type: 'candidate',
    candidate: candidate,
    from: 'client_1'
  }));
}

// Xử lý offer từ client khác
async function handleOffer(offer, from) {
  remoteConnection = new RTCPeerConnection(configuration);

  // Thiết lập ICE candidate
  remoteConnection.onicecandidate = function(event) {
    if (event.candidate) {
      sendCandidate(event.candidate);
    }
  };

  // Thiết lập kết nối với offer
  await remoteConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // Tạo answer
  const answer = await remoteConnection.createAnswer();
  await remoteConnection.setLocalDescription(answer);

  sendAnswer(answer);
}

// Xử lý answer từ client khác
async function handleAnswer(answer, from) {
  await remoteConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Xử lý ICE candidate
async function handleCandidate(candidate, from) {
  try {
    await remoteConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (e) {
    console.error('Error adding received ICE candidate', e);
  }
}

// Khởi tạo local media stream (mic, camera)
async function startLocalStream() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  // Hiển thị video của người dùng trên màn hình
  const localVideo = document.querySelector('#local-video');
  localVideo.srcObject = localStream;

  // Gửi stream tới peer connection
  localStream.getTracks().forEach(track => {
    localConnection.addTrack(track, localStream);
  });
}

startLocalStream();
