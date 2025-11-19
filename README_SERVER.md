# 🎮 Tu Tiên - Hệ Thống Server-Based

## ✨ Tính Năng Mới

### 🔐 Hệ Thống Xác Thực
- ✅ Đăng ký tài khoản mới với username, email, password
- ✅ Đăng nhập bảo mật với JWT token
- ✅ Tự động lưu session
- ✅ Bảo vệ routes yêu cầu đăng nhập

### 💾 Lưu Trữ Cloud (MongoDB)
- ✅ Tất cả dữ liệu game lưu trên server
- ✅ Tự động đồng bộ real-time
- ✅ Không lo mất dữ liệu khi xóa cache
- ✅ Có thể chơi trên nhiều thiết bị

### ⚔️ Game Logic Server-Side
- ✅ Chiến đấu được tính toán trên server (chống gian lận)
- ✅ Đột phá cảnh giới server-side
- ✅ Quản lý inventory/equipment
- ✅ Ranking toàn server

## 🚀 Hướng Dẫn Sử Dụng

### Lần Đầu Sử Dụng

1. **Cài đặt MongoDB:**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Linux
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy game:**
   ```bash
   npm run dev:all
   ```

4. **Truy cập:**
   - Mở browser tại: http://localhost:5173
   - Đăng ký tài khoản mới
   - Bắt đầu hành trình tu tiên!

### Chạy Hàng Ngày

```bash
# Chạy cả client và server
npm run dev:all

# Hoặc chạy riêng:
npm run dev          # Chỉ client
npm run dev:server   # Chỉ server
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user

### Player
- `GET /api/player` - Lấy dữ liệu
- `PUT /api/player` - Cập nhật dữ liệu

### Game Actions
- `POST /api/player/cultivation/breakthrough` - Đột phá
- `POST /api/player/combat/fight` - Chiến đấu
- `POST /api/player/inventory/use` - Dùng vật phẩm
- `POST /api/player/equipment/equip` - Trang bị

### Ranking
- `GET /api/ranking?sortBy=score&limit=100` - Bảng xếp hạng

## 🎨 Giao Diện Mới

### Trang Đăng Nhập/Đăng Ký
- Design đẹp mắt với gradient và glass morphism
- Tuân thủ design system hiện tại
- Responsive trên mọi thiết bị
- Validate input real-time

### Integration
- Hoàn toàn tích hợp với UI hiện có
- Không làm thay đổi trải nghiệm chơi game
- Thêm tính năng ranking toàn server

## 🔒 Bảo Mật

- ✅ Password được hash bằng bcrypt
- ✅ JWT token với thời hạn 7 ngày
- ✅ Protected API routes
- ✅ Input validation
- ✅ XSS protection

## 📊 Database Schema

### Users
```javascript
{
  username: String (unique, 3-20 chars),
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date
}
```

### Players
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  level: Number,
  cultivation: Number,
  attack, defense, health, ...
  inventory: Array,
  equipment: Object,
  cultivationPath: Object,
  // ... tất cả dữ liệu game
}
```

## 🔄 Migration từ Phiên Bản Cũ

Nếu bạn đang chơi phiên bản local:

1. **Export dữ liệu cũ** (trong game):
   - Vào Settings
   - Chọn "Export Data"
   - Lưu file JSON

2. **Đăng ký tài khoản mới**

3. **Import dữ liệu** (TODO):
   - Tính năng đang phát triển
   - Hiện tại cần bắt đầu mới

## 🛠️ Development

### Cấu trúc Project
```
vue-XiuXianGame/
├── server/              # Backend (Nitro)
│   ├── api/            # API endpoints
│   ├── models/         # MongoDB schemas
│   ├── utils/          # Utilities
│   └── plugins/        # Nitro plugins
├── src/                # Frontend (Vue 3)
│   ├── stores/         # Pinia stores
│   ├── views/          # Pages/Components
│   └── utils/          # Client utilities
└── docs/               # Documentation
```

### Thêm API Endpoint Mới

1. Tạo file trong `server/api/`:
   ```javascript
   // server/api/example/action.post.js
   import { connectDB } from '../../utils/db';
   import { requireAuth } from '../../utils/auth';
   
   export default defineEventHandler(async (event) => {
     await connectDB();
     const userId = await requireAuth(event);
     const body = await readBody(event);
     
     // Your logic here
     
     return { success: true, data: {} };
   });
   ```

2. Sử dụng trong client:
   ```javascript
   const response = await fetch('/api/example/action', {
     method: 'POST',
     headers: authStore.getAuthHeaders(),
     body: JSON.stringify({ data })
   });
   ```

### Debug

- **Server logs:** Terminal với prefix [server]
- **Client logs:** Browser DevTools Console
- **Database:** `mongosh xiuxian-game` hoặc MongoDB Compass

## 📝 TODO

- [ ] Import dữ liệu từ local storage
- [ ] Chat/Social features
- [ ] PvP system
- [ ] Guild/Clan system
- [ ] Real-time multiplayer events
- [ ] Admin dashboard
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA authentication

## 🐛 Troubleshooting

### MongoDB không khởi động
```bash
# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongodb
```

### Port đã được sử dụng
```bash
# Kill process sử dụng port 3000
lsof -ti:3000 | xargs kill -9

# Kill process sử dụng port 5173
lsof -ti:5173 | xargs kill -9
```

### Reset database
```bash
mongosh xiuxian-game --eval "db.dropDatabase()"
```

### Clear cache
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License - Xem file LICENSE

## 🤝 Contributing

Pull requests are welcome!

---

**Chúc bạn tu tiên vui vẻ! 🧘‍♂️✨**
