# OmniGym - Feature Documentation

---

## Feature: User Authentication

### Mục đích

Cho phép người dùng đăng ký, đăng nhập và xác thực JWT.

### Luồng

Register → Login → nhận JWT → gắn vào header cho mọi request sau

---

### API

#### POST /auth/register

Tạo tài khoản mới.

Request

- email (string, required)
- password (string, required, tối thiểu 6 ký tự)

Response

- 201 - Tạo thành công

```json
{ "id": "12345", "email": "user@gmail.com" }
```

- 400 - Sai định dạng / thiếu field
- 409 - Email đã tồn tại

Lưu ý

- User mới mặc định inactive, cần verify email trước khi đăng nhập
- Password hash bằng bcrypt trước khi lưu
