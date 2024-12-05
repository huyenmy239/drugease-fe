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

          // Gắn lại sự kiện sau khi nội dung được tải vào
          setupSidebarEvents();  // Hàm này sẽ chứa mã để gắn lại các sự kiện trong sidebar
      })
      .catch(error => {
          console.error('Error loading component:', error);
      });
}

document.addEventListener('DOMContentLoaded', () => {
// Load sidebar component
  loadComponent('#sidebar-placeholder', '/pages/components/sidebar.html');
});

// Hàm setup sự kiện trong sidebar
function setupSidebarEvents() {
  const role = localStorage.getItem('role');  // Hoặc có thể lấy từ sessionStorage hoặc API

  // Lấy menu
  const menu = document.querySelector('.menu');
    
  // Kiểm tra nếu phần tử menu tồn tại
  if (!menu) {
      console.error('Menu not found');
      return;  // Dừng thực thi nếu menu không tồn tại
  }

  // Tạo phần tử "Report"
  const reportItem = document.createElement('li');
  reportItem.innerHTML = `
      <a class="admin-report" href="/pages/admin-report.html">
          <i class="fas fa-flag"> </i>
          Report
      </a>
  `;

  // Tạo phần tử "Settings"
  const settingsItem = document.createElement('li');
  settingsItem.innerHTML = `
      <a class="admin-setting" href="/pages/admin-manage.html">
          <i class="fas fa-cogs"> </i>
          Settings
      </a>
  `;

  // Tìm thẻ "Log out"
  const logoutItem = document.querySelector(".log-out");

  // Kiểm tra nếu "Log out" tồn tại
  if (logoutItem) {
      // Lấy phần tử li chứa "Log out"
      const logoutLi = logoutItem.closest('li');

      // Chèn "Report" và "Settings" trước "Log out"
      menu.insertBefore(reportItem, logoutLi);
      menu.insertBefore(settingsItem, logoutLi);
  }
}
