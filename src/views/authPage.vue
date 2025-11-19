<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">{{ isLogin ? '登录' : '注册' }}</h1>
        <p class="auth-subtitle">修仙之路，从此开始</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="auth-form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="道友名号"
            size="large"
            prefix-icon="User"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item v-if="!isLogin" prop="email">
          <el-input
            v-model="form.email"
            placeholder="传音玉简(Email)"
            size="large"
            type="email"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="心法口诀"
            size="large"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item v-if="!isLogin" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            placeholder="确认心法口诀"
            size="large"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="auth-submit"
          :loading="loading"
          native-type="submit"
          @click="handleSubmit"
        >
          {{ isLogin ? '踏入仙途' : '开启修仙' }}
        </el-button>
      </el-form>

      <div class="auth-footer">
        <el-button
          type="text"
          @click="toggleMode"
        >
          {{ isLogin ? '还未踏入仙途？立即注册' : '已有仙缘？返回登录' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Message } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const formRef = ref(null);

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入心法口诀'));
  } else if (value !== form.password) {
    callback(new Error('两次输入的心法口诀不一致'));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    { required: true, message: '请输入道友名号', trigger: 'blur' },
    { min: 3, max: 20, message: '名号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入传音玉简', trigger: 'blur' },
    { type: 'email', message: '请输入正确的传音玉简格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入心法口诀', trigger: 'blur' },
    { min: 6, message: '心法口诀至少 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  formRef.value?.resetFields();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;

    if (isLogin.value) {
      await authStore.login({
        username: form.username,
        password: form.password
      });
      ElMessage.success('登录成功！欢迎回来');
    } else {
      await authStore.register({
        username: form.username,
        email: form.email,
        password: form.password
      });
      ElMessage.success('注册成功！修仙之路已开启');
    }

    router.push('/home');
  } catch (error) {
    ElMessage.error(error.message || '操作失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-title {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.auth-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.auth-form {
  margin-top: 20px;
}

.auth-submit {
  width: 100%;
  margin-top: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 16px;
  font-weight: 600;
  height: 44px;
}

.auth-submit:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
