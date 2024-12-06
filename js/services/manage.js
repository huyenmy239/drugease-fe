import CONFIG from '../utils/settings.js';

// Lấy token từ localStorage hoặc sessionStorage (tuỳ thuộc vào cách bạn lưu trữ token)
const token = localStorage.getItem('token');  // Hoặc sessionStorage.getItem('authToken');

const SUBJECT_URL = `http://${CONFIG.BASE_URL}/api/rooms/subjects/`; // Thay URL phù hợp với API của bạn

// Tạo header với token
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}` // Thêm token vào header Authorization
};

// Lấy danh sách các subjects từ API
function fetchSubjects() {
    fetch(SUBJECT_URL, { headers })
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
    fetch(SUBJECT_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(subjectData),
    })
        .then(response => response.json())
        .then(() => {
            alert('Added subject successfully');
            fetchSubjects();
        }) // Sau khi thêm thành công, gọi lại fetchSubjects để cập nhật danh sách
        .catch(error => console.error('Error adding subject:', error));
}

// Xóa subject
function deleteSubject(subjectId) {
    fetch(`${SUBJECT_URL}${subjectId}/`, {
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
            alert("Subject is deleted");
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


const BG_URL = `http://${CONFIG.BASE_URL}/api/rooms/backgrounds/`; // Thay URL phù hợp với API của bạn

const addButton = document.querySelector('.add-background');
const backgroundUploadInput = document.querySelector('#background-upload');

// Lấy danh sách các backgrounds từ API
function fetchBackgrounds() {
    fetch(BG_URL, { headers })
        .then(response => response.json())
        .then(data => {
            const bgrTableBody = document.querySelector('.bgr-table tbody');
            bgrTableBody.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(background => {
                const row = document.createElement('tr');
                console.log(background.bg);
                let bg_src = background.bg;
                if (bg_src) {
                    bg_src = bg_src.replace('/media/', '/api/rooms/media/');
                }
                row.dataset.id = background.id; // Gắn ID để dễ dàng xử lý

                row.innerHTML = `
                    <td><img src="${bg_src}" alt="Background ${background.id}" class="bgr-image"></td>
                    <td>${background.bg.split('/').pop()}</td>
                    <td>
                        <button id="delete-btn" class="delete-btn action-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                // Xử lý sự kiện nút xóa
                row.querySelector('.delete-btn').addEventListener('click', () => deleteBackground(background.id));

                bgrTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching backgrounds:', error));
}

// Xóa background
function deleteBackground(backgroundId) {
    fetch(`${BG_URL}${backgroundId}/`, {
        method: 'DELETE',
        headers,
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.detail || 'Unable to delete background');
                });
            }
            alert("Background is deleted");
            return;
        })
        .then(() => {
            fetchBackgrounds(); // Cập nhật danh sách sau khi xóa thành công
        })
        .catch(error => {
            alert(error.message); // Thông báo lỗi nếu không xóa được
            console.error('Error deleting background:', error);
        });
}

function addBackground(backgroundFile) {
    const formData = new FormData();
    formData.append('bg', backgroundFile);

    fetch(BG_URL, {
        method: 'POST',
        headers: {
            // Chỉ cần thêm token nếu có yêu cầu xác thực
            'Authorization': `Token ${token}`,  // Ví dụ với token lưu trong localStorage
        },
        body: formData,  // Gửi dữ liệu với FormData (để gửi file)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.id) {
            fetchBackgrounds(); // Sau khi thêm thành công, gọi lại fetchBackgrounds để cập nhật danh sách
            alert('Added background successfully');
            backgroundUploadInput.value = ''; 
        } else {
            alert('Failed to add background');
        }
    })
    .catch(error => {
        console.error('Error adding background:', error);
        alert('Error adding background');
    });
}

// Sự kiện khi nhấn nút "Add new"
addButton.addEventListener('click', () => {
    const backgroundFile = backgroundUploadInput.files[0]; // Lấy tệp đầu tiên mà người dùng chọn

    if (backgroundFile) {
        addBackground(backgroundFile); // Gọi API thêm background
    } else {
        // alert('Please select a file to upload');
    }
});

// Gọi fetchBackgrounds để hiển thị danh sách khi trang được tải
document.addEventListener('DOMContentLoaded', fetchBackgrounds);
