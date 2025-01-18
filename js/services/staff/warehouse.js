import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/warehouses/warehouses/`;
const token = localStorage.getItem('token');

const openModal = document.getElementById('add-btn');
const closeModal = document.getElementById('closeModal');
const closeEditModal = document.getElementById('closeEditModal');
const editModal = document.getElementById('editModal');
const modal = document.getElementById('createModal');
const overlay = document.getElementById('overlay');

openModal.addEventListener('click', () => {
    modal.style.display = 'block';
    overlay.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

closeEditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
    overlay.style.display = 'none';
});


overlay.addEventListener('click', () => {
    modal.style.display = 'none';
    editModal.style.display = 'none';
    overlay.style.display = 'none';
});

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
                    <td class="action-icons">
                        <i class="fas fa-pen" title="Edit"></i>
                        <i class="fas fa-trash" title="Delete"></i>
                    </td>
                `;
                tableBody.appendChild(row);

                const editIcon = row.querySelector('.fa-pen');
                const deleteIcon = row.querySelector('.fa-trash');

                editIcon.addEventListener('click', () => editWarehouse(warehouse.id));
                deleteIcon.addEventListener('click', () => deleteWarehouse(warehouse.id));
            });
        })
        .catch((error) => {
            console.error('Error fetching warehouses:', error);
            alert('Failed to load warehouses. Please try again.');
        });
}


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


function editWarehouse(id) {
    fetch(`${API_URL}${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch warehouse data. Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Điền dữ liệu vào form chỉnh sửa
            document.getElementById('name-edit').value = data.warehouse_name;
            document.getElementById('address-edit').value = data.address;
            const active = data.is_active ? "1" : "0";
            document.querySelector(`input[name="active-edit"][value="${active}"]`).checked = true;

            // Hiển thị modal chỉnh sửa
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';

            document.getElementById('save').dataset.id = id;
        })
        .catch((error) => {
            console.error('Error fetching warehouse data:', error);
            alert('Failed to load warehouse data. Please try again.');
        });
}

function saveWarehouseEdit() {
    const id = document.getElementById('save').dataset.id; // Lấy ID từ nút Save

    // Lấy dữ liệu từ form
    const address = document.getElementById('address-edit').value.trim();
    const active = document.querySelector('input[name="active-edit"]:checked').value;
    const isActive = active === "1" ? true : false;

    // Kiểm tra dữ liệu
    if (!address) {
        alert('Please fill out all required fields.');
        return;
    }

    // Dữ liệu gửi đến API
    const requestData = {
        address: address,
        is_active: isActive,
    };

    // Gọi API để lưu chỉnh sửa
    fetch(`${API_URL}${id}/`, {
        method: 'PUT', // Phương thức PUT để cập nhật dữ liệu
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // Chuyển dữ liệu thành JSON
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    const errorMessage = errorData.errorMessage || 'Failed to update warehouse.';
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then((data) => {
            alert('Warehouse updated successfully!');
            console.log('Updated Warehouse:', data);

            // Ẩn modal chỉnh sửa sau khi cập nhật thành công
            document.getElementById('editModal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';

            // Tải lại danh sách kho
            loadWarehouses();
        })
        .catch((error) => {
            console.error('Error updating warehouse:', error);
            alert(`Failed to update warehouse: ${error.message}`);
        });
}

document.getElementById('save').addEventListener('click', saveWarehouseEdit);

function deleteWarehouse(id) {

}


document.getElementById('createWarehouse').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !address) {
        alert('Please fill out all required fields.');
        return;
    }

    const requestData = {
        warehouse_name: name,
        address: address,
        is_active: true
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`, // Thêm token vào header
            'Content-Type': 'application/json' // Định dạng JSON
        },
        body: JSON.stringify(requestData) // Chuyển dữ liệu thành chuỗi JSON
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    const errorMessage = errorData.errorMessage || 'Failed to create warehouse.';
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then((data) => {
            alert('Warehouse created successfully!');
            console.log('Created Warehouse:', data);

            // Đóng modal sau khi tạo thành công
            document.getElementById('createModal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';

            // Tải lại danh sách kho
            loadWarehouses();
            clearForm();
        })
        .catch((error) => {
            console.error('Error creating warehouse:', error);
            alert(`Failed to create warehouse: ${error.message}`);
        });
});

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
}

// Đóng modal khi nhấn nút Cancel
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('createModal').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', loadWarehouses);