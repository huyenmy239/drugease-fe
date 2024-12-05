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

    // Lặp qua từng dòng trong bảng
    document.querySelectorAll("table tbody tr").forEach((row) => {
        const editBtn = row.querySelector("#edit-btn");
        const deleteBtn = row.querySelector("#delete-btn");
    
        // Kích hoạt nút Edit và Delete khi click vào dòng
        row.addEventListener("click", () => {
            // Vô hiệu hóa các nút Edit và Delete của các dòng khác
            document.querySelectorAll("table tbody tr").forEach((otherRow) => {
                const otherEditBtn = otherRow.querySelector("#edit-btn");
                const otherDeleteBtn = otherRow.querySelector("#delete-btn");
    
                if (otherRow !== row) {
                    if (otherEditBtn) otherEditBtn.disabled = true;
                    if (otherDeleteBtn) otherDeleteBtn.disabled = true;
                }
            });
    
            document.querySelectorAll("table tbody tr").forEach((r) => {
                r.classList.remove("selected");
            });
    
            // Thêm lớp 'selected' vào dòng hiện tại
            row.classList.add("selected");
            // Kích hoạt nút Edit và Delete của dòng hiện tại
            if (editBtn && deleteBtn) {
                editBtn.disabled = false;
                deleteBtn.disabled = false;
            } else if(deleteBtn){
                deleteBtn.disabled = false;
            }
        });
    
        // Xử lý nút Edit/Save
        if (editBtn) {
            editBtn.addEventListener("click", () => {
                const icon = editBtn.querySelector("i"); // Lấy phần tử <i> chứa icon
        
                if (icon.classList.contains("fa-edit")) { // Nếu icon là "fa-edit" (chỉnh sửa)
                    // Chuyển sang chế độ chỉnh sửa
                    enableEditing(row);
                    icon.classList.remove("fa-edit");
                    icon.classList.add("fa-save"); // Thay icon thành "fa-save"
                } else if (icon.classList.contains("fa-save")) { // Nếu icon là "fa-save" (lưu)
                    // Lưu thông tin và tắt chế độ chỉnh sửa
                    disableEditing(row);
                    icon.classList.remove("fa-save");
                    icon.classList.add("fa-edit"); // Thay icon trở lại thành "fa-edit"
                    alert("Row updated successfully!");
                }
            });
        }
        
    
        // Xử lý nút Delete
        if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Ngăn không cho sự kiện click của dòng được kích hoạt
    
                if (confirm("Are you sure you want to delete this row?")) {
                    row.remove();
                    alert("Row deleted successfully!");
                } else {
                    alert("Row deletion cancelled.");
                }
            });
        }
    });
    
    // Hàm bật chế độ chỉnh sửa
    function enableEditing(row) {
        row.querySelectorAll("td").forEach((cell) => {
            // Cho phép chỉnh sửa các ô, trừ nút Action
            if (!cell.querySelector("button")) {
                cell.setAttribute("contenteditable", "true");
                cell.style.backgroundColor = "#f9fff9"; // Đổi màu nền để dễ nhận biết
            }
        });
    }
    
    // Hàm tắt chế độ chỉnh sửa
    function disableEditing(row) {
        row.querySelectorAll("td").forEach((cell) => {
            if (cell.getAttribute("contenteditable") === "true") {
                cell.setAttribute("contenteditable", "false");
                cell.style.backgroundColor = ""; // Khôi phục màu nền ban đầu
            }
        });
    }
    

    //Ngắt trang
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
