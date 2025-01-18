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
            <td>${patient.registration_date}</td>
        `;
        tableBody.appendChild(row);
    });
}


function filterPatients() {
    const searchInput = document.querySelector('.search-bar input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#patient-table-body tr');

    tableRows.forEach(row => {
        const fullName = row.cells[1].textContent.toLowerCase();
        const phoneNumber = row.cells[4].textContent.toLowerCase();

        if (fullName.includes(searchInput) || phoneNumber.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('input', filterPatients);


document.addEventListener('DOMContentLoaded', loadPatients);