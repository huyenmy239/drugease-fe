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
    tableBody.innerHTML = '';

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

    });
}

document.addEventListener('DOMContentLoaded', loadMedicines);