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
