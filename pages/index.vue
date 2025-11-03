<template>
  <div class="index-page">
    <div class="welcome-container">
      <h1 class="welcome-title">Tu Tiên Gõ Phím</h1>
      <p class="welcome-subtitle">Tôi tu tiên bằng chữ nghĩa, toàn là nhờ spam thôi!</p>
      <p class="welcome-description">
        Không thiên phú, không sư phụ, chỉ có cái bàn phím là bạn tu hành!
      </p>
      
      <div class="button-group">
        <el-button
          v-if="!user"
          type="primary"
          size="large"
          @click="navigateTo('/login')"
        >
          Đăng nhập
        </el-button>
        <el-button
          v-if="!user"
          size="large"
          @click="navigateTo('/register')"
        >
          Đăng ký
        </el-button>
        <el-button
          v-if="user"
          type="primary"
          size="large"
          @click="navigateTo('/home')"
        >
          Bắt đầu chơi
        </el-button>
        <el-button
          v-if="user"
          size="large"
          @click="handleLogout"
        >
          Đăng xuất
        </el-button>
      </div>

      <div v-if="user" class="user-info">
        <p>Xin chào, <strong>{{ user.username }}</strong>!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const user = ref<any>(null)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/auth/session')
    if (data.value && data.value.user) {
      user.value = data.value.user
    }
  } catch (error) {
    console.error('Failed to load session:', error)
  }
})

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    ElMessage.success('Đăng xuất thành công!')
    user.value = null
    await navigateTo('/login')
  } catch (error) {
    ElMessage.error('Đã xảy ra lỗi khi đăng xuất')
  }
}
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.welcome-container {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  text-align: center;
}

.welcome-title {
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.welcome-subtitle {
  font-size: 20px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 16px;
}

.welcome-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.button-group .el-button {
  min-width: 120px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.user-info {
  color: #666;
  font-size: 14px;
}

.user-info strong {
  color: #667eea;
}
</style>
