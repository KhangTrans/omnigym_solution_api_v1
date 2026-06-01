# OmniGym - Feature Documentation

---

## Feature: Trainer Application

### Mục đích

Cho phép người dùng đăng ký trở thành Trainer bằng cách lưu nháp hồ sơ, gửi đơn chính thức, và chờ Admin/Staff duyệt.

Hệ thống tách rõ:

- `trainer_applications`: đơn đăng ký / hồ sơ apply.
- `trainers`: hồ sơ Trainer chính thức sau khi được duyệt.
- `trainer_application_certificates`: chứng chỉ nằm trong đơn apply.
- `trainer_certificates`: chứng chỉ chính thức sau khi duyệt.

---

### Luồng

Register Trainer → Save draft nếu cần → Submit application → Application `pending` → Staff/Admin approve hoặc reject → Nếu approve mới tạo Trainer chính thức

---

### Nguyên tắc nghiệp vụ

- Register role Trainer **không tự tạo** `trainer_application`.
- `trainer_application` chỉ được tạo khi user bấm **Save draft** hoặc **Submit**.
- Save draft chỉ lưu nháp, không tạo record trong bảng `trainers`.
- Submit chuyển application sang `pending`, không tạo record trong bảng `trainers`.
- Chỉ khi Staff/Admin approve thì hệ thống mới tạo hoặc cập nhật record trong bảng `trainers`.
- `trainers.application_id` trỏ về application đã được duyệt để biết Trainer được sinh ra từ đơn nào.

---

### Trạng thái đơn

Bảng: `trainer_applications`

Field: `status`

| Status | Ý nghĩa | Có được save draft không? | Có được submit không? |
|---|---|---|---|
| `draft` | Hồ sơ đang lưu nháp, chưa gửi | Có | Có |
| `pending` | Đã gửi, đang chờ duyệt | Không | Không |
| `approved` | Đã được duyệt | Không | Không |
| `rejected` | Bị từ chối | Có | Có |

---

### Database

#### `trainer_applications`

Lưu thông tin hồ sơ apply Trainer.

Fields chính:

- `user_id`
- `bio`
- `specialization`
- `avatar_url`
- `phone_number`
- `address`
- `years_experience`
- `hourly_rate`
- `identity_number`
- `identity_image_url`
- `status`
- `submitted_at`
- `reviewed_at`
- `reviewed_by`
- `rejection_reason`

#### `trainer_application_certificates`

Lưu chứng chỉ user gửi kèm application.

Fields chính:

- `application_id`
- `cert_name`
- `issued_by`
- `certificate_number`
- `image_url`
- `issued_at`
- `expires_at`
- `status`
- `verified_at`
- `verified_by`
- `rejection_reason`

#### `trainers`

Lưu hồ sơ Trainer chính thức.

Record trong bảng này chỉ được tạo/cập nhật khi application được approve.

Fields liên quan:

- `user_id`
- `application_id`
- `bio`
- `specialization`
- `avatar_url`
- `phone_number`
- `address`
- `years_experience`
- `hourly_rate`
- `is_active`
- `approved_at`
- `approved_by`

---

### API

#### POST `/trainer-applications/draft`

Lưu nháp hồ sơ đăng ký Trainer.

Request

Tất cả field đều optional vì đây là lưu nháp.

- `bio` (string, optional)
- `specialization` (string, optional)
- `avatar_url` (string, optional)
- `phone_number` (string, optional)
- `address` (string, optional)
- `years_experience` (number, optional)
- `hourly_rate` (number, optional)
- `identity_number` (string, optional)
- `identity_image_url` (string, optional)
- `certificates` (array, optional)

Mỗi item trong `certificates`:

- `cert_name` (string, optional)
- `issued_by` (string, optional)
- `certificate_number` (string, optional)
- `image_url` (string, optional)
- `issued_at` (string/date, optional)
- `expires_at` (string/date, optional)

Example request

```json
{
  "bio": "Tôi đang điền hồ sơ trainer.",
  "specialization": "Yoga",
  "phone_number": "0909123456",
  "certificates": []
}
```

Response

- `200` - Lưu nháp thành công

```json
{
  "message": "Lưu nháp hồ sơ Trainer thành công.",
  "data": {
    "id": 12,
    "user_id": 35,
    "status": "draft",
    "certificates": []
  }
}
```

Error responses

- `400` - Đơn đang chờ duyệt nên không được lưu nháp

```json
{ "message": "Đơn đăng ký Trainer của bạn đang chờ duyệt, không thể lưu nháp." }
```

- `400` - Tài khoản Trainer đã được duyệt

