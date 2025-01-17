function changeQuantity(amount) {
    var quantityInput = document.getElementById('quantity');
    var newValue = parseInt(quantityInput.value) + amount;
    if (newValue >= 1) {
        quantityInput.value = newValue;
    }
}