import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/warehouses`;
const token = localStorage.getItem('token');

const doctorId = localStorage.getItem('employee_id');
const addButton = document.querySelector(".add-btn");
const listDetails = document.querySelector(".list-details");
const listPrescription = document.querySelector(".list-import");
const medicineAdd = document.querySelector(".medicine-add");
const titleListPre = document.querySelector(".h-import");
const titleListDetails = document.querySelector(".h-details");

let medicineMap = {};
let prescriptionId = 1;

function handleAddButtonClick() {
    document.getElementById('warehouse-select').disabled = true;
    // document.getElementById('disease-name').disabled = true;
    // document.getElementById('advice').disabled = true;

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
    const patientSelect = document.getElementById('warehouse-select');
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
    const medicineTableBody = document.getElementById('detail-import-list');

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


async function fetchWarehouses() {
    try {
        const response = await fetch(`${API_URL}/warehouse-list/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch warehouses');
        }
        const data = await response.json();
        populateWarehousesDropdown(data.data);
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

async function fetchMedicines() {
    const response = await fetch(`${API_URL}/medicines/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        }
    });
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

function populateWarehousesDropdown(warehouses) {
    const warehouseSelect = document.getElementById('warehouse-select');
    warehouses.forEach((warehouse, index) => {
        const option = document.createElement('option');
        option.value = warehouse.id;
        option.textContent = warehouse.warehouse_name;
        warehouseSelect.appendChild(option);

        if (index === 0) {
            option.selected = true;
        }
    });

    // if (warehouses.length > 0) {
    //     fetchPatientDetails(warehouses[0].id);
    // }
}

// async function fetchPatientDetails(patientId) {
//     try {
//         const response = await fetch(`${API_URL}/patients/${patientId}/`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Token ${token}`,
//             }
//         });
//         if (!response.ok) {
//             throw new Error('Failed to fetch patient details');
//         }
//         const patient = await response.json();
//         displayPatientDetails(patient);
//     } catch (error) {
//         console.error('Error fetching patient details:', error);
//     }
// }

// function displayPatientDetails(patient) {
//     document.getElementById('dob').textContent = patient.date_of_birth || 'N/A';
//     document.getElementById('gender').textContent = patient.gender ? 'Male' : 'Female';
//     document.getElementById('address').textContent = patient.address || 'N/A';
//     document.getElementById('insurance').textContent = patient.insurance || 0;
// }

// document.getElementById('warehouse-select').addEventListener('change', (event) => {
//     const patientId = event.target.value;
//     if (patientId) {
//         fetchPatientDetails(patientId);
//     } else {
//         document.getElementById('dob').textContent = 'N/A';
//         document.getElementById('gender').textContent = 'N/A';
//         document.getElementById('address').textContent = 'N/A';
//         document.getElementById('insurance').textContent = 'N/A';
//     }
// });

async function fetchImportReceipts() {
    try {
        const response = await fetch(`${API_URL}/import-receipts/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch import receipt');
        }

        const importReceipts = await response.json();
        populateImportReceiptTable(importReceipts);
    } catch (error) {
        console.error('Error fetching import receipt:', error);
    }
}

function populateImportReceiptTable(importReceipts) {
    const importList = document.getElementById('import-list');
    importList.innerHTML = '';

    importReceipts.forEach(importreceipt => {
        const row = document.createElement('tr');

        const importIdCell = document.createElement('td');
        importIdCell.textContent = importreceipt.id;
        row.appendChild(importIdCell);

        const dateImportCell = document.createElement('td');
        dateImportCell.textContent = importreceipt.import_date.split('T')[0];
        row.appendChild(dateImportCell);

        const warehouseCell = document.createElement('td');
        warehouseCell.textContent = importreceipt.warehouse;
        row.appendChild(warehouseCell);

        const totalAmountCell = document.createElement('td');
        totalAmountCell.textContent = importreceipt.total_amount;
        row.appendChild(totalAmountCell);

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `
            <button><i id="edit-${importreceipt.id}-btn" class="edit-btn fa-solid fa-pen-to-square"></i></button>
            <button><i id="print-${importreceipt.id}-btn" class="print-btn fa-solid fa-print"></i></button>
            <button><i id="delete-${importreceipt.id}-btn" class="delete-btn fa-solid fa-trash"></i></button>
        `;
        row.appendChild(actionCell);

        importList.appendChild(row);
    });

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        console.log("Clicked");
        button.addEventListener('click', async function () {
            importId = button.id.split('-')[1];
            try {
                const response = await fetch(`${API_URL}/import-receipts/${importId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    console.log('Prescription to edit:', result);
                    fetchMedicines();
                    handleEditButtonClick(result.warehouse, result.total_amount, result.import_date, result.details);
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
                        'Authorization': `Token ${token}`
                    }
                });

                if (response.ok) {
                    alert("Prescription deleted successfully!");
                    fetchImportReceipts();
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
    const patientId = document.getElementById('warehouse-select').value;
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
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(prescriptionData)
        });

        const result = await response.json();

        if (!response.ok) {
            if (typeof result === "object") {
                let errorMessages = [];
                for (const [key, value] of Object.entries(result)) {
                    errorMessages.push(`${key}: ${value}`);
                }
                throw new Error(errorMessages.join("\n"));
            }
            throw new Error(result.detail || "Failed to add prescription.");
        }

        alert('Prescription added successfully!');
        handleAddButtonClick();
        fetchMedicines();
        prescriptionId = result.id;

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: \n' + error.message);
    }
}

document.getElementById('add-import-btn').addEventListener('click', addPrescription);

function init() {
    fetchWarehouses();
    fetchImportReceipts();
}

window.onload = init;


document.getElementById('save-btn').addEventListener('click', async function () {

    const medicineRows = document.querySelectorAll('#detail-import-list tr');

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

    const patientSelect = document.getElementById('warehouse-select');
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
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (!response.ok) {
            if (typeof result === "object") {
                let errorMessages = [];
                for (const [key, value] of Object.entries(result)) {
                    errorMessages.push(`${key}: ${value}`);
                }
                throw new Error(errorMessages.join("\n"));
            }
            throw new Error(result.detail || "Failed to add prescription.");
        }

            alert('Prescription updated successfully!');
            location.reload();

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: \n' + error.message);
    }
});