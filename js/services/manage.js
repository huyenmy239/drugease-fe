import CONFIG from '../utils/settings.js';

// Lấy token từ localStorage hoặc sessionStorage (tuỳ thuộc vào cách bạn lưu trữ token)
const token = localStorage.getItem('token');  // Hoặc sessionStorage.getItem('authToken');

const API_URL = `http://${CONFIG.BASE_URL}/api/rooms/subjects/`; // Thay URL phù hợp với API của bạn

// Tạo header với token
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}` // Thêm token vào header Authorization
};

// Lấy danh sách các subjects từ API
function fetchSubjects() {
    fetch(API_URL, { headers })
        .then(response => response.json())
        .then(data => {
            const subjectList = document.getElementById('subject-list');
            subjectList.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(subject => {
                const row = document.createElement('tr');
                row.dataset.id = subject.id; // Thêm ID vào row để dễ dàng xác định

                row.innerHTML = `
                    <td contenteditable="true" class="subject-name">${subject.name}</td>
                    <td>
                        <button id="delete-btn" class="delete-btn action-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                // Xử lý sự kiện cho các button chỉnh sửa và xóa
                row.querySelector('.delete-btn').addEventListener('click', () => deleteSubject(subject.id));

                subjectList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching subjects:', error));
}

// Lắng nghe sự kiện click vào nút "Add new"
document.querySelector('.add-btn').addEventListener('click', function() {
    const subjectInput = document.querySelector('.subject-input');
    const subjectName = subjectInput.value.trim(); // Lấy giá trị và loại bỏ khoảng trắng thừa

    // Kiểm tra nếu trường nhập subject không trống
    if (subjectName) {
        const subjectData = { name: subjectName };
        addSubject(subjectData); // Gọi hàm addSubject với dữ liệu subject
        subjectInput.value = ''; // Xóa input sau khi thêm thành công
    } else {
        alert('Please enter a subject name'); // Hiển thị thông báo nếu người dùng chưa nhập subject
    }
});

// Thêm subject mới
function addSubject(subjectData) {
    fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(subjectData),
    })
        .then(response => response.json())
        .then(() => fetchSubjects()) // Sau khi thêm thành công, gọi lại fetchSubjects để cập nhật danh sách
        .catch(error => console.error('Error adding subject:', error));
}

// Xóa subject
function deleteSubject(subjectId) {
    fetch(`${API_URL}${subjectId}/`, {
        method: 'DELETE',
        headers,
    })
        .then(response => {
            if (!response.ok) {
                // Nếu phản hồi không thành công, trả về lỗi
                return response.json().then(data => {
                    throw new Error(data.detail || 'Unable to delete subject');
                });
            }
            return;
        })
        .then(() => {
            fetchSubjects(); // Cập nhật lại danh sách sau khi xóa thành công
        })
        .catch(error => {
            // Hiển thị thông báo lỗi cho người dùng
            alert(error.message); // Hoặc có thể hiển thị thông báo lỗi ở đâu đó trong UI
            console.error('Error deleting subject:', error);
        });
}


// Gọi fetchSubjects để hiển thị danh sách subject khi trang được tải
document.addEventListener('DOMContentLoaded', fetchSubjects);

// Ví dụ gọi addSubject để thêm subject mới
// addSubject({ name: 'New Subject', creator: 'Admin' });
