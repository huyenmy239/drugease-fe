import CONFIG from '../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/accounts`;

async function fetchEmployees() {
    try {
        const response = await fetch(API_URL + `/employee-list/`);
        const employees = await response.json();
        populateTable(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

function populateTable(employees) {
    const tableBody = document.getElementById("employee-table-body");
    tableBody.innerHTML = "";

    employees.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.id_card}</td>
            <td>${employee.full_name}</td>
            <td>${employee.account}</td>
            <td>${employee.phone_number}</td>
            <td>${employee.email}</td>
            <td>${employee.role}</td>
            <td class="${employee.is_active === true ? 'status-active' : 'status-inactive'}">${employee.is_active === true ? 'Active' : 'Inactive'}</td>
            <td>
                <i class="fas fa-eye show-icon" data-id="${employee.id}" data-role="${employee.role}" data-username="${employee.account}"></i>
                <i class="fas fa-pen edit-icon" data-id="${employee.id}" data-role="${employee.role}" data-username="${employee.account}"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });

    const editIcons = document.querySelectorAll(".edit-icon");
    editIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            const id = icon.getAttribute("data-id");
            editEmployee(id);
        });
    });

    const showIcons = document.querySelectorAll(".show-icon");
    showIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            const id = icon.getAttribute("data-id");
            const role = icon.getAttribute("data-role");
            const username = icon.getAttribute("data-username");
            showEmployee(id, role, username);
        });
    });
}

function showEmployee(id, role, username) {
    localStorage.setItem("selectedEmployeeId", id);
    localStorage.setItem("selectedEmployeeRole", role);
    localStorage.setItem("selectedEmployeeUsername", username);

    window.location.href = "employee-detail.html";
}


document.getElementById("role-filter").addEventListener("change", applyFilters);
document.getElementById("status-filter").addEventListener("change", applyFilters);
document.getElementById("search").addEventListener("input", applyFilters);

function applyFilters() {
    const role = document.getElementById("role-filter").value;
    const status = document.getElementById("status-filter").value;
    const search = document.getElementById("search").value.toLowerCase();

    fetch(API_URL + `/employee-list/`)
        .then((response) => response.json())
        .then((employees) => {
            const filteredEmployees = employees.filter((employee) => {
                const matchesRole = role ? employee.role === role : true;
                const matchesStatus = status 
                    ? (status === "Active" ? employee.is_active === true : employee.is_active === false)
                    : true;
                const matchesSearch = 
                    employee.full_name.toLowerCase().includes(search) || 
                    employee.id_card.toLowerCase().includes(search) || 
                    employee.phone_number.includes(search);
                return matchesRole && matchesStatus && matchesSearch;
            });
            populateTable(filteredEmployees);
        })
        .catch((error) => console.error("Error filtering employees:", error));
}

function viewEmployee(id) {
    alert("View details for Employee ID: " + id);
}

// Call Edit employee API
function editEmployee(id) {
    document.getElementById("editModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    const fileInput = document.getElementById("profile-image-edit").value = "";

    fetch(`${API_URL}/employees/${id}/`)
        .then((response) => response.json())
        .then((employee) => {
            document.getElementById("full-name-edit").value = employee.full_name;
            document.getElementById("dob-edit").value = employee.date_of_birth;
            const genderValue = employee.gender ? "1" : "0";
            document.querySelector(`input[name="gender-edit"][value="${genderValue}"]`).checked = true;
            document.getElementById("phone-edit").value = employee.phone_number;
            document.getElementById("citizen-id-edit").value = employee.citizen_id;
            document.getElementById("address-edit").value = employee.address;
            document.getElementById("email-edit").value = employee.email;
            const activeValue = employee.is_active ? "1" : "0";
            document.querySelector(`input[name="active-edit"][value="${activeValue}"]`).checked = true;

            let imageUrl = employee.image;
            if (imageUrl) {
                imageUrl = imageUrl.replace(
                    "/media/",
                    "/api/accounts/media/"
                );
            } else {
                imageUrl = "https://placehold.co/150x150";
            }
            console.log(imageUrl);
            document.getElementById("preview-image-edit").src = imageUrl;

            document.getElementById("editModal").style.display = "block";
            document.getElementById("overlay").style.display = "block";

            const saveButton = document.querySelector(".editModal");
            saveButton.textContent = "Save Changes";
            saveButton.onclick = () => updateEmployee(id);
        })
        .catch((error) => {
            console.error("Error fetching employee details:", error);
            alert("Failed to load employee details. Please try again.");
        });
}

document.getElementById("profile-image-edit").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        const previewImage = document.getElementById("preview-image-edit");
        previewImage.src = URL.createObjectURL(file);
    }
});

