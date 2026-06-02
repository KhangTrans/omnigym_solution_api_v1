# OmniGym - Feature Documentation

---

## Feature: Add Branch (Thêm chi nhánh mới) - UC-90

### Mục đích

Cho phép quản trị viên (Admin/Partner) thêm mới một chi nhánh phòng tập (Branch) vào hệ thống OmniGym để hiển thị cho khách hàng tìm kiếm và đặt lịch tập.

---

### UC-90 Add Branch Specification

| Trường | Nội dung đặc tả |
| :--- | :--- |
| **UC ID and Name** | UC-90 Add Branch |
| **Created By** | khangtdce181439 |
| **Date Created** | 25-05-2026 |
| **Primary Actor** | Admin / Partner |
| **Secondary Actors** | none |
| **Description** | Cho phép Admin hoặc Đối tác (Partner) thêm mới một chi nhánh phòng tập vào hệ thống OmniGym với các thông tin chi tiết bao gồm địa chỉ, khu vực tỉnh/thành, quận/huyện, hotline, hình ảnh và danh sách tiện ích. |
| **Trigger** | Admin/Partner chọn chức năng "Quản lý chi nhánh" và nhấn nút "Thêm chi nhánh". |
| **Preconditions** | Admin/Partner đã đăng nhập thành công vào trang quản trị và có quyền thêm chi nhánh. |
| **Postconditions** | Chi nhánh mới cùng các hình ảnh và tiện ích đi kèm được tạo thành công trong cơ sở dữ liệu và hiển thị trên hệ thống. |
| **Normal Flow** | 1. Admin/Partner chọn nút "Thêm chi nhánh".<br>2. Giao diện hiển thị form thông tin chi nhánh.<br>3. Admin/Partner nhập các trường dữ liệu: Tên chi nhánh, Đối tác sở hữu (partner_id), Địa chỉ, Tỉnh/Thành phố, Quận/Huyện, Hotline, Giờ hoạt động, Ảnh bìa, Danh sách ảnh chi nhánh và các tiện ích.<br>4. Admin/Partner nhấp nút "Lưu".<br>5. Hệ thống xác thực tính hợp lệ của dữ liệu đầu vào.<br>6. Hệ thống lưu chi nhánh mới, lưu danh sách hình ảnh (nếu có) và danh sách tiện ích (nếu có) vào cơ sở dữ liệu.<br>7. Hệ thống hiển thị thông báo thành công và quay lại trang danh sách chi nhánh. |
| **Alternative Flows** | **Alt 1: Hủy bỏ thao tác**<br>1. Admin/Partner nhấn nút "Hủy".<br>2. Hệ thống đóng form, không lưu dữ liệu và quay lại trang danh sách chi nhánh. |
| **Exceptions** | **Exc 1: Thiếu thông tin bắt buộc hoặc định dạng không hợp lệ**<br>1. Tại bước 5, hệ thống phát hiện các trường thông tin bắt buộc (như tên chi nhánh, địa chỉ, tỉnh/thành, quận/huyện, partner_id) bị để trống.<br>2. Hệ thống báo lỗi tương ứng bên dưới từng ô nhập liệu.<br><br>**Exc 2: Tên chi nhánh đã tồn tại**<br>1. Tại bước 5, hệ thống kiểm tra và phát hiện tên chi nhánh bị trùng lặp.<br>2. Hệ thống cảnh báo "Tên chi nhánh đã tồn tại" và không lưu dữ liệu. |
| **Priority** | High (Cao) |
| **Frequency of Use** | Low (Thấp) |
| **Business Rules** | - Tên chi nhánh và Địa chỉ của chi nhánh phải là duy nhất trên toàn hệ thống.<br>- Ảnh tải lên phải đúng định dạng hỗ trợ (PNG, JPG, JPEG) và không vượt quá 5MB.<br>- `partner_id` phải tương ứng với một đối tác hợp lệ trong hệ thống. |
| **Other Information** | Các tiện ích và hình ảnh đi kèm sẽ được hiển thị trên trang chi tiết chi nhánh để người dùng tham khảo. |
| **Assumptions** | Không có. |

---

### UI Design (Thông tin trường dữ liệu nhập vào)

| Field Name | Field Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `partner_id` | Number (Dropdown/Select) | Yes | ID của đối tác sở hữu chi nhánh này. |
| `branch_name` | Text Input | Yes | Tên của chi nhánh mới (ví dụ: OmniGym Quận 1). |
| `address` | Text Input | Yes | Địa chỉ chi tiết của chi nhánh (số nhà, tên đường, phường/xã). |
| `province` | Text Input (Select) | Yes | Tỉnh/Thành phố nơi chi nhánh tọa lạc. |
| `district` | Text Input (Select) | Yes | Quận/Huyện nơi chi nhánh tọa lạc. |
| `hotline` | Text Input | No | Số điện thoại liên hệ trực tiếp của chi nhánh. |
| `opening_house` | Text Input | No | Giờ mở cửa và đóng cửa của chi nhánh (ví dụ: 05:00 - 22:00). |
| `image_url` | Text Input / File | No | Đường dẫn ảnh đại diện chính của chi nhánh. |
| `images` | Array (File Upload) | No | Danh sách các ảnh chi tiết của chi nhánh, mỗi ảnh gồm `image_url`, `is_cover`, `sort_order`. |
| `facilities` | Array (Select/Checkbox) | No | Danh sách các tiện ích tại chi nhánh, mỗi tiện ích gồm `facility_name`, `description`, `icon_url`. |

---

### API Specification

#### POST `/branches`

Tạo mới một chi nhánh.

**Request Body**

```json
{
  "partner_id": 1,
  "branch_name": "OmniGym Quận 1",
  "address": "123 Đường Nguyễn Huệ",
  "province": "Hồ Chí Minh",
  "district": "Quận 1",
  "hotline": "0123456789",
  "opening_house": "05:00 - 22:00",
  "image_url": "https://example.com/cover.jpg",
  "images": [
    {
      "image_url": "https://example.com/img1.jpg",
      "is_cover": false,
      "sort_order": 1
    }
  ],
  "facilities": [
    {
      "facility_name": "Wifi",
      "description": "Wifi tốc độ cao miễn phí",
      "icon_url": "wifi-icon"
    }
  ]
}
```

**Response**

* **201 - Thành công**

```json
{
  "message": "Branch created successfully",
  "data": {
    "id": 5,
    "partner_id": 1,
    "branch_name": "OmniGym Quận 1",
    "address": "123 Đường Nguyễn Huệ",
    "hotline": "0123456789",
    "status": "active",
    "province": "Hồ Chí Minh",
    "district": "Quận 1",
    "opening_house": "05:00 - 22:00",
    "image_url": "https://example.com/cover.jpg"
  }
}
```

* **400 - Dữ liệu không hợp lệ**
* **500 - Lỗi hệ thống**
