import CONFIG from '../../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/reports`;


document.addEventListener('DOMContentLoaded', () => {
    // Bảng export report
    const exportReportTable = document.querySelector('#export-report tbody');
    // Bảng import report
    const importReportTable = document.querySelector('#import-report tbody');
    // Bảng inventory
    const inventoryTable = document.querySelector('#inventory-report tbody');

    // Hàm fetch dữ liệu từ API
    async function fetchData(apiPath) {
        try {
            const response = await fetch(API_URL + apiPath, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            return null;
        }
    }

    // Hàm render dữ liệu cho bảng
    function renderTable(tableElement, data, rowRenderer) {
        tableElement.innerHTML = '';
        data.forEach(rowRenderer);
    }

    // Hàm render dữ liệu cho bảng Export Report
    async function fetchAndRenderExportReport() {
        const data = await fetchData('/medicine-export');
        if (data) {
            renderTable(exportReportTable, data, (report) => {
                const row = `
                    <tr>
                        <td>${report.time}</td>
                        <td>${report.medicine_name}</td>
                        <td>${report.total_quantity}</td>
                    </tr>
                `;
                exportReportTable.insertAdjacentHTML('beforeend', row);
            });
        }
    }

    // Hàm render dữ liệu cho bảng Import Report
    async function fetchAndRenderImportReport() {
        const result = await fetchData('/import-receipt');
        if (result && result.statuscode === 200 && result.status === "success") {
            renderTable(importReportTable, result.data, (item) => {
                const row = `
                    <tr>
                        <td>${item.import_date}</td>
                        <td>${item.employee_name}</td>
                        <td>${item.medicine_name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.total_cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                `;
                importReportTable.insertAdjacentHTML('beforeend', row);
            });
        } else {
            console.error("Failed to fetch Import Report data");
        }
    }

    // Hàm render dữ liệu cho bảng Inventory
    async function fetchAndRenderInventory() {
        const result = await fetchData('/inventory');
        if (result && result.statuscode === 200 && result.status === "success") {
            renderTable(inventoryTable, result.data, (item) => {
                const row = `
                    <tr>
                        <td>${item.medicine_name}</td>
                        <td>${item.stock_quantity}</td>
                        <td>${item.status_inventory}</td>
                    </tr>
                `;
                inventoryTable.insertAdjacentHTML('beforeend', row);
            });
        } else {
            console.error("Failed to fetch Inventory data");
        }
    }

    // Gọi các hàm fetch và render
    fetchAndRenderExportReport();
    fetchAndRenderImportReport();
    fetchAndRenderInventory();
});
