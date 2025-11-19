# Hệ Thống Tu Tiên - Server-Based Architecture

## 📋 Tổng Quan

Hệ thống đã được nâng cấp lên kiến trúc client-server với MongoDB làm database chính, thay thế việc lưu trữ local storage.

## 🚀 Cài Đặt & Chạy

### 1. Cài đặt MongoDB

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Tải và cài đặt từ: https://www.mongodb.com/try/download/community

### 2. Cài đặt Dependencies

```bash
npm install
```

### 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục root (đã tạo sẵn):
```env
MONGODB_URI=mongodb://localhost:27017/xiuxian-game
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Chạy Ứng Dụng

**Chạy cả Client và Server:**
```bash
npm run dev:all
```

**Chỉ chạy Client:**
```bash
npm run dev
```

**Chỉ chạy Server:**
```bash
npm run dev:server
```

## 🏗️ Kiến Trúc Hệ Thống

### Backend (Nitro + MongoDB)

```
server/
├── api/
│   ├── auth/
│   │   ├── register.post.js    # Đăng ký
│   │   ├── login.post.js        # Đăng nhập
│   │   └── me.get.js            # Lấy thông tin user
│   └── player/
│       ├── index.get.js         # Lấy dữ liệu player
│       ├── index.put.js         # Cập nhật player
│       ├── cultivation/
│       │   └── breakthrough.post.js  # Đột phá
│       └── combat/
│           └── fight.post.js     # Chiến đấu
├── models/
│   ├── User.js                  # Schema người dùng
│   └── Player.js                # Schema dữ liệu game
├── utils/
│   ├── db.js                    # Kết nối MongoDB
│   └── auth.js                  # JWT authentication
└── plugins/
    └── database.js              # Nitro plugin
```

### Frontend (Vue 3 + Pinia)

```
src/
├── stores/
│   ├── auth.js                  # Auth store (login/register)
│   ├── player.js                # Player store (game data)
│   └── mainStore.js             # Wrapper cho compatibility
├── views/
│   └── authPage.vue             # Trang đăng nhập/đăng ký
└── utils/
    └── api.js                   # API client helper
```

## 🔐 Authentication Flow

1. **Đăng Ký:**
   - User nhập username, email, password
   - Server tạo User và Player data
   - Trả về JWT token

2. **Đăng Nhập:**
   - User nhập username, password
   - Server xác thực và trả về JWT token
   - Token được lưu trong localStorage

3. **Protected Routes:**
   - Router kiểm tra authentication trước khi cho phép truy cập
   - Mọi API call đều gửi kèm Bearer token

## 🎮 Game Logic Migration

### Logic đã di chuyển lên Server:

1. **Cultivation (Tu Luyện):**
   - `/api/player/cultivation/breakthrough` - Đột phá cảnh giới

2. **Combat (Chiến Đấu):**
   - `/api/player/combat/fight` - Chiến đấu với quái vật
   - Server tính toán kết quả và cập nhật rewards

3. **Player Data (Dữ Liệu Người Chơi):**
   - Tất cả dữ liệu game lưu trên MongoDB
   - Auto-sync mỗi khi có thay đổi

### Sử Dụng trong Component:

```vue
<script setup>
import { usePlayerStore } from '@/stores/player';
import { ElMessage } from 'element-plus';

const playerStore = usePlayerStore();

// Lấy dữ liệu player
await playerStore.fetchPlayer();

// Đột phá
try {
  const result = await playerStore.breakthrough(100);
  ElMessage.success(result.message);
} catch (error) {
  ElMessage.error(error.message);
}

// Chiến đấu
const combatResult = await playerStore.fight(monsterData);

// Cập nhật dữ liệu
await playerStore.updatePlayer({ cultivation: 500 });
</script>
```

## 📊 Database Schema

### User Collection:
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date
}
```

### Player Collection:
```javascript
{
  userId: ObjectId,
  name: String,
  level: Number,
  cultivation: Number,
  attack: Number,
  defense: Number,
  health: Number,
  props: { money, currency, ... },
  inventory: Array,
  equipment: Object,
  cultivationPath: Object,
  // ... tất cả thuộc tính game
}
```

## 🔒 Security Features

- ✅ Password hashing với bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ Error handling

## 🎨 UI/UX

- Trang đăng nhập/đăng ký với Element Plus
- Design đẹp mắt với gradient và glass morphism
- Responsive và mobile-friendly
- Thông báo lỗi/thành công rõ ràng

## 📝 Migration từ Local Storage

Code cũ vẫn tương thích thông qua `mainStore.js` wrapper:

```javascript
// Cách cũ (vẫn hoạt động)
this.$store.player.cultivation

// Cách mới (khuyến nghị)
const playerStore = usePlayerStore();
playerStore.playerData.cultivation
```

## 🔄 Đồng Bộ Dữ Liệu

- Dữ liệu tự động sync với server sau mỗi action quan trọng
- Local cache để tăng tốc độ load
- Offline mode sẽ queue các thay đổi (TODO)

## 🛠️ Development Tips

1. **Thêm API Endpoint Mới:**
   - Tạo file trong `server/api/`
   - Sử dụng `defineEventHandler`
   - Implement authentication với `requireAuth()`

2. **Thêm Field vào Player:**
   - Update `server/models/Player.js`
   - MongoDB sẽ tự động migrate

3. **Debug:**
   - Server logs: Terminal với prefix "server"
   - Client logs: Browser console
   - MongoDB: `mongosh` hoặc MongoDB Compass

## 📦 Build Production

```bash
# Build client
npm run build

# Build server
npm run build:server
```

## 🚨 Lưu Ý Quan Trọng

1. **MONGODB_URI:** Đổi sang production database khi deploy
2. **JWT_SECRET:** Phải đổi thành chuỗi bảo mật mạnh
3. **CORS:** Cấu hình CORS nếu deploy client/server riêng
4. **Rate Limiting:** Cần thêm rate limiting cho production

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra MongoDB đã chạy chưa: `brew services list`
2. Kiểm tra logs trong terminal
3. Xóa cache: `rm -rf node_modules && npm install`
4. Reset database: `mongosh xiuxian-game --eval "db.dropDatabase()"`
