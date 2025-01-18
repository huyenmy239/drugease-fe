function changeQuantity(amount) {
    var quantityInput = document.getElementById('quantity');
    var newValue = parseInt(quantityInput.value) + amount;
    if (newValue >= 1) {
        quantityInput.value = newValue;
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const addMedicineBtn = document.querySelector('.add-medicine-btn');
    const medicineSelect = document.getElementById('medicine-select');
    const quantityInput = document.getElementById('quantity');
    const noteInput = document.getElementById('note');
    const detailMedicineList = document.getElementById('detail-medicine-list');


    addMedicineBtn.addEventListener('click', function() {
        const medicineName = medicineSelect.options[medicineSelect.selectedIndex].text;
        const medicineId = medicineSelect.options[medicineSelect.selectedIndex].value;
        const quantity = quantityInput.value;
        const note = noteInput.value;

        if (medicineName && quantity && note) {
            let exists = false;
    
            detailMedicineList.querySelectorAll('tr').forEach(function (row) {
                const existingMedicineName = row.cells[0]?.textContent.trim();
                if (existingMedicineName === medicineName) {
                    exists = true;
                }
            });
    
            if (exists) {
                alert('This medicine already exists in the list!');
                quantityInput.value = 1;
                noteInput.value = '';
                return;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="${medicineId}">${medicineName}</td>
                <td>${quantity}</td>
                <td>${note}</td>
                <td>
                    <button id="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;

            detailMedicineList.appendChild(row);

            const deleteBtn = row.querySelector('#delete-btn');
            deleteBtn.addEventListener('click', function() {
                row.remove();
            });

            quantityInput.value = 1;
            noteInput.value = '';
        } else {
            alert("Please fill all the fields!");
        }
    });

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

    // setupDeleteButtonListeners(".patient-table");
    setupDeleteButtonListeners(".detail-medicine-table");
});
