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

            setupSidebarEvents();
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#sidebar-placeholder', '/pages/components/sidebar.html');
});

function setupSidebarEvents() {
    const role = localStorage.getItem('role');

    const menu = document.querySelector('.menu');

    if (!menu) {
        console.error('Menu not found');
        return;
    }

    if (role === 'Admin') {
        const reportItem = document.createElement('li');
        reportItem.innerHTML = `
        <a class="admin-report" href="/pages/admin-report.html">
            <i class="fas fa-flag"> </i>
            Report
        </a>
    `;

        const settingsItem = document.createElement('li');
        settingsItem.innerHTML = `
        <a class="admin-setting" href="/pages/admin-manage.html">
            <i class="fas fa-cogs"> </i>
            Settings
        </a>
    `;

        const logoutItem = document.querySelector(".log-out");

        if (logoutItem) {
            const logoutLi = logoutItem.closest('li');

            menu.insertBefore(reportItem, logoutLi);
            menu.insertBefore(settingsItem, logoutLi);
        }
    } else {
        console.log('User is not an Admin. Report and Settings will not be displayed.');
    }
}
