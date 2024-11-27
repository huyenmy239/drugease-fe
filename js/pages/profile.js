// Function to fetch and display profile data
async function loadProfile() {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
        alert("You need to login first!");
        window.location.href = "login.html"; // Redirect back to login page if not logged in
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/users/profile/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(data);

        // Populate profile data
        if (data.avatar && data.avatar.includes('/media/')) {
            data.avatar = data.avatar.replace('/media/', '/api/accounts/media/');
        }
        document.getElementById("profile-avatar").src = data.avatar || "/assets/images/default-profile.jpg";
        document.getElementById("profile-username").innerText = data.username;
        document.getElementById("profile-email").innerText = data.email;

        // Pre-fill form fields
        document.getElementById("new-username").value = data.username;
        document.getElementById("new-email").value = data.email;
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// Function to update profile
async function updateProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first!");
        return;
    }

    const username = document.getElementById("new-username").value;
    const email = document.getElementById("new-email").value;
    const avatar = document.getElementById("new-avatar").files[0];

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (avatar) {
        formData.append("profile_picture", avatar);
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/users/profile/update/", {
            method: "PUT", // hoặc PATCH tùy vào cấu hình API
            headers: {
                "Authorization": `Token ${token}`,
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            alert("Profile updated successfully!");
            loadProfile(); // Reload profile
        } else {
            const data = await response.json();
            console.error("Error response data:", data); // Log chi tiết lỗi trả về
            alert("Failed to update profile. " + (data.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
    }
}

function logout() {
    localStorage.removeItem("token"); // Remove token
    window.location.href = "login.html"; // Redirect to login page
}

// Load profile on page load
window.onload = loadProfile;
