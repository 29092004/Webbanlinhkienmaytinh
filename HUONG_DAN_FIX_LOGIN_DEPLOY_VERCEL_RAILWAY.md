# Hướng dẫn fix đăng nhập khi deploy Vercel + Railway

## 1. Biến môi trường frontend trên Vercel

Khai báo đúng 3 biến sau trong project frontend:

```env
VITE_API_URL=https://webbanlinhkienmaytinh-production.up.railway.app/api
VITE_IMAGE_BASE_URL=https://pub-a37bb828e19547c6ac16ab62282dd9e5.r2.dev
GOOGLE_CLIENT_ID=204484097661-g2mu8g4gjfsvfngo4flc1mpsis2fii53.apps.googleusercontent.com
```

Lưu ý:

- `VITE_API_URL` phải có đuôi `/api`
- Sau khi sửa env trên Vercel phải redeploy lại frontend

## 2. Biến môi trường backend trên Railway

Backend phải cho phép đúng domain frontend đang chạy:

```env
NODE_ENV=production
FRONTEND_URLS=https://webbanlinhkienmaytinh-kceh4knpu-vinhs-projects-b1a0df0d.vercel.app
FRONTEND_URL=https://webbanlinhkienmaytinh-kceh4knpu-vinhs-projects-b1a0df0d.vercel.app
FRONTEND_PAYMENT_RETURN_URL=https://webbanlinhkienmaytinh-kceh4knpu-vinhs-projects-b1a0df0d.vercel.app
```

Nếu có nhiều domain frontend, nối bằng dấu phẩy trong `FRONTEND_URLS`:

```env
FRONTEND_URLS=https://your-main-domain.com,https://webbanlinhkienmaytinh-kceh4knpu-vinhs-projects-b1a0df0d.vercel.app,http://localhost:5173
```

Lưu ý:

- Chỉ thêm `http://localhost:5173` nếu bạn muốn frontend local gọi trực tiếp backend production
- Sau khi sửa env trên Railway phải redeploy lại backend

## 3. Cấu hình Google Login

Trong Google Cloud Console, vào OAuth Client đang dùng và thêm:

### Authorized JavaScript origins

```txt
https://webbanlinhkienmaytinh-kceh4knpu-vinhs-projects-b1a0df0d.vercel.app
http://localhost:5173
```

Nếu sau này có domain chính thức thì thêm luôn domain đó.

## 4. Triệu chứng và nguyên nhân

### Lỗi `404 Not Found` khi đăng nhập trên Vercel

Nguyên nhân thường là frontend đang gọi sai API:

- thiếu `/api`
- hoặc đang gọi vào chính domain Vercel của frontend

### Lỗi `blocked by CORS policy`

Nguyên nhân là backend Railway chưa whitelist domain frontend trong `FRONTEND_URLS`.

### Lỗi Google `403 Forbidden` hoặc `Error retrieving a token`

Nguyên nhân là domain hiện tại chưa được thêm vào Google OAuth `Authorized JavaScript origins`.

## 5. Những gì code đã hỗ trợ sẵn

Frontend hiện đã tự chuẩn hóa `VITE_API_URL`:

- nếu bạn nhập `https://your-backend-domain` thì code sẽ tự chuyển thành `https://your-backend-domain/api`
- nếu bạn nhập sẵn `https://your-backend-domain/api` thì vẫn hoạt động bình thường

Điều này giúp giảm lỗi cấu hình thiếu `/api`, nhưng bạn vẫn cần đặt đúng domain backend thật.

## 6. Checklist test sau khi sửa

1. Vercel redeploy xong
2. Railway redeploy xong
3. Mở trang `/login`
4. Test đăng nhập email/mật khẩu
5. Test đăng ký
6. Test đăng nhập Google
7. Mở DevTools và xác nhận request đi tới:

```txt
https://webbanlinhkienmaytinh-production.up.railway.app/api/auth/login
```
