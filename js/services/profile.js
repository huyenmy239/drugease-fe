import CONFIG from '../utils/settings.js';


// const baseURL = "http://127.0.0.1:8000/api/accounts/users/";
const baseURL = `http://${CONFIG.BASE_URL}/api/accounts/users/`;

async function loadProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to login first!");
        window.location.href = "login.html";
        return;
    }

    try {
        // Gọi API để lấy thông tin hồ sơ
        const profileResponse = await fetch(`${baseURL}profile/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!profileResponse.ok) {
            throw new Error("Failed to fetch profile");
        }

        const profileData = await profileResponse.json();
        console.log(profileData);

        if (profileData.avatar && profileData.avatar.includes('/media/')) {
            profileData.avatar = profileData.avatar.replace('/media/', '/api/accounts/media/');
        }

        document.getElementById("profile-avatar").src = profileData.avatar || "/assets/images/default-profile.jpg";
        document.getElementById("profile-username").value = profileData.username;
        document.getElementById("profile-email").value = profileData.email;

        // Gọi API để lấy lịch sử sau khi tải hồ sơ thành công
        const historyResponse = await fetch(`${baseURL}history/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!historyResponse.ok) {
            throw new Error("Failed to fetch history");
        }

        const historyData = await historyResponse.json();
        console.log(historyData);
        renderHistory(historyData);
    } catch (error) {
        console.error("Error loading profile or history:", error);
    }
}


async function updateProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first!");
        return;
    }

    const username = document.getElementById("profile-username").value;
    const email = document.getElementById("profile-email").value;
    const avatar = document.getElementById("new-avatar").files[0];

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (avatar) {
        formData.append("profile_picture", avatar);
    }

    try {
        const response = await fetch(`${baseURL}profile/update/`, {
            method: "PUT",
            headers: {
                "Authorization": `Token ${token}`,
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            alert("Profile updated successfully!");
            loadProfile();
        } else {
            const data = await response.json();
            console.error("Error response data:", data);
            alert("Failed to update profile. " + (data.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
    }
}

function renderHistory(history) {
    const logContainer = document.querySelector('.log-body');
    logContainer.innerHTML = ""; // Xóa lịch sử cũ trước khi thêm mới

    history.forEach(item => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';

        logItem.innerHTML = `
        <div class="text">
          You joined the '
          <b class="room">${item.room_title}</b>
          ' room at
          <b>${formatTime(item.time_in)}</b>.
        </div>
      `;
        logContainer.appendChild(logItem);
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


// document.addEventListener("DOMContentLoaded", () => {
//     const token = localStorage.getItem("token"); // Định nghĩa token trong sự kiện DOMContentLoaded

//     if (!token) {
//         alert("You need to login first!");
//         window.location.href = "login.html";
//         return;
//     }

//     fetch(`${baseURL}history/`, {
//         method: 'GET',
//         headers: {
//             "Authorization": `Token ${token}`,
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to fetch history');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log(data);
//         renderHistory(data);
//     })
//     .catch(error => {
//         console.error('Error fetching history:', error);
//     });
// });

// function renderHistory(history) {
//     const logContainer = document.querySelector('.log');

//     history.forEach(item => {
//         const logItem = document.createElement('div');
//         logItem.className = 'log-item';

//         logItem.innerHTML = `
//         <div class="text">
//           You joined the '
//           <b class="room">${item.room_title}</b>
//           ' room at
//           <b>${formatTime(item.time_in)}</b>.
//         </div>
//       `;
//         logContainer.appendChild(logItem);
//     });
// }

// function formatTime(timestamp) {
//     const date = new Date(timestamp);
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
// }


// ----------------------

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

window.onload = loadProfile;
window.onload = loadProfile;