<template>
  <div class="login-container">
    <div class="card login-card">
      <div class="login-icon">🔐</div>
      <h2>后台登录</h2>
      <div class="form-group">
        <label>用户名</label>
        <input
          v-model="username"
          class="form-input"
          type="text"
          placeholder="请输入用户名"
          autocomplete="username"
          @keydown.enter="handleLogin"
        />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input
          v-model="password"
          class="form-input"
          type="password"
          placeholder="请输入密码"
          autocomplete="current-password"
          @keydown.enter="handleLogin"
        />
      </div>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      
      <!-- 按钮组：登录 + 首页 -->
      <div class="button-group">
        <button
          class="btn btn-primary"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '🔑 登录' }}
        </button>
        <button class="btn btn-outline" @click="$router.push('/')">
          🏠 首页
        </button>
      </div>

      <p class="hint">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  try {
    await authStore.login(username.value.trim(), password.value)
    toastStore.success('登录成功')
    router.push('/admin')
  } catch (e: any) {
    errorMsg.value = e.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 60px auto;
  padding: 0 20px;
}
.login-card {
  padding: 32px;
  text-align: center;
}
.login-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
.form-group {
  margin-bottom: 18px;
  text-align: left;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.9rem;
}
.error-msg {
  color: var(--danger);
  font-size: 0.85rem;
  text-align: left;
  margin-top: -8px;
}
.hint {
  margin-top: 20px;
  font-size: 0.8rem;
  color: #94a3b8;
}
.hint a {
  color: var(--primary);
  font-weight: 500;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.button-group .btn {
  flex: 1;
  justify-content: center;
}
</style>