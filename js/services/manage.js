import CONFIG from '../utils/settings.js';

const token = localStorage.getItem('token');  // Hoặc sessionStorage.getItem('authToken');

const SUBJECT_URL = `http://${CONFIG.BASE_URL}/api/rooms/subjects/`; // Thay URL phù hợp với API của bạn

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}` // Thêm token vào header Authorization
};

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

                row.querySelector('.delete-btn').addEventListener('click', () => deleteSubject(subject.id));

                subjectList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching subjects:', error));
}

document.querySelector('.add-btn').addEventListener('click', function() {
    const subjectInput = document.querySelector('.subject-input');
    const subjectName = subjectInput.value.trim();

    if (subjectName) {
        const subjectData = { name: subjectName };
        addSubject(subjectData);
        subjectInput.value = '';
    } else {
        alert('Please enter a subject name');
    }
});

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
        })
        .catch(error => console.error('Error adding subject:', error));
}

function deleteSubject(subjectId) {
    fetch(`${SUBJECT_URL}${subjectId}/`, {
        method: 'DELETE',
        headers,
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.detail || 'Unable to delete subject');
                });
            }
            alert("Subject is deleted");
            return;
        })
        .then(() => {
            fetchSubjects();
        })
        .catch(error => {
            alert(error.message);
            console.error('Error deleting subject:', error);
        });
}


document.addEventListener('DOMContentLoaded', fetchSubjects);


const BG_URL = `http://${CONFIG.BASE_URL}/api/rooms/backgrounds/`;

const addButton = document.querySelector('.add-background');
const backgroundUploadInput = document.querySelector('#background-upload');

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

                row.querySelector('.delete-btn').addEventListener('click', () => deleteBackground(background.id));

                bgrTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching backgrounds:', error));
}

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
            fetchBackgrounds();
        })
        .catch(error => {
            alert(error.message);
            console.error('Error deleting background:', error);
        });
}

function addBackground(backgroundFile) {
    const formData = new FormData();
    formData.append('bg', backgroundFile);

    fetch(BG_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.id) {
            fetchBackgrounds();
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

addButton.addEventListener('click', () => {
    const backgroundFile = backgroundUploadInput.files[0];

    if (backgroundFile) {
        addBackground(backgroundFile);
    } else {
    }
});

document.addEventListener('DOMContentLoaded', fetchBackgrounds);
