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




# Đăng nhập để lấy token
curl -k -sS -X POST "https://192.168.8.31:16674/terminal/core/v1/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "sn": "MYHA12127W2030017171",
    "username": "admin",
    "password": "88888888",
    "loginType": 2,
    "clientId": 1,
    "clientName": "TestClient"
  }'

# Sau đó dùng token từ response:
# curl -k -H "Authorization: <TOKEN>" "https://<DEVICE_IP>:16674/terminal/core/v1/screen/brightness"



# terminal-open api

- User-related
  - 1.1 - Log in to devices [Post]
  - 1.2 - Log out of the device [Delete]
  - 1.3 - Change user information [Put]

- System control-related
  - 2.1 - Screenshot [Get]
  - 2.2 - Restart immediately [Post]
  - 2.3 - Obtain device restart schedules [Get]
  - 2.4 - Schedule device restarts [Post]
  - 2.5 - Set time
  - 2.6 - Install apps
  - 2.7 - Install apps
  - 2.8 - Obtain time
  - 2.9 - Factory reset
  - 2.10 - Obtain terminal info 
  - 2.11 - Obtain volume
  - 2.12 - Set volume
  - 2.13 - Upgrade the device
  - 2.14 - Check local 

- 

