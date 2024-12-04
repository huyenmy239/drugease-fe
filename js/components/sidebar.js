function loadComponent(selector, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#sidebar-placeholder', '/pages/components/sidebar.html');
});

document.addEventListener('DOMContentLoaded', () => {
    const noteLink = document.getElementById("note-link");
    const noteModal = document.querySelector(".note-modal");
    const noteContainer = document.querySelector(".note-container");
    const closeIcon = document.querySelector(".close-icon");
    const overlay = document.querySelector(".overlay");
  
    // Mở modal khi click vào "Note"
    noteLink.addEventListener("click", () => {
      noteModal.style.display = "flex"; // Hiển thị modal
      noteContainer.style.display = "flex"; // Hiển thị note-container
      overlay.style.display = "block"; // Hiển thị overlay
    });
  
    // Đóng modal khi click vào biểu tượng đóng (x)
    closeIcon.addEventListener("click", () => {
      noteModal.style.display = "none";  // Ẩn modal
      overlay.style.display = "none";  // Ẩn overlay
      noteContainer.style.display = "none";
    });
  
    // Đóng modal khi click vào overlay
    overlay.addEventListener("click", () => {
      noteModal.style.display = "none";  // Ẩn modal
      noteContainer.style.display = "none";
      overlay.style.display = "none";  // Ẩn overlay
    });
  });