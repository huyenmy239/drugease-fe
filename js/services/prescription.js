import CONFIG from '../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/prescriptions`;

const doctorId = localStorage.getItem('employee_id');
const addButton = document.querySelector(".add-btn");
const listDetails = document.querySelector(".list-details");
const listPrescription = document.querySelector(".list-prescription");
const medicineAdd = document.querySelector(".medicine-add");
const titleListPre = document.querySelector(".h-prescription");
const titleListDetails = document.querySelector(".h-details");

let medicineMap = {};
let prescriptionId = 1;

function handleAddButtonClick() {
    document.getElementById('patient-select').disabled = true;
    document.getElementById('disease-name').disabled = true;
    document.getElementById('advice').disabled = true;

    addButton.style.display = "none";
    medicineAdd.style.display = "grid";
    listDetails.style.display = "block";
    titleListDetails.style.display = "block";

    if (listPrescription && titleListPre) {
        listPrescription.style.display = "none";
        titleListPre.style.display = "none";
    }
}

async function handleEditButtonClick(patient, diagnosis, instruction, details) {
    await fetchMedicines();
    populateMedicineTable(details);
    const patientSelect = document.getElementById('patient-select');
    patientSelect.value = patient;

    const diseaseNameInput = document.getElementById('disease-name');
    diseaseNameInput.value = diagnosis;

    const adviceInput = document.getElementById('advice');
    adviceInput.value = instruction;

    patientSelect.disabled = true;

    addButton.style.display = "none";
    medicineAdd.style.display = "grid";
    listDetails.style.display = "block";
    titleListDetails.style.display = "block";

    if (listPrescription && titleListPre) {
        listPrescription.style.display = "none";
        titleListPre.style.display = "none";
    }
}

function getOptionTextByValue(selectId, value) {
    const select = document.getElementById(selectId);
    console.log(value);
    
    if (select) {
        const options = select.options;
        
        for (let i = 0; i < options.length; i++) {
            console.log(`Value: ${options[i].value}`);
            if (options[i].value === value) {
                return options[i].textContent || options[i].innerText;
            }
        }
    }
    return null;
}

function getMedicineNameById(id) {
    console.log(medicineMap);
    return medicineMap[id] || 'Unknown Medicine';
}

