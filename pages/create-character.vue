<template>
  <div class="create-character-container">
    <div class="create-character-card">
      <h1 class="title">Tạo Nhân Vật</h1>
      <p class="subtitle">Bắt đầu hành trình tu tiên của bạn!</p>

      <div v-if="checking" class="loading">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <p>Đang kiểm tra...</p>
      </div>

      <div v-else-if="hasGameState" class="already-exists">
        <el-alert
          type="info"
          title="Bạn đã có nhân vật"
          description="Nhân vật của bạn đã được tạo. Hãy bắt đầu chơi ngay!"
          show-icon
          :closable="false"
        />
        <el-button
          type="primary"
          size="large"
          class="action-button"
          @click="navigateTo('/home')"
        >
          Vào game
        </el-button>
      </div>

      <div v-else class="create-form">
        <p class="description">
          Bạn chưa có nhân vật trong game. Nhấn nút bên dưới để tạo nhân vật mới và bắt đầu hành trình tu tiên của bạn!
        </p>

        <div class="stats-preview">
          <h3>Thuộc tính ban đầu:</h3>
          <ul>
            <li>Cảnh giới: Phàm Nhân</li>
            <li>Tuổi: 1 tuổi</li>
            <li>Công kích: 10</li>
            <li>Phòng thủ: 10</li>
            <li>Khí huyết: 100</li>
            <li>Tu vi: 0 / 100</li>
          </ul>
        </div>

        <el-button
          type="primary"
          size="large"
          :loading="creating"
          class="action-button"
          @click="handleCreateCharacter"
        >
          {{ creating ? 'Đang tạo...' : 'Tạo nhân vật' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

definePageMeta({
  middleware: 'auth',
})

const checking = ref(true)
const creating = ref(false)
const hasGameState = ref(false)

// Check if game state exists
const checkGameState = async () => {
  checking.value = true
  try {
    const { data, error } = await useFetch('/api/gamestate/check')
    
    if (error.value) {
      throw new Error('Không thể kiểm tra trạng thái nhân vật')
    }

    hasGameState.value = data.value?.exists || false
  } catch (err: any) {
    ElMessage.error(err.message || 'Đã xảy ra lỗi')
  } finally {
    checking.value = false
  }
}

// Create game state
const handleCreateCharacter = async () => {
  creating.value = true
  try {
    const { data, error } = await useFetch('/api/gamestate/create', {
      method: 'POST',
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Tạo nhân vật thất bại')
    }

    ElMessage.success(data.value?.message || 'Tạo nhân vật thành công!')
    
    // Redirect to home page
    await navigateTo('/home')
  } catch (err: any) {
    ElMessage.error(err.message || 'Đã xảy ra lỗi khi tạo nhân vật')
  } finally {
    creating.value = false
  }
}

// Check on mount
onMounted(() => {
  checkGameState()
})
</script>

<style scoped>
.create-character-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.create-character-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
}

.loading .is-loading {
  font-size: 48px;
}

.already-exists {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  text-align: center;
}

.stats-preview {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
}

.stats-preview h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.stats-preview ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-preview li {
  font-size: 14px;
  color: #666;
  padding: 6px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stats-preview li:last-child {
  border-bottom: none;
}

.action-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}
</style>
