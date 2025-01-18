import CONFIG from '../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/warehouses`;
const API_PRES = `http://${CONFIG.BASE_URL}/api/prescriptions`;


// DOM Elements
const prescriptionSelect = document.getElementById('prescription-select');
const warehouseSelect = document.getElementById('warehouse-select');
const addExportBtn = document.getElementById('add-export-btn');
const listExport = document.querySelector('.list-export');
const hExport = document.querySelector('.h-export');
const hDetails = document.querySelector('.h-details');
const listDetails = document.querySelector('.list-details');
const medicineDetail = document.querySelector('.medicine-add');
const exportList = document.getElementById('export-list');
const detailMedicineList = document.getElementById('detail-medicine-list');
const dateElement = document.getElementById('date');
//const totalAmount = document.getElementById('total_amount');
const showPrescriptionId = document.getElementById('prescription');
const divShowPres = document.querySelector('.show-prescription');
const divGetPres = document.querySelector('.prescription-select');

let exportId = 0;

function formatDateTime(datetimeString) {
    const date = new Date(datetimeString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', '');
}

function setTodayDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    dateElement.textContent = formattedDate;
}

function changeQuantity(amount) {
    var quantityInput = document.getElementById('quantity');
    var newValue = parseInt(quantityInput.value) + amount;
    if (newValue >= 1) {
        quantityInput.value = newValue;
    }
}

// Handle the display for the "Add" button
function handleAddButtonClick() {
    
    addExportBtn.style.display = "none";
    medicineDetail.style.display = "grid";
    listDetails.style.display = "block";
    hDetails.style.display = "block";
    document.querySelector('.filter-container').style.display = 'none';

    if (listExport && hExport) {
        listExport.style.display = "none";
        hExport.style.display = "none";
    }
}

// Fetch data for dropdowns
async function fetchDropdownData() {
    try {
        const [prescriptions, warehouses] = await Promise.all([
            fetch(`${API_URL}/unexportedprescription-list/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()),
            
            fetch(`${API_URL}/warehouses-list/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
        ]);

        
        prescriptionSelect.innerHTML = prescriptions.map(p => `<option value="${p.id}">${p.id}</option>`).join('');

        warehouseSelect.innerHTML = warehouses.map(w => `<option value="${w.id}">${w.warehouse_name}</option>`).join('');
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
    }
}

// Fetch and display export receipts



// Handle delete receipt
async function handleDeleteReceipt(exportId) {
    const confirmDelete = confirm("Are you sure you want to delete this export receipt?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
        });

        if (response.ok) {
            alert('Export receipt deleted successfully!');
            fetchExportReceipts("all"); 
        } else {
            const result = await response.json();
            alert('Failed to delete export receipt: ' + result.detail);
        }
    } catch (error) {
        console.error('Error deleting export receipt:', error);
        alert('An error occurred while deleting the export receipt.');
    }
}

// Handle viewing receipt details
async function handleViewReceipt(exportId) {
    try {
        const receipt = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        
        dateElement.textContent = formatDateTime(receipt.export_date);
        
        showPrescriptionId.textContent = receipt.prescription;
        warehouseSelect.value = receipt.warehouse;

        
        divGetPres.style.display = "none";
        divShowPres.style.display = "block";

        warehouseSelect.disabled = true;
        
        handleAddButtonClick();
        fetchViewExportDetails(exportId);
    } catch (error) {
        console.error('Error fetching receipt details:', error);
    }
}

// Handle the "Print" button
async function handlePrintButtonClick(exportId) {
    try {
        
        const receipt = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'), 
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        
        if (receipt.is_approved) {
            document.querySelector(`[data-id="${exportId}"] .print-btn`).disabled = true;
            document.querySelector(`[data-id="${exportId}"] .delete-btn`).disabled = true;
            return;
        }

        receipt.is_approved = true;

        
        const response = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'PUT',  
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token'),  
            },
            body: JSON.stringify(receipt),  
        });

        if (response.ok) {
            
            alert("Approved Successfully");
            location.reload();  

            
            const printButton = document.querySelector(`[data-id="${exportId}"] .print-btn`);
            const delButton = document.querySelector(`[data-id="${exportId}"] .delete-btn`);
            if (printButton) {
                printButton.disabled = true;
                delButton.disabled = true;
            } else {
                console.error("Không tìm thấy nút Print!");
            }
        } else {
            alert("Approval failed");
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Đã xảy ra lỗi khi phê duyệt.");
    }
}



