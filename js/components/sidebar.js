function loadComponent(selector, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const container = document.querySelector(selector);
            container.innerHTML = data;

            document.querySelector('.fa-arrow-right-from-bracket').closest('a').addEventListener('click', function (event) {
                event.preventDefault();
                logout();
            });

            setupSidebarEvents();
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

function logout() {
    localStorage.clear();

    window.location.href = "login.html";
}



document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#sidebar-placeholder', '/pages/components/sidebar.html');
});
