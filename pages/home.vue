<template>
  <div class="home-page">
    <div v-if="pending" class="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <p>Đang tải...</p>
    </div>

    <div v-else-if="error" class="error">
      <el-alert type="error" :title="error.message" />
      <el-button @click="refreshNuxtData()">Thử lại</el-button>
    </div>

    <div v-else-if="gameState" class="game-container">
      <div class="header">
        <h1>{{ gameState.player.name }}</h1>
        <el-button @click="handleLogout">Đăng xuất</el-button>
      </div>

      <div class="stats-container">
        <h2>Thông tin nhân vật</h2>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Tuổi:</span>
            <span class="stat-value">{{ gameState.player.age }} tuổi</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Cảnh giới:</span>
            <span class="stat-value">{{ levelName(gameState.player.level) }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Tu vi:</span>
            <span class="stat-value">
              {{ gameState.player.cultivation }} / {{ gameState.player.maxCultivation }}
              ({{ cultivationPercent }}%)
            </span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Khí huyết:</span>
            <span class="stat-value">
              {{ gameState.player.health }} / {{ gameState.player.maxHealth }}
            </span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Công kích:</span>
            <span class="stat-value">{{ gameState.player.attack }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Phòng thủ:</span>
            <span class="stat-value">{{ gameState.player.defense }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Tỷ lệ né tránh:</span>
            <span class="stat-value">{{ (gameState.player.dodge * 100).toFixed(1) }}%</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Tỷ lệ bạo kích:</span>
            <span class="stat-value">{{ (gameState.player.critical * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <div class="resources-container">
        <h2>Tài nguyên</h2>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Linh Thạch:</span>
            <span class="stat-value">{{ gameState.player.props.money }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Truyền Tống Phù:</span>
            <span class="stat-value">{{ gameState.player.props.flying }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Ngộ Tính Đan:</span>
            <span class="stat-value">{{ gameState.player.props.rootBone }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Hồng Mông Thạch:</span>
            <span class="stat-value">{{ gameState.player.props.currency }}</span>
          </div>
        </div>
      </div>

      <div class="actions-container">
        <h2>Hành động</h2>
        
        <div class="button-grid">
          <el-button
            type="primary"
            :loading="cultivating"
            @click="handleCultivate"
          >
            Tu luyện
          </el-button>

          <el-button
            type="success"
            @click="navigateTo('/explore')"
          >
            Thám hiểm
          </el-button>

          <el-button
            type="danger"
            @click="navigateTo('/boss')"
          >
            Boss
          </el-button>

          <el-button
            type="warning"
            @click="handleCheckin"
            :disabled="checkedInToday"
          >
            {{ checkedInToday ? 'Đã điểm danh' : 'Điểm danh' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

definePageMeta({
  middleware: 'auth',
})

const cultivating = ref(false)

// Fetch game state
const { data: gameState, pending, error, refresh: refreshNuxtData } = await useFetch('/api/action', {
  method: 'POST',
  body: { action: 'getState' },
})

// Computed properties
const cultivationPercent = computed(() => {
  if (!gameState.value?.player) return 0
  const percent = (gameState.value.player.cultivation / gameState.value.player.maxCultivation) * 100
  return percent.toFixed(1)
})

const checkedInToday = computed(() => {
  if (!gameState.value?.player?.lastCheckinDate) return false
  const today = new Date().toDateString()
  const lastCheckin = new Date(gameState.value.player.lastCheckinDate).toDateString()
  return today === lastCheckin
})

// Helper functions
const levelName = (level: number) => {
  const levelsPerStage = 9
  const stageIndex = Math.floor((level - 1) / levelsPerStage)
  const stageLevel = (level - 1) % levelsPerStage + 1
  
  const numberName: Record<number, string> = {
    1: 'Một', 2: 'Hai', 3: 'Ba', 4: 'Bốn',
    5: 'Năm', 6: 'Sáu', 7: 'Bảy', 8: 'Tám', 9: 'Chín'
  }
  
  const stageNames = [
    'Trúc Cơ', 'Khai Quang', 'Thai Tức', 'Tịch Cốc',
    'Kim Đan', 'Nguyên Anh', 'Xuất Khiếu', 'Phân Thần',
    'Hợp Thể', 'Đại Thừa', 'Độ Kiếp', 'Địa Tiên',
    'Thiên Tiên', 'Kim Tiên', 'Đại La Kim Tiên', 'Cửu Thiên Huyền Tiên'
  ]
  
  if (level === 0) return 'Phàm Nhân'
  else if (level >= 144) return 'Cửu Thiên Huyền Tiên Chín Tầng'
  else return `${stageNames[stageIndex]} ${numberName[stageLevel]} Tầng`
}

// Action handlers
const handleCultivate = async () => {
  cultivating.value = true
  try {
    const { data: result, error: err } = await useFetch('/api/action', {
      method: 'POST',
      body: { action: 'cultivate' },
    })

    if (err.value) {
      throw new Error(err.value.data?.message || 'Tu luyện thất bại')
    }

    ElMessage.success(result.value?.data.message || 'Tu luyện thành công!')
    
    if (result.value?.data.levelUp) {
      ElMessage({
        type: 'success',
        message: `Chúc mừng! Bạn đã đột phá lên ${levelName(result.value.data.newLevel)}!`,
        duration: 5000,
      })
    }

    // Update local state
    if (result.value?.player) {
      gameState.value.player = result.value.player
    }
  } catch (err: any) {
    ElMessage.error(err.message || 'Đã xảy ra lỗi')
  } finally {
    cultivating.value = false
  }
}

const handleCheckin = async () => {
  try {
    const { data: result, error: err } = await useFetch('/api/action', {
      method: 'POST',
      body: { action: 'checkin' },
    })

    if (err.value) {
      throw new Error(err.value.data?.message || 'Điểm danh thất bại')
    }

    ElMessage.success(
      `${result.value?.data.message}! Nhận ${result.value?.data.reward} Linh Thạch. Chuỗi: ${result.value?.data.streak} ngày`
    )

    // Update local state
    if (result.value?.player) {
      gameState.value.player = result.value.player
    }
  } catch (err: any) {
    ElMessage.error(err.message || 'Đã xảy ra lỗi')
  }
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    ElMessage.success('Đăng xuất thành công!')
    await navigateTo('/login')
  } catch (error) {
    ElMessage.error('Đã xảy ra lỗi khi đăng xuất')
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  padding: 20px;
  color: #fff;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
}

.loading .is-loading {
  font-size: 48px;
}

.game-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.header h1 {
  font-size: 32px;
  font-weight: bold;
  color: #ffd700;
}

.stats-container,
.resources-container,
.actions-container {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stats-container h2,
.resources-container h2,
.actions-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffd700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  color: #aaa;
}

.stat-value {
  color: #fff;
  font-weight: bold;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.button-grid .el-button {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}
</style>
