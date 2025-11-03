# Hướng dẫn Migration từ Vue 3 + Vite sang Nuxt 3

## Tổng quan thay đổi

Dự án đã được tái cấu trúc hoàn toàn từ một ứng dụng Vue 3 SPA (Single Page Application) chạy client-side sang một ứng dụng Nuxt 3 full-stack với server-side logic và database.

## Thay đổi chính

### 1. Cấu trúc Project

#### Trước (Vue 3 + Vite):
```
├── src/
│   ├── views/          # Vue components cho các trang
│   ├── components/     # Reusable components
│   ├── plugins/        # Game logic (store, combat, cultivation, etc.)
│   └── main.js         # Entry point
├── vite.config.js      # Vite configuration
└── index.html          # HTML entry
```

#### Sau (Nuxt 3):
```
├── pages/              # File-based routing (index.vue, login.vue, home.vue, etc.)
├── components/         # Auto-imported components
├── server/             # Server-side code
│   ├── api/           # API endpoints
│   ├── models/        # MongoDB models
│   ├── middleware/    # Server middleware
│   └── utils/         # Server utilities
├── layouts/            # Layout templates
├── middleware/         # Route middleware
├── assets/             # CSS, images
├── composables/        # Composition API reusables
├── stores/             # Pinia stores (optional)
├── nuxt.config.ts      # Nuxt configuration
└── app.vue             # Root component
```

### 2. Routing

#### Trước:
```javascript
// src/plugins/router.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: index },
  { path: '/home', component: home },
  // ...
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

#### Sau:
```
pages/
├── index.vue      -> /
├── login.vue      -> /login
├── register.vue   -> /register
├── home.vue       -> /home
└── ...
```

File-based routing tự động, không cần cấu hình router thủ công.

### 3. State Management

#### Trước:
```javascript
// src/plugins/store.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    player: { /* ... */ },
    boss: { /* ... */ }
  }),
  actions: {
    cultivate() { /* logic chạy trên client */ },
    fight() { /* logic chạy trên client */ }
  }
})
```

#### Sau:
```typescript
// server/api/action.post.ts
export default defineEventHandler(async (event) => {
  const { action, payload } = await readBody(event)
  
  // Logic chạy trên server
  switch (action) {
    case 'cultivate':
      return await handleCultivate(gameState, payload)
    case 'fight':
      return await handleFight(gameState, payload)
  }
})
```

State được lưu trong MongoDB và xử lý trên server. Client gọi API để thực hiện actions.

### 4. Authentication

#### Trước:
- Không có hệ thống authentication
- Data lưu trong localStorage hoặc Firebase
- Mọi người có thể chơi offline

#### Sau:
```typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const user = await User.findOne({ username })
  
  if (await verifyPassword(password, user.password)) {
    await setUserSession(event, { user })
    return { success: true, user }
  }
})
```

- Hệ thống đăng ký/đăng nhập đầy đủ
- Session management với nuxt-auth-utils
- Middleware bảo vệ routes

### 5. Database

#### Trước:
```javascript
// Lưu trong localStorage hoặc Firebase
localStorage.setItem('gameState', JSON.stringify(state))
```

#### Sau:
```typescript
// server/models/GameState.ts
export const GameState = defineMongooseModel({
  name: 'GameState',
  schema: {
    userId: { type: 'ObjectId', ref: 'User', required: true },
    player: { /* player data */ },
    boss: { /* boss data */ }
  }
})

// Sử dụng
const gameState = await GameState.findOne({ userId })
await gameState.save()
```

MongoDB schemas với Mongoose models.

## Migration Step-by-Step

### Bước 1: Thiết lập môi trường

1. Cài đặt MongoDB
2. Tạo file `.env` từ `.env.example`
3. Chạy `npm install`

### Bước 2: Di chuyển Components

```vue
<!-- Trước: src/views/homePage.vue -->
<template>
  <div>{{ player.name }}</div>
</template>

