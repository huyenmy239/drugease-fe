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
        `;
        tableBody.appendChild(row);

        uniqueUnits.add(medicine.unit);

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

document.addEventListener('DOMContentLoaded', loadMedicines);