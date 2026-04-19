# HƯỚNG DẪN CÀI ĐẶT CHO THÀNH VIÊN

## Yêu cầu
- Node.js >= 18
- XAMPP (MySQL/MariaDB)

## Bước 1: Clone & cài dependencies
```bash
cd backend
npm install
```

## Bước 2: Tạo file .env
Tạo file `.env` trong thư mục `backend/` với nội dung:
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=         ← để trống nếu dùng XAMPP mặc định
DB_NAME=htqlch_thietbi_cn
JWT_SECRET=htqlch_thietbi_super_secret_key_2026_abc123xyz
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Bước 3: Import Database
Mở XAMPP → Start MySQL → Mở MySQL Shell hoặc dùng phpMyAdmin:

### Cách 1 – phpMyAdmin:
1. Vào http://localhost/phpmyadmin
2. Tạo database mới: `htqlch_thietbi_cn`
3. Import file `database/schema.sql`
4. Import file `database/seed.sql`

### Cách 2 – Command line:
```bash
# Windows PowerShell
Get-Content "database/schema.sql" | & "C:\xampp\mysql\bin\mysql.exe" -u root
Get-Content "database/seed.sql"   | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

## Bước 4: Chạy server
```bash
npm run dev
```
→ Server chạy tại: http://localhost:3001
→ Health check: http://localhost:3001/health

## Tài khoản thử nghiệm
| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| admin@techstore.vn | password | Admin |
| staff@techstore.vn | password | Nhân viên |
| user@techstore.vn | password | Khách hàng |
