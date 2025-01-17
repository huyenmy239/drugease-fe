document.addEventListener('DOMContentLoaded', () => {
    const doctorTab = document.getElementById('doctor-tab');
    const pharmacistTab = document.getElementById('pharmacist-tab');
    const staffTab = document.getElementById('staff-tab');
    const doctorReport = document.getElementById('doctor-report');
    const pharmacistReport = document.getElementById('pharmacist-report');
    const satffReport = document.getElementById('staff-report');

    doctorTab.addEventListener('click', () => {
        doctorTab.classList.add('active');
        staffTab.classList.remove('active');
        pharmacistTab.classList.remove('active');
        doctorReport.style.display = 'block';
        pharmacistReport.style.display = 'none';
        satffReport.style.display = 'none';
    });

    staffTab.addEventListener('click', () => {
        staffTab.classList.add('active');
        doctorTab.classList.remove('active');
        pharmacistTab.classList.remove('active');
        satffReport.style.display = 'block';
        pharmacistReport.style.display = 'none';
        doctorReport.style.display = 'none';
    });

    pharmacistTab.addEventListener('click', () => {
        pharmacistTab.classList.add('active');
        doctorTab.classList.remove('active');
        staffTab.classList.remove('active');
        pharmacistReport.style.display = 'block';
        satffReport.style.display = 'none';
        doctorReport.style.display = 'none';
    });
});