```json
{ "message": "Tài khoản Trainer của bạn đã được duyệt." }
```

Lưu ý

- Save draft không validate đủ field bắt buộc.
- Save draft không tạo record trong bảng `trainers`.
- Field nào không gửi lên sẽ không ghi đè field cũ.
- Nếu request có `certificates`, backend xem đó là danh sách chứng chỉ hiện tại của form và sẽ thay bộ certificates draft cũ bằng danh sách mới.

---

#### POST `/trainer-applications`

Gửi hoặc gửi lại hồ sơ đăng ký làm Trainer.

Request

- `bio` (string, optional)
- `specialization` (string, required)
- `avatar_url` (string, required)
- `phone_number` (string, required)
- `address` (string, required)
- `years_experience` (number, optional)
- `hourly_rate` (number, optional)
- `identity_number` (string, required)
- `identity_image_url` (string, required)
- `certificates` (array, required)

Mỗi item trong `certificates`:

- `cert_name` (string, required)
- `issued_by` (string, required)
- `certificate_number` (string, required)
- `image_url` (string, required)
- `issued_at` (string/date, optional)
- `expires_at` (string/date, required)

Example request

```json
{
  "bio": "Tôi có 3 năm kinh nghiệm huấn luyện cá nhân.",
  "specialization": "Strength training, Weight loss",
  "avatar_url": "https://example.com/avatar.jpg",
  "phone_number": "0909123456",
  "address": "Quận 1, TP.HCM",
  "years_experience": 3,
  "hourly_rate": 300000,
  "identity_number": "079123456789",
  "identity_image_url": "https://example.com/identity.jpg",
  "certificates": [
    {
      "cert_name": "NASM-CPT",
      "issued_by": "NASM",
      "certificate_number": "CERT-001",
      "image_url": "https://example.com/cert.jpg",
      "issued_at": "2022-01-01",
      "expires_at": "2027-01-01"
    }
  ]
}
```

Response

- `201` - Gửi đơn thành công

```json
{
  "message": "Nộp đơn đăng ký Trainer thành công.",
  "data": {
    "id": 12,
    "user_id": 35,
    "status": "pending",
    "submitted_at": "2026-06-01T14:15:03.000Z",
    "certificates": [
      {
        "id": 20,
        "application_id": 12,
        "cert_name": "NASM-CPT",
        "status": "pending"
      }
    ]
  }
}
```

Error responses

- `400` - Thiếu thông tin hồ sơ

```json
{ "message": "Vui lòng nhập đầy đủ thông tin hồ sơ Trainer." }
```

- `400` - Thiếu thông tin định danh

```json
{ "message": "Vui lòng nhập đầy đủ thông tin định danh." }
```

- `400` - Chưa có chứng chỉ

```json
{ "message": "Vui lòng thêm ít nhất một chứng chỉ." }
```

- `400` - Đơn đang chờ duyệt

```json
{ "message": "Đơn đăng ký Trainer của bạn đang chờ duyệt." }
```

- `400` - Tài khoản Trainer đã được duyệt

```json
{ "message": "Tài khoản Trainer của bạn đã được duyệt." }
```

---

#### GET `/trainer-applications/me`

Lấy application mới nhất của user đang đăng nhập.

Request

- Không cần body.
- User phải đăng nhập bằng session.

Response

- `200` - Có application

```json
{
  "data": {
    "id": 12,
    "user_id": 35,
    "status": "pending",
    "submitted_at": "2026-06-01T14:15:03.000Z",
    "rejection_reason": null,
    "certificates": [
      {
        "id": 20,
        "cert_name": "NASM-CPT",
        "status": "pending"
      }
    ]
  }
}
```

- `200` - Chưa có application

```json
{ "data": null }
```

---

### Backend logic

#### Save draft

1. Lấy `userId` từ session.
2. Tìm application mới nhất của user.
3. Nếu `status = pending`, chặn lưu nháp.
4. Nếu `status = approved`, chặn lưu nháp.
5. Nếu chưa có application, tạo mới với `status = draft`.
6. Nếu có application `draft` hoặc `rejected`, update application đó.
7. Chỉ update những field được gửi trong request, không ghi đè field thiếu.
8. Nếu request có `certificates`, xóa certificates cũ của application và insert danh sách mới.
9. Return application kèm certificates.

#### Submit application

1. Lấy `userId` từ session.
2. Validate request body đầy đủ.
3. Tìm application mới nhất của user.
4. Nếu `status = pending`, chặn submit lại.
5. Nếu `status = approved`, chặn submit lại.
6. Nếu chưa có application, tạo mới.
7. Nếu `status = draft` hoặc `rejected`, update application cũ.
8. Set `status = pending`.
9. Set `submitted_at = now`.
10. Clear `rejection_reason`, `reviewed_at`, `reviewed_by`.
11. Xóa certificates cũ của application.
12. Insert certificates mới.
13. Không tạo record trong bảng `trainers`.
14. Return application kèm certificates.