function populateMedicineTable(details) {
    const medicineTableBody = document.getElementById('detail-medicine-list');

    medicineTableBody.innerHTML = '';

    details.forEach(detail => {
        const row = document.createElement('tr');

        const medicineNameCell = document.createElement('td');
        
        medicineNameCell.textContent = detail.medicine_name;
        medicineNameCell.id = detail.medicine;
        row.appendChild(medicineNameCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = detail.quantity;
        row.appendChild(quantityCell);

        const usageInstructionCell = document.createElement('td');
        usageInstructionCell.textContent = detail.usage_instruction;
        row.appendChild(usageInstructionCell);

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `<button id="delete-btn"><i class="fa-solid fa-trash"></i></button>`;
        row.appendChild(actionCell);

        medicineTableBody.appendChild(row);
    });
}


async function fetchPatients() {
    try {
        const response = await fetch(`${API_URL}/patient-list/`);
        if (!response.ok) {
            throw new Error('Failed to fetch patients');
        }
        const patients = await response.json();
        populatePatientDropdown(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

async function fetchMedicines() {
    const response = await fetch(`${API_URL}/medicines/`);
    const data = await response.json();

    const medicineSelect = document.getElementById('medicine-select');
    medicineSelect.innerHTML = '';

    data.forEach(medicine => {
        const option = document.createElement('option');
        option.value = medicine.id;
        option.textContent = medicine.medicine_name;
        medicineSelect.appendChild(option);
    });

    console.log('Medicines loaded:', data);
}

function populatePatientDropdown(patients) {
    const patientSelect = document.getElementById('patient-select');
    patients.forEach((patient, index) => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.full_name;
        patientSelect.appendChild(option);

        if (index === 0) {
            option.selected = true;
        }
    });

    if (patients.length > 0) {
        fetchPatientDetails(patients[0].id);
    }
}

async function fetchPatientDetails(patientId) {
    try {
        const response = await fetch(`${API_URL}/patients/${patientId}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch patient details');
        }
        const patient = await response.json();
        displayPatientDetails(patient);
    } catch (error) {
        console.error('Error fetching patient details:', error);
    }
}

function displayPatientDetails(patient) {
    document.getElementById('dob').textContent = patient.date_of_birth || 'N/A';
    document.getElementById('gender').textContent = patient.gender ? 'Male' : 'Female';
    document.getElementById('address').textContent = patient.address || 'N/A';
    document.getElementById('insurance').textContent = patient.insurance || 0;
}

document.getElementById('patient-select').addEventListener('change', (event) => {
    const patientId = event.target.value;
    if (patientId) {
        fetchPatientDetails(patientId);
    } else {
        document.getElementById('dob').textContent = 'N/A';
        document.getElementById('gender').textContent = 'N/A';
        document.getElementById('address').textContent = 'N/A';
        document.getElementById('insurance').textContent = 'N/A';
    }
});

async function fetchPrescriptions() {
    try {
        const response = await fetch(`${API_URL}/prescription-list/?doctor=${doctorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch prescriptions');
        }

        const prescriptions = await response.json();
        populatePrescriptionTable(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
    }
}

function populatePrescriptionTable(prescriptions) {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';

    prescriptions.forEach(prescription => {
        const row = document.createElement('tr');

        const prescriptionIdCell = document.createElement('td');
        prescriptionIdCell.textContent = prescription.id;
        row.appendChild(prescriptionIdCell);

        const patientNameCell = document.createElement('td');
        patientNameCell.textContent = prescription.patient.full_name;
        row.appendChild(patientNameCell);

        const diagnosisCell = document.createElement('td');
        diagnosisCell.textContent = prescription.diagnosis || 'N/A';
        row.appendChild(diagnosisCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = prescription.prescription_date.split('T')[0];
        row.appendChild(dateCell);

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `
            <button><i id="edit-${prescription.id}-btn" class="edit-btn fa-solid fa-pen-to-square"></i></button>
            <button><i id="print-${prescription.id}-btn" class="print-btn fa-solid fa-print"></i></button>
            <button><i id="delete-${prescription.id}-btn" class="delete-btn fa-solid fa-trash"></i></button>
        `;
        row.appendChild(actionCell);

        patientList.appendChild(row);
    });

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        console.log("Clicked");
        button.addEventListener('click', async function () {
            prescriptionId = button.id.split('-')[1];
            try {
                const response = await fetch(`${API_URL}/prescriptions/${prescriptionId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('token')
                    }
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    console.log('Prescription to edit:', result);
                    fetchMedicines();
                    handleEditButtonClick(result.patient, result.diagnosis, result.instruction, result.details);
                } else {
                    alert('Failed to fetch prescription details: ' + result.detail);
                }
            } catch (error) {
                console.error('Error fetching prescription:', error);
                alert('An error occurred while fetching the prescription details.');
            }
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function () {
            prescriptionId = button.id.split('-')[1];

            const confirmDelete = confirm("Are you sure you want to delete this prescription?");
            if (!confirmDelete) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/prescriptions/${prescriptionId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    alert("Prescription deleted successfully!");
                    fetchPrescriptions();
                } else {
                    const result = await response.json();
                    alert(result);
                }
            } catch (error) {
                console.error('Error deleting prescription:', error);
                alert('An error occurred while deleting the prescription.');
            }
        });
    });

}


async function addPrescription() {
    const patientId = document.getElementById('patient-select').value;
    const diagnosis = document.getElementById('disease-name').value;
    const instruction = document.getElementById('advice').value;

    var diseaseName = document.getElementById("disease-name").value.trim();
    var advice = document.getElementById("advice").value.trim();

    if (diseaseName === "" || advice === "") {
        alert("Diagnosis and Instruction cannot be empty.");
        return;
    }

    const prescriptionData = {
        patient: patientId,
        diagnosis: diagnosis,
        instruction: instruction,
        doctor: doctorId,
        details: []
    };

    try {
        const response = await fetch(`${API_URL}/prescriptions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
            body: JSON.stringify(prescriptionData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Prescription added successfully!');
            handleAddButtonClick();
            fetchMedicines();
            prescriptionId = result.id;
        } else {
            alert('Failed to add prescription: ' + result.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the prescription.');
    }
}

document.getElementById('add-prescription-btn').addEventListener('click', addPrescription);

function init() {
    fetchPatients();
    fetchPrescriptions();
}

window.onload = init;


document.getElementById('save-btn').addEventListener('click', async function () {

    const medicineRows = document.querySelectorAll('#detail-medicine-list tr');

    if (medicineRows.length === 0) {
        alert('Please add at least one medicine to the prescription.');
        return;
    }
    
    const details = Array.from(medicineRows).map(row => {
        const medicineId = row.cells[0].id;
        const quantity = parseInt(row.cells[1].textContent);
        const note = row.cells[2].textContent;

        return {
            medicine: medicineId,
            quantity: quantity,
            usage_instruction: note
        };
    });

    const patientSelect = document.getElementById('patient-select');
    const patientId = patientSelect.value;

    const diagnosis = document.getElementById('disease-name');
    const diagnosisValue = diagnosis.value;

    const updateData = {
        doctor: doctorId,
        patient: patientId,
        diagnosis: diagnosisValue,
        details: details
    };

    try {
        const response = await fetch(`${API_URL}/prescriptions/${prescriptionId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Prescription updated successfully!');
            location.reload();
        } else {
            alert('Failed to update prescription: ' + result.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the prescription.');
    }
});