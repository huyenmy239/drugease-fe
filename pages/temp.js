// WebSocket connection setup
const socket = new WebSocket('ws://192.168.1.128:8000/ws/rooms/1/');  // Replace with actual room ID

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type === 'offer') {
        handleOffer(data.offer);
    } else if (data.type === 'answer') {
        handleAnswer(data.answer);
    } else if (data.type === 'candidate') {
        handleCandidate(data.candidate);
    } else if (data.type === 'message') {
        displayMessage(data.message);
    }
};

// Handle Offer
async function handleOffer(offer) {
    peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = handleIceCandidate;
    peerConnection.ontrack = handleRemoteStream;
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send the answer back to WebSocket server
    socket.send(JSON.stringify({ type: 'answer', answer: answer }));
}

// Handle Answer
function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Handle ICE Candidate
function handleIceCandidate(event) {
    if (event.candidate) {
        socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
    }
}

// Handle remote stream (display on remote video)
function handleRemoteStream(event) {
    remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
}

// Display chat message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
