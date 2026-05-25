# OmniGym - Feature Documentation

---

## Feature: User Authentication

### Mục đích

Cho phép người dùng đăng ký, đăng nhập và quản lý phiên làm việc thông qua Session/Cookie.

### Luồng

Request OTP → Complete Registration → Login → Lưu Session → Sử dụng cho các request sau

---

### API

#### POST /auth/login

Đăng nhập vào hệ thống.

**Request**

- `identifier` (string, required) - Email hoặc Số điện thoại.
- `password` (string, required)

**Response**

- **200 - Đăng nhập thành công**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone_number": "0123456789",
    "full_name": "Nguyễn Văn A",
    "avatar_url": null,
    "role": "Customer"
  }
}
```

- **401 - Sai thông tin đăng nhập**
  - Thông báo: "User not found" hoặc "Invalid password".

- **500 - Lỗi hệ thống**

**Lưu ý**

- Dữ liệu được xác thực dựa trên `identifier` (tự động nhận diện Email hoặc Số điện thoại).
- Mật khẩu được kiểm tra bằng `bcrypt.compare`.
- Sau khi đăng nhập thành công, thông tin người dùng được lưu vào `req.session.user`.
- Cookie `connect.sid` sẽ được gửi kèm về Client để duy trì phiên đăng nhập.