function updateEmployee(id) {
    const phone = document.getElementById("phone-edit").value;
    const address = document.getElementById("address-edit").value;
    const email = document.getElementById("email-edit").value;
    const active = document.querySelector('input[name="active-edit"]:checked').value;
    const profileImage = document.getElementById("profile-image-edit").files[0];

    if (!phone || !address || !email) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("phone_number", phone);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("is_active", active);

    if (profileImage) {
        formData.append("image", profileImage);
    }

    fetch(`${API_URL}/employees/${id}/`, {
        method: "PUT",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    if (typeof errorData === "object") {
                        let errorMessages = [];
                        for (const [key, value] of Object.entries(errorData)) {
                            errorMessages.push(`${value}`);
                        }
                        throw new Error(errorMessages.join("\n"));
                    }
                    throw new Error(errorData || "Failed to update employee.");
                });
            }
            return response.json();
        })
        .then((data) => {
            alert("Employee updated successfully!");
            console.log("Updated employee:", data);

            document.getElementById("editModal").style.display = "none";
            document.getElementById("overlay").style.display = "none";

            applyFilters();
        })
        .catch((error) => {
            console.error("Error updating employee:", error);
            alert(`Failed to update employee: ${error.message}`);
        });
}


fetchEmployees();


// Fetch role
document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role-filter');

    fetch(API_URL + `/roles/`)
        .then(response => response.json())
        .then(data => {
            roleSelect.innerHTML = '<option value="">Role</option>';
            data.roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.value;
                option.textContent = role.label;
                roleSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching roles:', error);
            roleSelect.innerHTML = '<option value="">Failed to load roles</option>';
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role');

    fetch(API_URL + `/roles/`)
        .then(response => response.json())
        .then(data => {
            roleSelect.innerHTML = '<option value="">Select role</option>';
            data.roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.value;
                option.textContent = role.label;
                roleSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching roles:', error);
            roleSelect.innerHTML = '<option value="">Failed to load roles</option>';
        });
});


// Call Create employee API
document.querySelector('.create').addEventListener('click', () => {
    const role = document.getElementById('role').value;
    const fullName = document.getElementById('full-name').value;
    const dob = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const citizen_id = document.getElementById('citizen-id').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const profileImage = document.getElementById('profile-image').files[0];

    if (!role || role === "Select role" || !fullName || !dob || !phone || !address || !citizen_id) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("full_name", fullName);
    formData.append("date_of_birth", dob);
    formData.append("gender", gender);
    formData.append("phone_number", phone);
    formData.append("citizen_id", citizen_id);
    formData.append("address", address);
    formData.append("email", email);
    if (profileImage) {
        formData.append("image", profileImage);
    }

    fetch(API_URL + `/employees/`, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                if (typeof errorData === "object") {
                    let errorMessages = [];
                    for (const [key, value] of Object.entries(errorData)) {
                        errorMessages.push(`${value}`);
                    }
                    throw new Error(errorMessages.join("\n"));
                }
                throw new Error(errorData || "Failed to create employee.");
            });
        }
        return response.json();
    })
    .then(data => {
        alert("Employee created successfully!");
        console.log("Response from server:", data);
        document.getElementById('formModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        resetForm();
        fetchEmployees();
    })
    .catch(error => {
        console.error("Error creating employee:", error);
        alert(`Failed to create employee. ${error}`);
    });
});

function resetForm() {
    document.getElementById('role').value = "Select role";
    document.getElementById('full-name').value = "";
    document.getElementById('dob').value = "";
    document.querySelector('input[name="gender"][value="1"]').checked = true;
    document.getElementById('phone').value = "";
    document.getElementById('address').value = "";
    document.getElementById('email').value = "";
}


