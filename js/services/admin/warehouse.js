import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/warehouses/warehouses/`;
const token = localStorage.getItem('token');

function loadWarehouses() {

    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`, // Thêm token vào header
            'Content-Type': 'application/json' // Định dạng JSON
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch warehouses. Status: ${response.status}`);
            }
            return response.json();
        })
        .then((warehouses) => {
            const tableBody = document.querySelector('table tbody'); // Chọn phần <tbody> của bảng
            tableBody.innerHTML = ""; // Xóa nội dung cũ nếu có

            warehouses.forEach((warehouse) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${warehouse.id}</td>
                    <td>${warehouse.warehouse_name}</td>
                    <td>${warehouse.address}</td>
                    <td class="${warehouse.is_active ? 'status-active' : 'status-inactive'}">
                        ${warehouse.is_active ? 'Active' : 'Inactive'}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error('Error fetching warehouses:', error);
            alert('Failed to load warehouses. Please try again.');
        });
}

document.addEventListener('DOMContentLoaded', loadWarehouses);


function filterWarehouses() {
    const searchInput = document.querySelector('.search-bar input').value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const warehouseName = row.cells[1].textContent.toLowerCase();
        const address = row.cells[2].textContent.toLowerCase();

        if (warehouseName.includes(searchInput) || address.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('input', filterWarehouses);