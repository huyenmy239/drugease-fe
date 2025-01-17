import CONFIG from '../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/accounts`;

document.addEventListener("DOMContentLoaded", () => {

    const username = localStorage.getItem("username");

    fetch(API_URL + `/profile/${username}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch employee details");
            }
            return response.json();
        })
        .then((data) => {

            let imageUrl = data.image;
            if (imageUrl) {
                imageUrl = imageUrl.replace(
                    "/media/",
                    "/api/accounts/media/"
                );
            } else {
                imageUrl = "https://placehold.co/150x150";
            }

            document.getElementById("employee-image").src = imageUrl;
            document.getElementById("employee-fullname").textContent = data.full_name;
            document.getElementById("employee-role").textContent = data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase();
            document.getElementById("employee-prescriptions").textContent = data.prescriptions_count || 0;

            document.getElementById("employee-username").textContent = `Username: ${data.account}`;
            document.getElementById("employee-status").textContent = `Status: ${data.is_active ? "Active" : "Inactive"}`;
            document.getElementById("employee-phone").textContent = `Phone Number: ${data.phone_number}`;
            document.getElementById("employee-email").textContent = `Email: ${data.email}`;
            document.getElementById("employee-address").textContent = `Address: ${data.address}`;

            document.getElementById("employee-idcard").textContent = `ID Card: ${data.id_card}`;
            document.getElementById("employee-citizenid").textContent = `Citizen ID: ${data.citizen_id}`;
            document.getElementById("employee-dob").textContent = `Date Of Birth: ${new Date(data.date_of_birth).toLocaleDateString()}`;
            document.getElementById("employee-gender").textContent = `Gender: ${data.gender ? "Male" : "Female"}`;
        })
        .catch((error) => {
            console.error("Error fetching employee details:", error);
            alert("Failed to load employee details.");
        });
});
