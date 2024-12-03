document.addEventListener('DOMContentLoaded', () => {
    const fromDate = document.getElementById('from-date');
    const toDate = document.getElementById('to-date');
    const datePicker = document.querySelector('.date-picker');

    const creationBtn = document.querySelector('.creation-btn');
    const topBtn = document.querySelector('.top-btn');
    const statsCreation = document.querySelector('.stats-creation');
    const statsTop = document.querySelector('.stats-top');

    // Mặc định hiển thị stats-creation
    statsCreation.style.display = 'block';
    statsTop.style.display = 'none';

    // Thêm hiệu ứng active cho nút mặc định
    creationBtn.classList.add('active');
    topBtn.classList.remove('active');

    // Toggle giữa hai bảng
    creationBtn.addEventListener('click', () => {
        statsCreation.style.display = 'block';
        statsTop.style.display = 'none';
        creationBtn.classList.add('active');
        topBtn.classList.remove('active');
        datePicker.style.display = 'block';
    });

    topBtn.addEventListener('click', () => {
        statsCreation.style.display = 'none';
        statsTop.style.display = 'block';
        topBtn.classList.add('active');
        creationBtn.classList.remove('active');
        datePicker.style.display = 'none';
    });

    // Pagination
    const paginateTable = (tableSelector, rowsPerPage = 9) => {
        const table = document.querySelector(tableSelector);
        const rows = table.querySelectorAll('tbody tr');
        const totalRows = rows.length;
        const pagination = table.nextElementSibling;

        let currentPage = 1;
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        const renderPage = (page) => {
            const start = (page - 1) * rowsPerPage;
            const end = page * rowsPerPage;

            rows.forEach((row, index) => {
                row.style.display = index >= start && index < end ? '' : 'none';
            });

            pagination.querySelector('.prev-page').disabled = page === 1;
            pagination.querySelector('.next-page').disabled = page === totalPages;
        };

        pagination.querySelector('.prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });

        pagination.querySelector('.next-page').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });

        renderPage(currentPage);
    };

    paginateTable('.stats-creation .stats-table');
    paginateTable('.stats-top .stats-table');
    
});
