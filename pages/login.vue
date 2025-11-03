<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Đăng Nhập</h1>
      <p class="login-subtitle">Tu tiên bằng chữ nghĩa, toàn là nhờ spam thôi!</p>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="Tên người dùng"
            size="large"
            prefix-icon="User"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Mật khẩu"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>Chưa có tài khoản?</span>
        <nuxt-link to="/register" class="register-link">
          Đăng ký ngay
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const loginRules: FormRules = {
  username: [
    { required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' },
    { min: 3, max: 20, message: 'Tên người dùng phải từ 3-20 ký tự', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const { data, error } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: loginForm.username,
          password: loginForm.password,
        },
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Đăng nhập thất bại')
      }

      ElMessage.success(data.value?.message || 'Đăng nhập thành công!')
      
      // Redirect to home page
      await navigateTo('/')
    } catch (err: any) {
      ElMessage.error(err.message || 'Đã xảy ra lỗi khi đăng nhập')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
}

.login-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.login-form {
  margin-bottom: 16px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.login-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register-link {
  color: #667eea;
  margin-left: 8px;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
