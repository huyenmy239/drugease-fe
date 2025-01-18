import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/warehouses/medicines/`;
const token = localStorage.getItem('token');

async function loadMedicines() {
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

        renderMedicineTable(data);
    } catch (error) {
        console.error('Error loading medicines:', error);
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: red;">
                    Error loading data. Please try again later.
                </td>
            </tr>
        `;
    }
}

function renderMedicineTable(data) {
    const tableBody = document.getElementById('medicine-list');
    const unitFilter = document.getElementById('unit-filter');
    tableBody.innerHTML = '';

    const uniqueUnits = new Set();

    data.forEach(medicine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${medicine.id}</td>
            <td>${medicine.medicine_name}</td>
            <td>${medicine.stock_quantity}</td>
            <td>${medicine.unit}</td>
            <td>${medicine.description}</td>
            <td>${medicine.sale_price.toLocaleString()}</td>
            <td class="actions">
                <i class="fas fa-pen" title="Edit"></i>
                <i class="fas fa-trash" title="Delete"></i>
            </td>
        `;
        tableBody.appendChild(row);

        uniqueUnits.add(medicine.unit);

        const editIcon = row.querySelector('.fa-pen');
        const deleteIcon = row.querySelector('.fa-trash');

        editIcon.addEventListener('click', () => editMedicine(medicine.id));
        deleteIcon.addEventListener('click', () => deleteMedicine(medicine.id));
    });

    unitFilter.innerHTML = '<option value="">Filter by Unit</option>'; // Clear existing options and add default
    uniqueUnits.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitFilter.appendChild(option);
    });
}

function populateUnitFilter() {
    const unitFilter = document.getElementById('unit-filter');
    const tableRows = document.querySelectorAll('#medicine-list tr');
    const units = new Set();

    tableRows.forEach(row => {
        const unit = row.cells[3].textContent.trim();
        units.add(unit);
    });

    unitFilter.innerHTML = '<option value="">Filter by Unit</option>';

    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitFilter.appendChild(option);
    });
}

function filterByUnit() {
    const selectedUnit = document.getElementById('unit-filter').value;
    const tableRows = document.querySelectorAll('#medicine-list tr');

    tableRows.forEach(row => {
        const unit = row.cells[3].textContent.trim();

        if (selectedUnit === '' || unit === selectedUnit) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

const unitFilter = document.getElementById('unit-filter');
unitFilter.addEventListener('change', filterByUnit);

document.addEventListener('DOMContentLoaded', populateUnitFilter);



function filterMedicines() {
    const searchInput = document.querySelector('.search-bar input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#medicine-list tr');

    tableRows.forEach(row => {
        const medicineName = row.cells[1].textContent.toLowerCase();
        const description = row.cells[4].textContent.toLowerCase();

        if (medicineName.includes(searchInput) || description.includes(searchInput)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}

const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('input', filterMedicines);





function editMedicine(medicineId) {
    document.getElementById("editModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    fetch(`${API_URL}${medicineId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((medicine) => {
            document.getElementById("name-edit").value = medicine.data.medicine_name;
            document.getElementById("quantity-edit").value = medicine.data.stock_quantity;
            document.getElementById("unit-edit").value = medicine.data.unit;
            document.getElementById("description-edit").value = medicine.data.description;
            document.getElementById("price-edit").value = medicine.data.sale_price;

            document.getElementById("editModal").style.display = "block";
            document.getElementById("overlay").style.display = "block";

            const saveButton = document.querySelector(".save-btn");
            saveButton.textContent = "SAVE";
            saveButton.onclick = () => updateMedicine(medicineId);
        })
        .catch((error) => {
            console.error("Error fetching medicine details:", error);
            alert("Failed to load medicine details. Please try again.");
        });
}

function updateMedicine(id) {
    const name = document.getElementById("name-edit").value;
    const unit = document.getElementById("unit-edit").value;
    const desc = document.getElementById("description-edit").value;
    const price = document.getElementById("price-edit").value;

    if (!name || !quantity || !unit || !desc || !price) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("unit", unit);
    formData.append("description", desc);
    formData.append("sale_price", price);

    fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: {
            'Authorization': `Token ${token}`,
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
            alert("Medicine updated successfully!");

            document.getElementById("editModal").style.display = "none";
            document.getElementById("overlay").style.display = "none";

            loadMedicines();
        })
        .catch((error) => {
            console.error("Error updating medicine:", error);
            alert(`Failed to update medicine: ${error.message}`);
        });
}

function deleteMedicine(medicineId) {
    const confirmDelete = confirm(`Are you sure you want to delete the medicine with ID: ${medicineId}?`);

    if (!confirmDelete) {
        console.log('Delete action cancelled.');
        return;
    }

    fetch(`${API_URL}${medicineId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    const errorMessage = errorData.errorMessage || `Failed to delete medicine. Status: ${response.status}`;
                    throw new Error(errorMessage);
                });
            }
            alert(`Medicine with ID: ${medicineId} deleted successfully.`);
            console.log(`Deleted medicine with ID: ${medicineId}`);
            
            loadMedicines();
        })
        .catch(error => {
            console.error('Error deleting medicine:', error);
            alert(error.message);
        });
}

document.addEventListener('DOMContentLoaded', loadMedicines);


document.getElementById('add-btn').addEventListener('click', () => {
    document.getElementById('createModal').style.display = 'block';
});

document.getElementById('createMedicine').addEventListener('click', async () => {
    const medicineName = document.getElementById('name').value.trim();
    const unit = document.getElementById('unit').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);

    if (!medicineName || !unit || isNaN(price)) {
        alert('Please fill out all required fields correctly.');
        return;
    }

    const medicineData = {
        medicine_name: medicineName,
        unit: unit,
        sale_price: price,
        description: description,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        alert('Medicine added successfully!');
        console.log('Response:', result);

        document.getElementById('createModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        clearForm();

        loadMedicines();
    } catch (error) {
        console.error('Error creating medicine:', error);
        alert('Failed to add medicine. Please try again.');
    }
});

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('unit').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
}
