document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.manage-btn');
    const contents = document.querySelectorAll('.content');
    const lists = document.querySelectorAll('.list-subject, .list-bgr'); // Cả 2 danh sách Subject và Background

    // Gắn sự kiện cho các nút
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Xóa trạng thái active khỏi các nút
            buttons.forEach(btn => btn.classList.remove('active'));

            // Ẩn tất cả các phần nội dung và danh sách
            contents.forEach(content => {
                content.classList.remove('visible');
                content.classList.add('hidden');
            });
            lists.forEach(list => {
                list.style.display = 'none';
            });

            // Kích hoạt nút hiện tại và hiển thị nội dung tương ứng
            button.classList.add('active');
            const targetClass = button.classList.contains('subject-btn')
                ? 'add-subject'
                : 'add-background';

            // Hiển thị nội dung tương ứng
            document.querySelector(`.${targetClass}`).classList.add('visible');
            document.querySelector(`.${targetClass}`).classList.remove('hidden');

            // Hiển thị danh sách tương ứng
            const targetList = button.classList.contains('subject-btn')
                ? '.list-subject'
                : '.list-bgr';
            document.querySelector(targetList).style.display = 'block';
        });
    });

    // Thiết lập trạng thái mặc định (focus vào Subject)
    document.querySelector('.subject-btn').click();

    const paginateTable = (tableSelector) => {
        const table = document.querySelector(tableSelector);
        const rows = table.querySelectorAll('tbody tr');
        const totalRows = rows.length;
        const pagination = table.nextElementSibling;; // Lấy phần tử phân trang tương ứng

        let currentPage = 1;

        // Kiểm tra bảng để xác định số dòng trên mỗi trang
        let rowsPerPage;
        if (tableSelector.includes('list-subject')) {
            rowsPerPage = 12; // Số dòng cho list-subject
        } else if (tableSelector.includes('list-bgr')) {
            rowsPerPage = 4;  // Số dòng cho list-bgr
        }

        const totalPages = Math.ceil(totalRows / rowsPerPage); // Tổng số trang

        const renderPage = (page) => {
            const start = (page - 1) * rowsPerPage;
            const end = page * rowsPerPage;

            // Hiển thị và ẩn các hàng theo trang hiện tại
            rows.forEach((row, index) => {
                row.style.display = index >= start && index < end ? '' : 'none';
            });

            // Cập nhật trạng thái của các nút phân trang
            pagination.querySelector('.prev-page').disabled = page === 1;
            pagination.querySelector('.next-page').disabled = page === totalPages;
        };

        // Sự kiện nút Previous
        pagination.querySelector('.prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });

        // Sự kiện nút Next
        pagination.querySelector('.next-page').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });

        // Hiển thị trang đầu tiên khi tải trang
        renderPage(currentPage);
    };

    // Khởi động phân trang cho bảng subject và background
    paginateTable('.list-subject .subject-table');
    paginateTable('.list-bgr .bgr-table');
    
});
