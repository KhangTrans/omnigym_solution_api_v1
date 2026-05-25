# OmniGym - Feature Documentation

---

## Feature: Forgot Password

### Mục đích

Cho phép người dùng khôi phục lại mật khẩu khi bị quên thông qua xác thực mã OTP gửi qua Email.

### Luồng

1. **Initiate Forgot Password**: Người dùng nhập Email để hệ thống kiểm tra và gửi mã OTP khôi phục.
2. **Reset Password**: Người dùng nhập mã OTP nhận được cùng mật khẩu mới để cập nhật lại tài khoản.

---

### API

#### 1. POST /auth/forgot-password

Yêu cầu khôi phục mật khẩu.

**Request**
- `email` (string, required) - Email đã đăng ký trong hệ thống.

**Response**
- **200 - Thành công**: `{ "message": "Mã khôi phục đã được gửi vào email của bạn." }`
- **400 - Lỗi**: `{ "message": "Email không tồn tại trên hệ thống." }`

---

#### 2. POST /auth/reset-password

Xác nhận mã OTP và đặt lại mật khẩu mới.

**Request**
- `email` (string, required)
- `otp` (string, required) - Mã 6 số được gửi qua email.
- `newPassword` (string, required) - Mật khẩu mới muốn thay đổi.

**Response**
- **200 - Thành công**: `{ "message": "Mật khẩu đã được thay đổi thành công." }`
- **400 - Thất bại**: `{ "message": "Mã OTP không chính xác hoặc đã hết hạn." }` hoặc `{ "message": "Người dùng không tồn tại." }`

---

### Lưu ý kỹ thuật

- **OTP Expiration**: Mã OTP khôi phục mật khẩu có hiệu lực trong **15 phút**.
- **Security**: Mật khẩu mới sẽ được mã hóa bằng `bcrypt` (10 rounds) trước khi lưu đè vào database.
- **Service**: Được xử lý bởi các hàm `initiateForgotPassword` và `resetPassword` trong `auth.service.ts`.
- **Email**: Sử dụng `nodemailer` để gửi email với giao diện template chuyên biệt cho khôi phục mật khẩu.