<script>
export default {
  computed: {
    player() {
      return this.$store.player
    }
  }
}
</script>
```

```vue
<!-- Sau: pages/home.vue -->
<template>
  <div>{{ gameState?.player.name }}</div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { data: gameState } = await useFetch('/api/action', {
  method: 'POST',
  body: { action: 'getState' }
})
</script>
```

### Bước 3: Di chuyển Game Logic

```javascript
// Trước: src/plugins/cultivation.js
export function cultivate(player) {
  player.cultivation += 10
  if (player.cultivation >= player.maxCultivation) {
    player.level++
    // ...
  }
}
```

```typescript
// Sau: server/api/action.post.ts
async function handleCultivate(gameState: any, payload: any) {
  const cultivationGain = Math.floor(Math.random() * 10) + 5
  gameState.player.cultivation += cultivationGain
  
  if (gameState.player.cultivation >= gameState.player.maxCultivation) {
    gameState.player.level += 1
    gameState.player.cultivation = 0
    // ...
    return { levelUp: true, newLevel: gameState.player.level }
  }
  
  return { cultivationGain }
}
```

### Bước 4: Gọi API từ Client

```vue
<script setup>
const handleCultivate = async () => {
  const { data, error } = await useFetch('/api/action', {
    method: 'POST',
    body: { action: 'cultivate' }
  })
  
  if (data.value?.data.levelUp) {
    ElMessage.success('Đột phá thành công!')
  }
}
</script>
```

## Lợi ích của Migration

### 1. Bảo mật
- ✅ Game logic không thể bị hack từ browser
- ✅ Data được mã hóa và lưu trong database
- ✅ Authentication và authorization đầy đủ

### 2. Multiplayer
- ✅ Nhiều người chơi có thể chơi cùng lúc
- ✅ Leaderboards và rankings thực sự
- ✅ Social features (friends, guilds, chat)

### 3. Performance
- ✅ Server-side rendering (SSR) tốt cho SEO
- ✅ Automatic code splitting
- ✅ Optimized bundles

### 4. Developer Experience
- ✅ Auto-import components và composables
- ✅ TypeScript support
- ✅ File-based routing
- ✅ Hot module replacement

## Breaking Changes

### 1. localStorage không còn được sử dụng
- Tất cả data được lưu trong MongoDB
- Cần đăng nhập để chơi game

### 2. Không thể chơi offline
- Cần kết nối internet và server
- Cần MongoDB đang chạy

### 3. Cấu trúc API khác hoàn toàn
- Tất cả actions qua `/api/action` endpoint
- Sử dụng `useFetch` thay vì direct store access

## Tương thích ngược

Phiên bản cũ vẫn có thể chạy với:
```bash
npm run dev:old
npm run build:old
```

## Next Steps

Sau khi migration cơ bản:

1. [ ] Port tất cả game modules:
   - combat.js → server logic
   - cultivation.js → server logic
   - equip.js → server logic
   - boss.js → server logic
   - shop.js → server logic

2. [ ] Tạo các pages còn thiếu:
   - pages/explore.vue
   - pages/boss.vue
   - pages/shop.vue
   - pages/inventory.vue

3. [ ] Implement multiplayer features:
   - PvP combat
   - Trading system
   - Guild system
   - Chat system

4. [ ] Thêm admin panel
5. [ ] Setup deployment (Docker, Cloud)
6. [ ] Add monitoring và analytics

## Troubleshooting

### MongoDB connection error
```bash
# Kiểm tra MongoDB
mongosh

# Start MongoDB
sudo systemctl start mongodb
```

### Module resolution errors
```bash
# Clear cache
rm -rf node_modules .nuxt
npm install
```

### TypeScript errors
```bash
# Regenerate types
npm run postinstall
```

## Tài liệu thêm

- [Nuxt 3 Documentation](https://nuxt.com)
- [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils)
- [Nuxt Mongoose](https://github.com/nuxt-modules/mongoose)
- [NUXT3_SETUP.md](./NUXT3_SETUP.md)
