function changeQuantity(amount) {
    var quantityInput = document.getElementById('quantity');
    var newValue = parseInt(quantityInput.value) + amount;
    if (newValue >= 1) {
        quantityInput.value = newValue;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Lấy các phần tử HTML cần thao tác
    const addButton = document.querySelector(".add-btn");
    const listDetails = document.querySelector(".list-details");
    const listPrescription = document.querySelector(".list-prescription");
    const medicineAdd = document.querySelector(".medicine-add");
    const titleListPre = document.querySelector(".h-prescription");
    const titleListDetails = document.querySelector(".h-details");

    // Lắng nghe sự kiện click vào nút add-btn
    addButton.addEventListener("click", function() {
        // Ẩn nút add-btn
        addButton.style.display = "none";
        // Hiển thị phần medicine-add
        medicineAdd.style.display = "grid";
        // Hiển thị phần list-details
        listDetails.style.display = "block";
        titleListDetails.style.display = "block";
        // Ẩn phần list-prescription
        if (listPrescription && titleListPre) {
            listPrescription.style.display = "none";
            titleListPre.style.display = "none";
        }

    });
});
