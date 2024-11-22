## Something is calling...

project/
├── assets/             # Tài nguyên tĩnh (ảnh, font, CSS)
│   ├── images/         # Hình ảnh
│   ├── fonts/          # Font chữ
│   └── styles/         # CSS toàn cục
│       └── main.css
├── js/                 # File JavaScript
│   ├── components/     # Các thành phần giao diện
│   │   ├── header.js
│   │   └── footer.js
│   ├── pages/          # Logic riêng cho từng trang
│   │   ├── home.js
│   │   └── about.js
│   ├── services/       # Gọi API hoặc xử lý dữ liệu
│   │   └── api.js
│   ├── utils/          # Hàm tiện ích (helper functions)
│   │   ├── domUtils.js
│   │   └── formatDate.js
│   └── main.js         # Điểm bắt đầu chính của ứng dụng
├── pages/                  # Chứa các file HTML
│   ├── index.html          # Trang chính (home page)
│   ├── about.html          # Trang About
│   ├── contact.html        # Trang Contact
├── .gitignore          # File để loại trừ khi đẩy lên Git
└── README.md           # Hướng dẫn sử dụng dự án