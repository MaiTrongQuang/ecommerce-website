# Authentication System Documentation

## Cách Supabase Auth hoạt động

### 1. Password Storage
- **Password được lưu tự động** trong bảng `auth.users` (bảng hệ thống của Supabase)
- Password được **hash tự động** bằng thuật toán bcrypt khi sử dụng `supabase.auth.signUp()`
- **KHÔNG cần** lưu password trong bảng `profiles`

### 2. Database Structure

#### Bảng `auth.users` (Supabase System Table)
- Được quản lý tự động bởi Supabase
- Lưu trữ: email, password (hashed), email_confirmed_at, created_at, etc.
- Không thể truy cập trực tiếp từ client, chỉ qua Supabase Auth API

#### Bảng `profiles` (Public Table)
- Lưu thông tin bổ sung về người dùng
- Các cột: id, email, full_name, phone, role, created_at, updated_at
- **KHÔNG có cột password** vì password đã được lưu trong `auth.users`

### 3. Authentication Flow

#### Đăng ký (Sign Up)
```typescript
// app/api/auth/signup/route.ts
const { data, error } = await supabase.auth.signUp({
  email,
  password, // Password được hash tự động
})
```

#### Đăng nhập (Sign In)
```typescript
// app/api/auth/login/route.ts
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password, // So sánh với password đã hash trong auth.users
})
```

### 4. Kiểm tra Authentication

Để kiểm tra xem password có được lưu đúng không:

1. **Kiểm tra trong Supabase Dashboard:**
   - Vào Authentication > Users
   - Xem danh sách users đã đăng ký
   - Password không hiển thị (vì đã được hash)

2. **Test đăng nhập:**
   - Thử đăng nhập với email/password đã đăng ký
   - Nếu đăng nhập thành công → password đã được lưu đúng

### 5. Lưu ý quan trọng

- ✅ Password **ĐÃ ĐƯỢC LƯU** trong `auth.users` (Supabase tự động)
- ✅ Password **ĐÃ ĐƯỢC HASH** tự động (không cần làm gì thêm)
- ✅ Người dùng **CÓ THỂ ĐĂNG NHẬP** với email/password đã đăng ký
- ❌ **KHÔNG CẦN** thêm cột password vào bảng `profiles`

### 6. Nếu muốn tự quản lý password (KHÔNG KHUYẾN NGHỊ)

Nếu bạn muốn tự quản lý password trong bảng `profiles`:

1. Tạo migration để thêm cột `password` vào `profiles`
2. Sử dụng bcrypt để hash password
3. Tự viết logic đăng nhập/đăng ký
4. Không sử dụng Supabase Auth

**⚠️ Cảnh báo:** Không khuyến nghị vì:
- Mất đi các tính năng bảo mật của Supabase Auth
- Phải tự xử lý password reset, email verification, etc.
- Tăng nguy cơ lỗ hổng bảo mật

