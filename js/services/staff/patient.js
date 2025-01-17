import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/prescriptions/patients/`;
const token = localStorage.getItem('token');


async function loadPatients() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { statuscode, data } = await response.json();
        if (statuscode !== 200) {
            throw new Error('Failed to fetch data.');
        }

        renderTable(data);
    } catch (error) {
        console.error('Error loading patients:', error);
        const tableBody = document.getElementById('patient-table-body');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: red;">
                    Error loading data. Please try again later.
                </td>
            </tr>
        `;
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('patient-table-body');
    tableBody.innerHTML = '';

    data.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.full_name}</td>
            <td>${patient.date_of_birth}</td>
            <td>${patient.gender ? 'Male' : 'Female'}</td>
            <td>${patient.phone_number}</td>
            <td>${patient.insurance}</td>
            <td class="action-icons">
                <i class="fas fa-pen" data_id="${patient.id}" title="Edit"></i>
            </td>
        `;
        tableBody.appendChild(row);

        const editIcon = row.querySelector('.fa-pen');
        editIcon.addEventListener('click', () => {
            editPatient(patient.id);
        });
    });
}

document.addEventListener('DOMContentLoaded', loadPatients);


document.getElementById('createPatient').addEventListener('click', async () => {
    const fullName = document.getElementById('full-name').value;
    const dateOfBirth = document.getElementById('dob').value;
    const gender = document.querySelector('input[name="gender"]:checked').value; // Giả sử bạn có radio/checkbox chuyển đổi nam/nữ
    const idCard = document.getElementById('citizen-id').value;
    const phoneNumber = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const insurance = parseFloat(document.getElementById('insurance').value);
    const employee = localStorage.getItem("employee_id");

    const patientData = {
        full_name: fullName,
        date_of_birth: dateOfBirth,
        gender: gender,
        id_card: idCard,
        phone_number: phoneNumber,
        address: address,
        email: email,
        insurance: insurance,
        employee: employee
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        alert('Patient created successfully!');
        console.log('Response:', result);

        document.getElementById('closeModal').click();
        clearForm();
    } catch (error) {
        console.error('Error creating patient:', error);
        alert('Failed to create patient. Please try again.');
    }
});

function clearForm() {
    document.getElementById('full-name').value = '';
    document.getElementById('dob').value = '';
    document.querySelector('input[name="gender"][value="1"]').checked = true;
    document.getElementById('citizen-id').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('email').value = '';
    document.getElementById('insurance').value = '';
}


function editPatient(id) {
    document.getElementById("editModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    fetch(`${API_URL}${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`, 
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((patient) => {
            document.getElementById("full-name-edit").value = patient.full_name;
            const [day, month, year] = patient.date_of_birth.split('/');
            document.getElementById("dob-edit").value = `${year}-${month}-${day}`;
            const [dayR, monthR, yearR] = patient.registration_date.split('/');
            document.getElementById("registration-edit").value = `${yearR}-${monthR}-${dayR}`;
            const genderValue = patient.gender ? "1" : "0";
            document.querySelector(`input[name="gender-edit"][value="${genderValue}"]`).checked = true;
            document.getElementById("phone-edit").value = patient.phone_number;
            document.getElementById("citizen-id-edit").value = patient.id_card;
            document.getElementById("address-edit").value = patient.address;
            document.getElementById("email-edit").value = patient.email;
            document.getElementById("insurance-edit").value = patient.insurance;

            document.getElementById("editModal").style.display = "block";
            document.getElementById("overlay").style.display = "block";

            const saveButton = document.querySelector(".save-btn");
            saveButton.textContent = "SAVE";
            saveButton.onclick = () => updatePatient(id);
        })
        .catch((error) => {
            console.error("Error fetching employee details:", error);
            alert("Failed to load employee details. Please try again.");
        });
}

function updatePatient(id) {
    const phone = document.getElementById("phone-edit").value;
    const address = document.getElementById("address-edit").value;
    const email = document.getElementById("email-edit").value;
    const insurance = document.getElementById('insurance-edit').value;

    if (!phone || !address || !email || !insurance) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("phone_number", phone);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("insurance", insurance);

    fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: {
            'Authorization': `Token ${token}`, 
            'Content-Type': 'application/json'
        },
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    const errorMessage = errorData.errorMessage || "Failed to update medicine.";
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then((data) => {
            alert("Patient updated successfully!");

            document.getElementById("editModal").style.display = "none";
            document.getElementById("overlay").style.display = "none";

            loadPatients();
        })
        .catch((error) => {
            console.error("Error updating patient:", error);
            alert(`Failed to update patient: ${error.message}`);
        });
}