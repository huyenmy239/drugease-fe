import CONFIG from '../../../utils/settings.js';

const API_URL = `http://${CONFIG.BASE_URL}/api/reports`;
const token = localStorage.getItem('token');


document.addEventListener('DOMContentLoaded', () => {
    const doctorReportTable = document.querySelector('#doctor-report tbody');

    async function fetchDoctorReport() {
        try {
            const response = await fetch(API_URL + '/doctor', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json' 
                }
            });
            const data = await response.json();
            renderDoctorReport(data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    function renderDoctorReport(data) {
        doctorReportTable.innerHTML = '';
        data.forEach(report => {
            const row = `
                <tr>
                    <td>${report.doctor_name}</td>
                    <td>${report.month}</td>
                    <td>${report.num_prescriptions}</td>
                    <td>${report.avg_minutes.toFixed(2)}</td>
                </tr>
            `;
            doctorReportTable.insertAdjacentHTML('beforeend', row);
        });
    }

    fetchDoctorReport();
});


document.addEventListener('DOMContentLoaded', () => {
    const pharmacistReportTable = document.querySelector('#pharmacist-report tbody');

    async function fetchPharmacistReport() {
        try {
            const response = await fetch(API_URL + '/pharmacist', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            renderPharmacistReport(data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    function renderPharmacistReport(data) {
        pharmacistReportTable.innerHTML = '';
        data.forEach(report => {
            const row = `
                <tr>
                    <td>${report.pharmacist_name}</td>
                    <td>${report.num_prescriptions}</td>
                    <td>${report.performance.toFixed(2)}</td>
                </tr>
            `;
            pharmacistReportTable.insertAdjacentHTML('beforeend', row);
        });
    }

    fetchPharmacistReport();
});
