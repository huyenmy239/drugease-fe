document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.manage-btn');
    const contents = document.querySelectorAll('.content');
    const lists = document.querySelectorAll('.list-subject, .list-bgr');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));

            contents.forEach(content => {
                content.classList.remove('visible');
                content.classList.add('hidden');
            });
            lists.forEach(list => {
                list.style.display = 'none';
            });

            button.classList.add('active');
            const targetClass = button.classList.contains('subject-btn')
                ? 'add-subject'
                : 'add-background';

            document.querySelector(`.${targetClass}`).classList.add('visible');
            document.querySelector(`.${targetClass}`).classList.remove('hidden');

            const targetList = button.classList.contains('subject-btn')
                ? '.list-subject'
                : '.list-bgr';
            document.querySelector(targetList).style.display = 'block';
        });
    });

    document.querySelector('.subject-btn').click();

    document.querySelectorAll("table tbody tr").forEach((row) => {
        const editBtn = row.querySelector("#edit-btn");
        const deleteBtn = row.querySelector("#delete-btn");
    
        row.addEventListener("click", () => {
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
    
            row.classList.add("selected");
            if (editBtn && deleteBtn) {
                editBtn.disabled = false;
                deleteBtn.disabled = false;
            } else if(deleteBtn){
                deleteBtn.disabled = false;
            }
        });
    
        if (editBtn) {
            editBtn.addEventListener("click", () => {
                const icon = editBtn.querySelector("i");
        
                if (icon.classList.contains("fa-edit")) {
                    enableEditing(row);
                    icon.classList.remove("fa-edit");
                    icon.classList.add("fa-save");
                } else if (icon.classList.contains("fa-save")) {
                    disableEditing(row);
                    icon.classList.remove("fa-save");
                    icon.classList.add("fa-edit");
                    alert("Row updated successfully!");
                }
            });
        }
        
    
        if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
    
                if (confirm("Are you sure you want to delete this row?")) {
                    row.remove();
                    alert("Row deleted successfully!");
                } else {
                    alert("Row deletion cancelled.");
                }
            });
        }
    });
    
    function enableEditing(row) {
        row.querySelectorAll("td").forEach((cell) => {
            if (!cell.querySelector("button")) {
                cell.setAttribute("contenteditable", "true");
                cell.style.backgroundColor = "#f9fff9";
            }
        });
    }
    
    function disableEditing(row) {
        row.querySelectorAll("td").forEach((cell) => {
            if (cell.getAttribute("contenteditable") === "true") {
                cell.setAttribute("contenteditable", "false");
                cell.style.backgroundColor = "";
            }
        });
    }
    

    const paginateTable = (tableSelector) => {
        const table = document.querySelector(tableSelector);
        const rows = table.querySelectorAll('tbody tr');
        const totalRows = rows.length;
        const pagination = table.nextElementSibling;; // Lấy phần tử phân trang tương ứng

        let currentPage = 1;

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

    paginateTable('.list-subject .subject-table');
    paginateTable('.list-bgr .bgr-table');
    
});