#### Approve application

1. Staff/Admin chọn application `pending`.
2. Backend tìm application kèm certificates.
3. Nếu application không tồn tại hoặc không phải `pending`, chặn approve.
4. Tạo hoặc cập nhật record trong bảng `trainers`.
5. Copy thông tin hồ sơ từ application sang trainer.
6. Set `trainers.is_active = true`.
7. Set `approved_at`, `approved_by`.
8. Copy certificates từ `trainer_application_certificates` sang `trainer_certificates`.
9. Set application `status = approved`.
10. Set user `status = active` và role Trainer nếu cần.

---

### Chống double submit

Backend chống double submit bằng rule:

```txt
Nếu application.status = pending thì không cho submit lại.
```

Nếu user bấm submit 2 lần:

```txt
Request đầu tiên chuyển status sang pending
Request thứ hai bị chặn
```

Không tạo thêm row mới trong:

- `trainer_applications`
- `trainer_application_certificates`
- `trainers`

---

### Frontend behavior

Frontend `/trainer-join` render theo API `GET /trainer-applications/me`:

| API result | UI |
|---|---|
| `null` | Hiển thị form apply trống |
| `draft` | Hiển thị form apply với dữ liệu draft |
| `pending` | Hiển thị khung chờ duyệt |
| `rejected` | Hiển thị lý do từ chối + form gửi lại |
| `approved` | Hiển thị trạng thái đã duyệt / chuyển dashboard |

Frontend actions:

| Action | API |
|---|---|
| Save draft | `POST /trainer-applications/draft` |
| Submit | `POST /trainer-applications` |
| Get current application | `GET /trainer-applications/me` |

Frontend implementation hiện tại (`omnigym-solution-web`):

- Trang `TrainerJoin` đã có nút `Save draft` riêng.
- Nút `Save draft` gọi `trainerApplicationAPI.saveDraft(...)`.
- Nút `Submit application` gọi `trainerApplicationAPI.submit(...)`.
- Khi load trang, frontend gọi `GET /trainer-applications/me` để prefill form nếu application đang ở trạng thái `draft` hoặc `rejected`.
- Sau khi save draft thành công, frontend cập nhật lại `application` từ response backend để giữ trạng thái `draft` mới nhất.
- Đã bỏ style hover tím ở các nút action chính của màn hình này và ở component upload ảnh để tránh lệch UI.

Sau khi submit thành công:

```txt
Không redirect homepage
Không render form nữa
Hiển thị khung chờ duyệt
```

---

### Tổng kết flow

```txt
Register Trainer
        ↓
users.status = inactive
Không tạo trainer_application
Không tạo trainers
        ↓
Trainer bấm Save draft
        ↓
trainer_applications.status = draft
Không tạo trainers
        ↓
Trainer submit hồ sơ
        ↓
trainer_applications.status = pending
Không tạo trainers
Hiển thị khung chờ duyệt
        ↓
Admin/Staff reject
        ↓
trainer_applications.status = rejected
Trainer được sửa và gửi lại
        ↓
Hoặc Admin/Staff approve
        ↓
trainer_applications.status = approved
Tạo/cập nhật trainers
trainers.is_active = true
users.status = active
trainer_certificates được tạo
```

---

### Notes cần xử lý sau

#### 1. Certificates trong Save draft

Hiện tại nếu request save draft có field `certificates`, backend sẽ xóa bộ certificates cũ của application và insert lại theo danh sách mới.

Điều này đúng nếu frontend luôn gửi full list certificates hiện tại trong form.

Nếu sau này frontend chỉ gửi partial update, cần đổi logic sang update từng certificate theo `id` để tránh mất certificate cũ.

#### 2. Certificate renewal sau khi Trainer đã được duyệt

Sau khi Trainer hoạt động, không nên cập nhật trực tiếp vào `trainer_certificates` khi Trainer bổ sung/gia hạn chứng chỉ.

Nên thêm module riêng, ví dụ:

```txt
trainer_certificate_requests
```

Dùng cho:

- Trainer thêm certificate mới.
- Trainer gia hạn certificate sắp hết hạn.
- Staff/Admin duyệt hoặc từ chối cập nhật.
- Certificate gốc đã được duyệt không bị xóa cứng.
- Pending request không ảnh hưởng công việc hiện tại của Trainer.
