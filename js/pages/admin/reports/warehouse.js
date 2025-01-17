document.addEventListener('DOMContentLoaded', () => {
    const inventoryTab = document.getElementById('inventory-tab');
    const importTab = document.getElementById('import-tab');
    const exportTab = document.getElementById('export-tab');
    const inventoryReport = document.getElementById('inventory-report');
    const importReport = document.getElementById('import-report');
    const exportReport = document.getElementById('export-report');

    inventoryTab.addEventListener('click', () => {
        inventoryTab.classList.add('active');
        exportTab.classList.remove('active');
        importTab.classList.remove('active');
        inventoryReport.style.display = 'block';
        importReport.style.display = 'none';
        exportReport.style.display = 'none';
    });

    exportTab.addEventListener('click', () => {
        exportTab.classList.add('active');
        inventoryTab.classList.remove('active');
        importTab.classList.remove('active');
        exportReport.style.display = 'block';
        importReport.style.display = 'none';
        inventoryReport.style.display = 'none';
    });

    importTab.addEventListener('click', () => {
        importTab.classList.add('active');
        inventoryTab.classList.remove('active');
        exportTab.classList.remove('active');
        importReport.style.display = 'block';
        exportReport.style.display = 'none';
        inventoryReport.style.display = 'none';
    });
});