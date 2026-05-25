# OmniGym - Feature Documentation

---

## Feature: User Registration

### Mục đích

Cho phép người dùng tạo tài khoản mới thông qua quá trình xác thực OTP (Email hoặc Số điện thoại).

### Luồng

1. **Request OTP**: Người dùng gửi Email/SĐT để nhận mã xác thực.
2. **Complete Registration**: Người dùng gửi kèm mã OTP, mật khẩu và thông tin cá nhân để hoàn tất đăng ký.

---

### API

#### 1. POST /auth/request-otp

Yêu cầu gửi mã OTP để đăng ký.

**Request**
- `identifier` (string, required) - Email hoặc Số điện thoại.

**Response**
- **200 - Thành công**: `{ "message": "OTP đã được gửi..." }`
- **400 - Đã tồn tại**: `{ "message": "Email/Số điện thoại đã được đăng ký." }`

---

#### 2. POST /auth/register

Hoàn tất việc tạo tài khoản.

**Request**
- `identifier` (string, required) - Email hoặc Số điện thoại.
- `otp` (string, required) - Mã 6 số đã nhận.
- `password` (string, required) - Mật khẩu đăng ký.
- `personalInfo` (object, optional) - Thông tin chi tiết:
  - `full_name` (string, bắt buộc)
  - `dob` (date string)
  - `gender` (string)
  - `height`, `weight`, `workout_goal`, `medical_history`

**Response**
- **201 - Thành công**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```
- **400 - Lỗi xác thực**: `{ "message": "Invalid or expired OTP" }` hoặc `{ "message": "Email đã được sử dụng." }`

---

### Lưu ý kỹ thuật

- **OTP Storage**: Mã OTP được lưu tạm thời trong bộ nhớ (Memory Store) với thời gian hết hạn là 2 phút.
- **Mật khẩu**: Được hash tự động bằng `bcrypt` với salt rounds là 10.
- **Role mặc định**: Người dùng đăng ký qua API này sẽ có `role_id: 3` (Customer).
- **Validation**: Đã sử dụng `RequestOTPDto` và `CompleteRegistrationDto` để kiểm soát dữ liệu đầu vào.
