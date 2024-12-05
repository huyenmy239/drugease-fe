
  document.addEventListener('DOMContentLoaded', () => {
    // Lấy vai trò người dùng từ localStorage hoặc sessionStorage
    const role = localStorage.getItem('role');  // Hoặc có thể lấy từ sessionStorage hoặc API
    console.log(role);

    // Lấy menu
    const menu = document.querySelector('.menu');
    
    // Kiểm tra nếu phần tử menu tồn tại
    if (!menu) {
        console.error('Menu not found');
        return;  // Dừng thực thi nếu menu không tồn tại
    }

    // Nếu vai trò là Admin, thêm các mục "Report" và "Settings" vào menu
    if (role === "Admin") {
        // Tạo phần tử "Report"
        const reportItem = document.createElement('li');
        reportItem.innerHTML = `
            <a class="admin-report" href="/pages/report.html">
                <i class="fas fa-flag"> </i>
                Report
            </a>
        `;
        
        // Tạo phần tử "Settings"
        const settingsItem = document.createElement('li');
        settingsItem.innerHTML = `
            <a class="admin-setting" href="/pages/settings.html">
                <i class="fas fa-cogs"> </i>
                Settings
            </a>
        `;

        // Thêm các phần tử "Report" và "Settings" vào menu
        menu.appendChild(reportItem);
        menu.appendChild(settingsItem);
    }
  });
