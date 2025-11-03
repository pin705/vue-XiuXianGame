# Hướng dẫn cài đặt Nuxt 3 với MongoDB

## Yêu cầu hệ thống

- Node.js 18+ hoặc 20+
- MongoDB 4.4+
- npm hoặc yarn

## Cài đặt

### 1. Cài đặt MongoDB

**Trên Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Trên macOS (sử dụng Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Sử dụng Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin MongoDB của bạn:

```
MONGODB_URI=mongodb://localhost:27017/xiuxian-game
AUTH_SECRET=your-secret-key-change-in-production
```

### 4. Chạy ứng dụng

**Development:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

## Cấu trúc dự án Nuxt 3

```
├── assets/              # CSS, images
├── components/          # Vue components
├── composables/         # Composition API functions
├── layouts/             # Page layouts
├── middleware/          # Route middleware
├── pages/               # File-based routing
├── public/              # Static files
├── server/              # Server-side code
│   ├── api/            # API endpoints
│   ├── middleware/     # Server middleware
│   ├── models/         # MongoDB models
│   └── utils/          # Server utilities
└── stores/              # Pinia stores

```

## Tính năng mới

### 1. Hệ thống Authentication

- Đăng ký: `/register`
- Đăng nhập: `/login`
- Đăng xuất: API `/api/auth/logout`
- Session management với nuxt-auth-utils

### 2. Server-side Game Logic

- Tất cả game logic chạy trên server
- API endpoint thống nhất: `/api/action`
- Bảo mật dữ liệu game với MongoDB

### 3. API Endpoints

**Authentication:**
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/session` - Lấy session hiện tại

**Game Actions:**
- `POST /api/action` - Thực hiện các hành động game

Các action được hỗ trợ:
- `getState` - Lấy trạng thái game
- `cultivate` - Tu luyện
- `explore` - Thám hiểm
- `fight` - Chiến đấu
- `equipItem` - Trang bị vật phẩm
- `unequipItem` - Gỡ trang bị
- `buyItem` - Mua vật phẩm
- `sellItem` - Bán vật phẩm
- `useItem` - Sử dụng vật phẩm
- `checkin` - Điểm danh
- `playMiniGame` - Chơi mini game
- `updateSettings` - Cập nhật cài đặt

### 4. Database Schema

**User Model:**
- username (unique)
- email (unique)
- password (hashed)
- createdAt
- lastLogin

**GameState Model:**
- userId (reference to User)
- player (all player data)
- boss (boss data)

## Migration từ Vue 3 + Vite

Dự án cũ vẫn được giữ lại với scripts:
- `npm run dev:old` - Chạy Vite dev server
- `npm run build:old` - Build với Vite

## Troubleshooting

### MongoDB connection error

Kiểm tra MongoDB đang chạy:
```bash
# Linux/macOS
sudo systemctl status mongodb
# hoặc
brew services list

# Kiểm tra connection
mongosh
```

### Port đã được sử dụng

Thay đổi port trong file `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  devServer: {
    port: 3001, // Thay đổi port ở đây
  },
})
```

### Module resolution errors

Chạy lại:
```bash
rm -rf node_modules .nuxt
npm install
```

## Tài liệu tham khảo

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Nuxt Mongoose](https://github.com/nuxt-modules/mongoose)
- [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils)
- [Element Plus](https://element-plus.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
