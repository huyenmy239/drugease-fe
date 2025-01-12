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
                <i class="fas fa-eye show-icon" data-id="${employee.id}"></i>
                <i class="fas fa-pen edit-icon" data-id="${employee.id}"></i>
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
                const matchesSearch = employee.full_name.toLowerCase().includes(search);
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

    fetch(`${API_URL}/employees/${id}/`)
        .then((response) => response.json())
        .then((employee) => {
            document.getElementById("full-name-edit").value = employee.full_name;
            document.getElementById("dob-edit").value = employee.date_of_birth;
            const genderValue = employee.gender ? "1" : "0";
            document.querySelector(`input[name="gender-edit"][value="${genderValue}"]`).checked = true;
            document.getElementById("phone-edit").value = employee.phone_number;
            document.getElementById("address-edit").value = employee.address;
            document.getElementById("email-edit").value = employee.email;

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

function updateEmployee(id) {
    const phone = document.getElementById("phone-edit").value;
    const address = document.getElementById("address-edit").value;
    const email = document.getElementById("email-edit").value;

    if (!phone || !address || !email) {
        alert("Please fill out all required fields.");
        return;
    }

    const employeeData = {
        phone_number: phone,
        address: address,
        email: email,
        image: ""
    };

    fetch(`${API_URL}/employees/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.detail || "Failed to update employee.");
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
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;

    if (!role || role === "Select role" || !fullName || !dob || !phone || !address) {
        alert("Please fill out all required fields.");
        return;
    }

    const employeeData = {
        role: role,
        full_name: fullName,
        date_of_birth: dob,
        gender: gender,
        phone_number: phone,
        address: address,
        email: email,
        image: "",
    };

    fetch(API_URL + `/employees/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.detail || "An error occurred");
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
        alert("Failed to create employee.");
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


