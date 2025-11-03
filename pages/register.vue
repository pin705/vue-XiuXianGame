<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Đăng Ký</h1>
      <p class="register-subtitle">Bắt đầu hành trình tu tiên của bạn!</p>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="Tên người dùng"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="Email"
            size="large"
            prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Mật khẩu"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleRegister"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="register-button"
            @click="handleRegister"
          >
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span>Đã có tài khoản?</span>
        <nuxt-link to="/login" class="login-link">
          Đăng nhập ngay
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
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Vui lòng xác nhận mật khẩu'))
  } else if (value !== registerForm.password) {
    callback(new Error('Mật khẩu không khớp'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: 'Vui lòng nhập tên người dùng', trigger: 'blur' },
    { min: 3, max: 20, message: 'Tên người dùng phải từ 3-20 ký tự', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const { data, error } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        },
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Đăng ký thất bại')
      }

      ElMessage.success(data.value?.message || 'Đăng ký thành công!')
      
      // Redirect to login page
      await navigateTo('/login')
    } catch (err: any) {
      ElMessage.error(err.message || 'Đã xảy ra lỗi khi đăng ký')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
}

.register-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.register-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.register-form {
  margin-bottom: 16px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.register-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #667eea;
  margin-left: 8px;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
