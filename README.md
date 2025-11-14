# Overview
## 1.1 - Cái gì đây?
- Đây là ứng dụng mini mô phỏng workflow ViPlex, dành cho TB10 Plus / Taurus Series, với các bước chuẩn:
    - Đọc file cấu hình solution.json (chuẩn ViPlex).
    - Đăng nhập vào thiết bị (/terminal/user/login).
    - Kiểm tra và set workmode = async nếu chưa đúng.
    - Đẩy solution lên (/terminal/core/v1/program).
    - Log lại kết quả từng bước.

## 1.2 - Cấu trúc project
```bash
viplex-push/
├── config/
│   └── solution.json
├── media/
│   └── demo.mp4
├── viplex-push.js
├── package.json
```

## 1.3 - Flow hoạt động
  
1. Đăng nhập và lấy token.
2. Kiểm tra chế độ hiện tại → đặt sang async nếu chưa đúng.
3. Upload từng file media từ solution.json → nhận uri thực tế trên TB10.
4. Cập nhật solution.widgets[].uri theo đường dẫn trả về.
5. Gửi solution hoàn chỉnh (POST /program) để TB10 Plus chạy nội dung.