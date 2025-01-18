import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/prescriptions/prescription-list/`;
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

        const prescriptions = await response.json();
        // if (statuscode !== 200) {
        //     throw new Error('Failed to fetch data.');
        // }

        renderTable(prescriptions);
    } catch (error) {
        console.error('Error loading prescriptions:', error);
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

    data.forEach(prescription => {
        const row = document.createElement('tr');
        const rawDate = prescription.prescription_date;
        const date = new Date(rawDate);

        const formattedDate = date.toLocaleDateString("en-GB");
        row.innerHTML = `
            <td>${prescription.doctor.full_name}</td>
            <td>${prescription.diagnosis}</td>
            <td>${formattedDate}</td>
            <td>${prescription.instruction}</td>
            <td>${prescription.patient.full_name}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Search filter
document.getElementById("search").addEventListener("input", async function (event) {
    const searchQuery = event.target.value.trim();
    const params = new URLSearchParams();

    // Thêm các trường cần tìm kiếm
    if (searchQuery) {
        params.append("query", searchQuery); // Chỉ gửi một tham số 'query'
    }

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            }
        });

        if (response.ok) {
            const prescriptions = await response.json();
            renderTable(prescriptions); // Hiển thị kết quả lên bảng
        } else {
            console.error("Failed to fetch prescriptions:", response.statusText);
        }
    } catch (error) {
        console.error("Error during search:", error);
    }
});

document.addEventListener('DOMContentLoaded', loadPatients);