const openModal = document.getElementById('add-btn');
const closeModal = document.getElementById('closeModal');
const closeEditModal = document.getElementById('closeEditModal');
const modal = document.getElementById('createModal');
const editModal = document.getElementById('editModal');
const overlay = document.getElementById('overlay');

openModal.addEventListener('click', () => {
    modal.style.display = 'block';
    overlay.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});

closeEditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    modal.style.display = 'none';
    editModal.style.display = 'none';
    overlay.style.display = 'none';
});