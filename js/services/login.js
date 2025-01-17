import CONFIG from '../utils/settings.js';

const API_BASE_URL = `http://${CONFIG.BASE_URL}/api/accounts/accounts`;

const routes = {
    admin: [
        { path: '/pages/home.html', component: 'AdminDashboard' },
    ],
    doctor: [
        { path: '/pages/home.html', component: 'UserDashboard' },
    ],
    staff: [
        { path: '/pages/home.html', component: 'LoginPage' },
    ],
    pharmacist: [
        { path: '/pages/home.html', component: 'LoginPage' },
    ]
};

function navigateToRoleBasedRoute(role) {
    const userRoutes = routes[role];
    if (!userRoutes) {
        console.error('Role not found, redirecting to login');
        window.location.href = '/login';
        return;
    }

    const defaultRoute = userRoutes[0];
    window.location.href = defaultRoute.path;
}


async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Login successful! Role: ${data.role}`);
            alert('Đăng nhập thành công!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            localStorage.setItem('employee_id', data.employee_id);

            navigateToRoleBasedRoute(data.role);
            // window.location.href = "home.html";
        } else {
            console.log(`Error: ${JSON.stringify(data)}`);
            alert('Đăng nhập thất bại: ' + data.error);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
}

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    login();
});