async function fetchViewExportDetails(exportId) {
    prescriptionSelect.disabled = true;
    warehouseSelect.disabled = true;

    try {
        const exportDetails = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'), 
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        detailMedicineList.innerHTML = exportDetails.details.map(detail =>
            `<tr data-id="${exportId}" data-medicine-id="${detail.medicine}">
                <td>${detail.medicine_name}</td>
                <td>${detail.quantity}</td>
                <td>${detail.price}</td>
                <td>${detail.insurance_covered}</td>
                <td>${detail.ins_amount}</td>
                <td>${detail.patient_pay}</td>
                <td>
                    <button class="edit-btn" ${exportDetails.is_approved ? 'disabled' : ''}><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="delete-detail-btn" ${exportDetails.is_approved ? 'disabled' : ''}><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`
        ).join('');

        
        document.querySelectorAll('.delete-detail-btn').forEach(button => {
            button.addEventListener('click', function () {
                const row = this.closest('tr');
                row.style.display = 'none';  
            });
        });

        
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                handleEditClick(this);
            });
        });

    } catch (error) {
        console.error('Error fetching export details:', error);
    }
}

document.getElementById('save-btn').addEventListener('click', async function () {
    
    const updatedDetails = Array.from(detailMedicineList.querySelectorAll('tr'))
        .filter(row => row.style.display !== 'none')  
        .map(row => ({
            exportId: row.getAttribute('data-id'),  
            medicine: row.getAttribute('data-medicine-id'),  
            quantity: row.children[1].textContent.trim()  
        }));

    if (updatedDetails.length === 0) return;  

   
    const exportId = updatedDetails[0].exportId;
    const response = await fetch(`${API_URL}/warehouse/${exportId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    });
   
    const data = await response.json();

    // Tạo updateData
    const updateData = {
        prescription: data.prescription, 
        warehouse: data.warehouse,  
        employee: localStorage.getItem('employee_id'), 
        details: updatedDetails  
    };

    try {
        
        const response = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            alert('Cập nhật thành công!');
            fetchViewExportDetails(exportId);  
        } else {
            alert('Cập nhật thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
    }
});

let selectedRowData = {};
// Xử lý nút edit
async function handleEditClick(event) {
    const row = event.closest('tr');
    selectedRowData = {
        row,
        medicineId: row.getAttribute('data-medicine-id'),
        medicineName: row.cells[0].textContent.trim(),
        quantity: row.cells[1].textContent.trim(),
        price: row.cells[2].textContent.trim(),
        insuranceCovered: row.cells[3].textContent.trim(),
        insAmount: row.cells[4].textContent.trim(),
        patientPay: row.cells[5].textContent.trim()
    };
    
    document.querySelector('.medicine-select span').textContent = selectedRowData.medicineName;
    document.getElementById('quantity').value = selectedRowData.quantity;

    try {
        const stockQuantity = await fetchStockQuantity(selectedRowData.medicineId);
        document.getElementById('stock-quantity').textContent = stockQuantity ?? 'N/A';

        
    } catch (error) {
        console.error("Lỗi khi lấy số lượng tồn kho:", error);
        document.getElementById('stock-quantity').textContent = 'N/A';
    }
}


function fetchStockQuantity(medicineId) {

    return fetch(`${API_URL}/medicines/${medicineId}/`, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token'),  
            'Content-Type': 'application/json'  
        }
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.data && data.data.hasOwnProperty('stock_quantity')) {
            const stockQuantity = data.data.stock_quantity;
            return stockQuantity ? `Số lượng tồn: ${stockQuantity}` : 'Số lượng tồn: N/A';  // Trả về stock_quantity nếu tồn tại
        } else {
            
            console.error("Không tìm thấy stock_quantity trong dữ liệu trả về:", data);
            return 'N/A';
        }
    })
    .catch(error => {
        console.error("Lỗi khi gọi API lấy số lượng tồn kho:", error);
        return 'N/A';
    });
}



// Xử lý nút add
async function handleAddClick() {
    const quantityInput = document.getElementById('quantity');
    if (!selectedRowData.row) return;
    
    const newQuantity = parseFloat(quantityInput.value); 
    const oldQuantity = parseFloat(selectedRowData.quantity);  

    
    const stockQuantityText = document.getElementById('stock-quantity').textContent;
    const stockQuantity = parseFloat(stockQuantityText.replace('Số lượng tồn: ', '').trim());

    if (isNaN(newQuantity) || newQuantity <= 0 || newQuantity > stockQuantity) {
        alert("Invalid quantity");
        newQuantity = oldQuantity;  
        quantityInput.value = oldQuantity;  
    }

    
    const oldPrice = parseFloat(selectedRowData.price);
    const oldInsAmount = parseFloat(selectedRowData.insAmount);
    
    const unitPrice = oldPrice / oldQuantity;  
    const insuranceRate = oldInsAmount / oldPrice;  
    selectedRowData.row.cells[1].textContent = newQuantity;  

    
    if (selectedRowData.insuranceCovered) {
        
        const newPrice = unitPrice * newQuantity; 
        const newInsAmount = (newPrice * insuranceRate).toFixed(2);  
        const newPatientPay = (newPrice - newInsAmount).toFixed(2);  

        
        selectedRowData.row.cells[2].textContent = newPrice;  
        selectedRowData.row.cells[4].textContent = newInsAmount;  
        selectedRowData.row.cells[5].textContent = newPatientPay;  
    } else {
        
        const newPrice = unitPrice * newQuantity;  
        selectedRowData.row.cells[2].textContent = newPrice;  
        selectedRowData.row.cells[4].textContent = newPrice;  
        selectedRowData.row.cells[5].textContent = '0.00';  
    }
}

document.getElementById('add-medicine').addEventListener('click', handleAddClick);



async function fetchExportDetails(exportId) {
    const prescriptionId = prescriptionSelect.value;
    const warehouseId = warehouseSelect.value;
    const employeeId = localStorage.getItem('employee_id');

    try {
        
        const prescriptionResponse = await fetch(`${API_PRES}/prescriptions/${prescriptionId}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        if (!prescriptionResponse.ok) throw new Error('Failed to fetch prescription');
        const prescription = await prescriptionResponse.json();
        if (!prescription || !prescription.details) return alert('No matching prescription found.');

        
        const postData = [];

        for (const detail of prescription.details) {
            const medicineId = detail.medicine;

            try {
                const stockResponse = await fetch(`${API_URL}/medicines/${medicineId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                });

                if (!stockResponse.ok) throw new Error(`Failed to fetch stock for medicine ${medicineId}`);
                const stockData = await stockResponse.json();

                
                const availableQuantity = stockData?.data?.stock_quantity || 0;

                postData.push({
                    medicine: medicineId, 
                    quantity: Math.min(detail.quantity, availableQuantity) 
                });
            } catch (stockError) {
                console.error(`Error fetching stock for medicine ${medicineId}:`, stockError);
            }
        }

        
        const updateData = { 
            prescription: prescriptionId, 
            warehouse: warehouseId, 
            employee: employeeId, 
            details: postData 
        };

        
        const updateResponse = await fetch(`${API_URL}/warehouse/${exportId}/`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) throw new Error('Failed to update export receipt');

        fetchViewExportDetails(exportId);
    } catch (error) {
        console.error('Error while fetching export details:', error);
        alert(`Error: ${error.message}`);
    }
}

// Add export receipt
async function addExport() {
    const prescriptionId = prescriptionSelect.value;
    const warehouseId = warehouseSelect.value;
    const employeeId = localStorage.getItem('employee_id'); 

    if (!prescriptionId || !warehouseId) return alert('Please select a prescription and a warehouse.');

    const exportData = {
        prescription: prescriptionId,
        warehouse: warehouseId,
        employee: employeeId,
        details: [] 
    };

    try {
        const response = await fetch(`${API_URL}/warehouse/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
             },
            body: JSON.stringify(exportData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Export Receipt added successfully!');
            handleAddButtonClick();
            exportId = result.id;
            fetchExportDetails(exportId);
        } else {
            alert('Failed to add prescription: ' + result.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the export receipt.');
    }
}


async function fetchExportReceipts(statusFilter = "") {
    try {
        let apiUrl = `${API_URL}`;

        if (statusFilter !== "all") {
            apiUrl += `/export-search?is_approved=${statusFilter}`;
        } else {
            apiUrl += `/export-list`;
        }

        console.log("API URL:", apiUrl); 

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('API error:', response.statusText);
            return;
        }

        const receipts = await response.json();

        
            exportList.innerHTML = receipts.map(receipt => `
                <tr>
                    <td>${receipt.id}</td>
                    <td>${receipt.warehouse.warehouse_name}</td>
                    <td>${formatDateTime(receipt.export_date)}</td>
                    <td>${receipt.total_amount}</td>
                    <td>
                        <button class="view-btn" data-id="${receipt.id}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="print-btn" data-id="${receipt.id}" ${receipt.is_approved ? 'disabled' : ''}>
                            <i class="fa-solid fa-print"></i>
                        </button>
                        <button class="delete-btn" data-id="${receipt.id}" ${receipt.is_approved ? 'disabled' : ''}>
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('.view-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const exportId = this.getAttribute('data-id');
                    handleViewReceipt(exportId);
                });
            });
    
            document.querySelectorAll('.print-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const exportId = this.getAttribute('data-id');
                    handlePrintButtonClick(exportId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const exportId = this.getAttribute('data-id');
                    handleDeleteReceipt(exportId);
                });
            });
        

    } catch (error) {
        console.error('Lỗi khi tải danh sách phiếu xuất:', error);
    }
}


    document.getElementById("receipt-filter").addEventListener("change", function () {
        const statusFilter = this.value;
        console.log('Status Filter:', statusFilter);  
        fetchExportReceipts(statusFilter); 
    });







document.addEventListener('DOMContentLoaded', function () {
    setTodayDate();
    fetchDropdownData();
    fetchExportReceipts("all");
});


addExportBtn.addEventListener('click', addExport);


