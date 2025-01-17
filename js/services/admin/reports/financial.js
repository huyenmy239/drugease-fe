import CONFIG from '../../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/reports`;

async function fetchData() {
    try {
        const response = await fetch(API_URL + '/medicine-revenue', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        populateTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('report-body').innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: red;">
                    Error loading data. Please try again later.
                </td>
            </tr>
        `;
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('revenue-report');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.time}</td>
            <td>${item.medicine_name}</td>
            <td>${item.cost}</td>
            <td>${item.revenue}</td>
            <td>${item.profit}</td>
        `;
        tableBody.appendChild(row);
    });
}

fetchData();