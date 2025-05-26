# Drugease Frontend - Hệ Thống Quản Lý Đơn Thuốc

Drugease Frontend là một ứng dụng web giao diện người dùng giúp tương tác với hệ thống Drugease backend, giúp bác sĩ, dược sĩ và nhân viên y tế dễ dàng quản lý đơn thuốc, bệnh nhân, kho thuốc, và các chức năng liên quan.

## Mô Tả Đề Tài

Drugease Frontend cung cấp một giao diện trực quan, dễ sử dụng để người dùng tương tác với hệ thống Drugease. Giao diện giúp bác sĩ, dược sĩ và nhân viên y tế có thể quản lý đơn thuốc, theo dõi tình trạng bệnh nhân và kho thuốc, thực hiện các thao tác như tạo, sửa, xóa đơn thuốc và kiểm tra báo cáo.

## Các Tính Năng Chính

### 1. Đăng Nhập và Quản Lý Tài Khoản
- **Đăng Nhập/Đăng Xuất:** Giao diện cho phép bác sĩ, dược sĩ và nhân viên y tế đăng nhập vào hệ thống.
- **Quản Lý Tài Khoản:** Hiển thị và cho phép người dùng chỉnh sửa thông tin cá nhân.

### 2. Kê Đơn Thuốc
- **Kê Đơn:** Giao diện cho phép bác sĩ tạo đơn thuốc cho bệnh nhân.
- **Lưu và Cập Nhật:** Cho phép lưu lại đơn thuốc và cập nhật nếu có sự thay đổi.

### 3. Quản Lý Đơn Thuốc
- **Danh Sách Đơn Thuốc:** Hiển thị danh sách đơn thuốc của bệnh nhân và các thao tác trên từng đơn.
- **Chi Tiết Đơn Thuốc:** Hiển thị chi tiết đơn thuốc, thông tin thuốc, hướng dẫn sử dụng.

### 4. Quản Lý Kho Thuốc
- **Cập Nhật Tình Trạng Thuốc:** Hiển thị tình trạng kho thuốc, số lượng thuốc còn lại và các thao tác quản lý kho.
- **Nhập/Xuất Thuốc:** Theo dõi việc nhập và xuất thuốc từ kho.

### 5. Quản Lý Bệnh Nhân
- **Thông Tin Bệnh Nhân:** Hiển thị thông tin bệnh nhân và lịch sử đơn thuốc của họ.
- **Lịch Sử Đơn Thuốc:** Xem lịch sử đơn thuốc của bệnh nhân, bao gồm các đơn thuốc trước đó.

### 6. Báo Cáo và Thống Kê
- **Báo Cáo Đơn Thuốc:** Hiển thị các báo cáo thống kê về đơn thuốc, loại thuốc và tình trạng sử dụng.

## Công Nghệ Sử Dụng

- **Frontend:** JavaScript
- **UI Library:** Bootstrap
- **Backend Communication:** Fetch (HTTP Requests)
- **Bảo Mật:** Mã hóa dữ liệu và bảo vệ API với token.


## Cài đặt

### 1. Cấu hình API URL

- **Backend Link:** [Drugease Backend](https://github.com/huyenmy239/drugease-be)

### 2. Chạy Ứng Dụng

Khởi động server phát triển frontend bằng Live Server. Rồi truy cập ứng dụng qua trình duyệt tại `http://localhost:5500`.

## Cấu Trúc Dự Án

### 1. **assets/**
Thư mục này chứa tất cả các tài nguyên tĩnh như hình ảnh, phông chữ, và các kiểu dáng CSS toàn cục.

- **images/**:  Lưu trữ các tệp hình ảnh sử dụng trong toàn bộ ứng dụng.
- **fonts/**: Lưu trữ các tệp phông chữ tùy chỉnh sử dụng cho nền tảng.
- **styles/**: Chứa các tệp CSS toàn cục. Tệp CSS chính là `main.css`.

### 2. **js/**
Thư mục này chứa tất cả các tệp JavaScript cần thiết cho chức năng của frontend.

- **components/**: Các thành phần UI tái sử dụng được sử dụng ở các trang khác nhau (ví dụ: `header.js`, `footer.js`).
- **pages/**: Chứa logic cụ thể cho từng trang (ví dụ: `home.js`, `about.js`).
- **services/**: Bao gồm các dịch vụ để tương tác với API và xử lý dữ liệu (ví dụ: `api.js`).
- **utils/**: Các hàm trợ giúp để hỗ trợ các hoạt động khác nhau (ví dụ: `domUtils.js`, formatDate.js).
- **main.js**: Đây là tệp JavaScript chính để khởi tạo và cấu hình ứng dụng.

### 3. **pages/**
Thư mục này chứa các tệp HTML cho các trang khác nhau trong ứng dụng web.

## Các Thành Viên Thực Hiện

| Thành Viên                  | Tính Năng Được Giao                                                         | Tài Khoản GitHub                  | Avatar                                |
|------------------------------|----------------------------------------------------------------------------|-----------------------------------|---------------------------------------|
| **Nguyễn Thị Thanh Huyến**   | Thiết kế giao diện trang web bằng Figma và các component UI cho báo cáo, thống kê và giao diện người dùng. | [zethro](https://github.com/zethro) | <img src="https://avatars.githubusercontent.com/zethro" width="50" height="50" /> |
| **Nguyễn Thị Huyền My**      | Xây dựng giao diện người dùng cho các tính năng quản lý đơn thuốc, kho thuốc, bệnh nhân. | [huyenmy239](https://github.com/huyenmy239) | <img src="https://avatars.githubusercontent.com/huyenmy239" width="50" height="50" /> |



## Kết Luận

Hệ thống Drugease Frontend sẽ cung cấp một giao diện người dùng thân thiện và dễ sử dụng, giúp bác sĩ, dược sĩ và nhân viên y tế có thể quản lý các công việc hàng ngày liên quan đến đơn thuốc, kho thuốc và bệnh nhân hiệu quả hơn, từ đó cải thiện chất lượng chăm sóc bệnh nhân và giảm thiểu sai sót.
