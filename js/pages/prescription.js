function changeQuantity(amount) {
    var quantityInput = document.getElementById('quantity');
    var newValue = parseInt(quantityInput.value) + amount;
    if (newValue >= 1) {
        quantityInput.value = newValue;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử HTML cần thao tác
    const addButton = document.querySelector(".add-btn");
    const listDetails = document.querySelector(".list-details");
    const listPrescription = document.querySelector(".list-prescription");
    const medicineAdd = document.querySelector(".medicine-add");
    const titleListPre = document.querySelector(".h-prescription");
    const titleListDetails = document.querySelector(".h-details");

    // Lấy các phần tử cần thiết cho việc thêm thuốc
    const addMedicineBtn = document.querySelector('.add-medicine-btn');
    const medicineSelect = document.getElementById('medicine-select');
    const quantityInput = document.getElementById('quantity');
    const noteInput = document.getElementById('note');
    const detailMedicineList = document.getElementById('detail-medicine-list');

    // Hàm xử lý hiển thị/nội dung khi nhấn add-btn
    function handleAddButtonClick() {
        addButton.style.display = "none"; // Ẩn nút add-btn
        medicineAdd.style.display = "grid"; // Hiển thị phần medicine-add
        listDetails.style.display = "block"; // Hiển thị phần list-details
        titleListDetails.style.display = "block"; // Hiển thị tiêu đề list-details

        // Ẩn phần list-prescription nếu tồn tại
        if (listPrescription && titleListPre) {
            listPrescription.style.display = "none";
            titleListPre.style.display = "none";
        }
    }

    // Lắng nghe sự kiện click vào nút add-btn
    if (addButton) {
        addButton.addEventListener("click", handleAddButtonClick);
    }

    // Hàm thêm thuốc vào bảng chi tiết
    addMedicineBtn.addEventListener('click', function() {
        const medicineName = medicineSelect.options[medicineSelect.selectedIndex].text; // Lấy tên thuốc từ option
        const quantity = quantityInput.value;
        const note = noteInput.value;

        // Kiểm tra nếu có đủ thông tin để thêm
        if (medicineName && quantity && note) {
            // Tạo một dòng mới trong bảng chi tiết
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medicineName}</td>
                <td>${quantity}</td>
                <td>${note}</td>
                <td>
                    <button id="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;

            // Thêm dòng mới vào bảng
            detailMedicineList.appendChild(row);

            // Gắn sự kiện xóa cho nút xóa
            const deleteBtn = row.querySelector('#delete-btn');
            deleteBtn.addEventListener('click', function() {
                row.remove(); // Xóa dòng khi nhấn nút xóa
            });

            // Reset các trường nhập liệu
            quantityInput.value = 1; // Reset số lượng về 1
            noteInput.value = ''; // Xóa nội dung ghi chú
        } else {
            alert("Please fill all the fields!"); // Thông báo nếu thiếu thông tin
        }
    });

    // Hàm xử lý nút xóa trong bảng
    function setupDeleteButtonListeners(tableSelector) {
        const table = document.querySelector(tableSelector);
        if (table) {
            table.addEventListener("click", function (e) {
                const target = e.target.closest("#delete-btn");
                if (target) {
                    const row = target.closest("tr");
                    if (row) {
                        console.log("Deleting row:", row);
                        row.remove();
                    } else {
                        console.error("No row found for delete button:", target);
                    }
                } else {
                    console.log("Clicked outside delete button:", e.target);
                }
            });
        } else {
            console.error("Table not found for selector:", tableSelector);
        }
    }

    // Cài đặt sự kiện cho nút xóa trong bảng bệnh nhân và bảng thuốc
    setupDeleteButtonListeners(".patient-table");
    setupDeleteButtonListeners(".detail-medicine-table");
});
