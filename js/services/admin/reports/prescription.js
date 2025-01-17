import CONFIG from '../../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/reports`;
const token = localStorage.getItem('token');


document.addEventListener('DOMContentLoaded', () => {
    const prescriptionReportTable = document.querySelector('#prescription-report tbody');

    async function fetchReportData() {
        try {
            const response = await fetch(API_URL + '/number-of-prescriptions', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            renderReportData(data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    function renderReportData(data) {
        prescriptionReportTable.innerHTML = '';
        data.forEach(report => {
            const row = `
                <tr>
                    <td>${report.month}</td>
                    <td>${report.total_prescriptions}</td>
                    <td>${report.unexported_prescriptions}</td>
                    <td>${report.exported_prescriptions}</td>
                    <td>${report.doctor}</td>
                </tr>
            `;
            prescriptionReportTable.insertAdjacentHTML('beforeend', row);
        });
    }

    fetchReportData();
});


document.addEventListener('DOMContentLoaded', () => {
    const medicationsReportTable = document.querySelector('#medications-report tbody');

    async function fetchMedicationsReport() {
        try {
            const response = await fetch(API_URL + '/med-in-prescription', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            renderMedicationsReport(data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    function renderMedicationsReport(data) {
        medicationsReportTable.innerHTML = '';
        data.forEach(report => {
            const row = `
                <tr>
                    <td>${report.medicine_name}</td>
                    <td>${report.number_of_prescriptions}</td>
                    <td>${report.avg_per_prescription.toFixed(2)}</td>
                    <td>${report.total_quantity}</td>
                </tr>
            `;
            medicationsReportTable.insertAdjacentHTML('beforeend', row);
        });
    }

    fetchMedicationsReport();
});
