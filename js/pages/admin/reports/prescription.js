document.addEventListener('DOMContentLoaded', () => {
    const prescriptionTab = document.getElementById('prescription-tab');
    const medicationsTab = document.getElementById('medications-tab');
    const prescriptionReport = document.getElementById('prescription-report');
    const medicationsReport = document.getElementById('medications-report');

    prescriptionTab.addEventListener('click', () => {
        prescriptionTab.classList.add('active');
        medicationsTab.classList.remove('active');
        prescriptionReport.style.display = 'block';
        medicationsReport.style.display = 'none';
    });

    medicationsTab.addEventListener('click', () => {
        medicationsTab.classList.add('active');
        prescriptionTab.classList.remove('active');
        prescriptionReport.style.display = 'none';
        medicationsReport.style.display = 'block';
    });
});