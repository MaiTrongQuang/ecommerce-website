# Authentication API Routes

Các API routes cho tính năng xác thực người dùng, kết nối với Supabase.

## Endpoints

### 1. POST `/api/auth/login`
Đăng nhập người dùng.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00Z",
    "full_name": "John Doe",
    "role": "customer"
  },
  "session": { ... }
}
```

**Response Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

### 2. POST `/api/auth/signup`
Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890" // optional
}
```

**Response Success (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "Account created successfully. Please check your email to verify your account.",
  "requiresEmailVerification": true
}
```

**Response Error (400):**
```json
{
  "error": "Password must be at least 6 characters"
}
```

### 3. POST `/api/auth/logout`
Đăng xuất người dùng hiện tại.

**Response Success (200):**
```json
{
  "message": "Logged out successfully"
}
```

### 4. GET `/api/auth/me`
Lấy thông tin người dùng hiện tại.

**Response Success (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00Z",
    "full_name": "John Doe",
    "role": "customer",
    "phone": "+1234567890"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Unauthorized"
}
```

### 5. POST `/api/auth/verify-email`
Gửi lại email xác thực.

**Request Body:**
```json
{
  "email": "user@example.com",
  "type": "signup" // optional: "signup" or "email_change"
}
```

**Response Success (200):**
```json
{
  "message": "Verification email sent successfully. Please check your inbox."
}
```

### 6. POST `/api/auth/reset-password`
Gửi email đặt lại mật khẩu.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response Success (200):**
```json
{
  "message": "Password reset email sent successfully. Please check your inbox."
}
```

### 7. POST `/api/auth/update-password`
Cập nhật mật khẩu (yêu cầu đăng nhập).

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response Success (200):**
```json
{
  "message": "Password updated successfully"
}
```

### 8. GET `/api/auth/callback`
Callback endpoint để xử lý email verification và password reset từ Supabase.

**Query Parameters:**
- `code`: Authorization code từ Supabase
- `next`: URL để redirect sau khi xác thực (optional, default: "/")

## Sử dụng trong Client Components

### Login
```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})

const data = await response.json()
if (!response.ok) {
  console.error(data.error)
}
```

### Signup
```typescript
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, fullName }),
})

const data = await response.json()
if (!response.ok) {
  console.error(data.error)
}
```

### Logout
```typescript
const response = await fetch("/api/auth/logout", {
  method: "POST",
})

// Refresh page to update auth state
window.location.href = "/"
```

### Get Current User
```typescript
const response = await fetch("/api/auth/me")
const data = await response.json()
if (response.ok) {
  console.log(data.user)
}
```

## Lưu ý

1. **Email Verification**: Sau khi đăng ký, người dùng cần xác thực email trước khi có thể đăng nhập (nếu email confirmation được bật trong Supabase).

2. **Session Management**: Supabase SSR tự động quản lý session thông qua cookies. Sau khi login thành công, session sẽ được lưu tự động.

3. **Error Handling**: Tất cả các endpoints đều trả về error message rõ ràng trong response JSON.

4. **Security**: 
   - Passwords được hash tự động bởi Supabase
   - Tất cả các requests đều được validate
   - Email verification được yêu cầu để tăng tính bảo mật

5. **Profile Creation**: Profile được tạo tự động sau khi đăng ký thành công thông qua database trigger.

## Environment Variables

Đảm bảo các biến môi trường sau được cấu hình trong `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Optional, for email redirects
```

## Database Setup

Đảm bảo các trigger và functions sau đã được tạo trong Supabase:

1. `handle_new_user()` - Tự động tạo profile khi user đăng ký
2. RLS policies đã được cấu hình đúng

Xem thêm trong `scripts/003_create_functions.sql` và `scripts/002_enable_rls.sql`.

