import CONFIG from '../../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/reports`;


document.addEventListener('DOMContentLoaded', () => {
    const exportReportTable = document.querySelector('#export-report tbody');

    async function fetchExportReport() {
        try {
            const response = await fetch(API_URL + '/medicine-export', {
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
            renderExportReport(data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    }

    function renderExportReport(data) {
        exportReportTable.innerHTML = '';
        data.forEach(report => {
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

    fetchExportReport();
});
