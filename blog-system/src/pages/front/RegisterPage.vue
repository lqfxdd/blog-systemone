<template>
    <div class="register-container">
      <div class="card register-card">
        <div class="register-icon">📝</div>
        <h2>用户注册</h2>
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="form.username"
            class="form-input"
            type="text"
            placeholder="请输入用户名"
            @keydown.enter="handleRegister"
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="form.password"
            class="form-input"
            type="password"
            placeholder="请输入密码（至少6位）"
            @keydown.enter="handleRegister"
          />
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input
            v-model="form.confirmPassword"
            class="form-input"
            type="password"
            placeholder="再次输入密码"
            @keydown.enter="handleRegister"
          />
        </div>
        <div class="form-group">
          <label>昵称（选填）</label>
          <input
            v-model="form.nickname"
            class="form-input"
            type="text"
            placeholder="如何称呼你？"
          />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button
          class="btn btn-primary"
          :disabled="loading"
          style="width: 100%; justify-content: center; margin-top: 16px"
          @click="handleRegister"
        >
          {{ loading ? '注册中...' : '📝 注册' }}
        </button>
        <p class="hint">
          已有账号？
          <router-link to="/login">去登录</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useToastStore } from '@/stores/toast'
  import { register } from '@/api/auth'   // 静态导入
  
  const authStore = useAuthStore()
  const toastStore = useToastStore()
  const router = useRouter()
  
  const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  })
  const errorMsg = ref('')
  const loading = ref(false)
  
  async function handleRegister() {
    errorMsg.value = ''
  
    if (!form.username.trim()) {
      errorMsg.value = '请输入用户名'
      return
    }
    if (!form.password) {
      errorMsg.value = '请输入密码'
      return
    }
    if (form.password.length < 6) {
      errorMsg.value = '密码长度至少6位'
      return
    }
    if (form.password !== form.confirmPassword) {
      errorMsg.value = '两次输入的密码不一致'
      return
    }
  
    loading.value = true
    try {
      const data = await register(
        form.username.trim(),
        form.password,
        form.nickname.trim() || undefined
      )
      // 注册成功，自动登录
      authStore.token = data.token
      localStorage.setItem('blog_token', data.token)
      authStore.currentUser = data.user
      toastStore.success('注册成功！已自动登录')
      router.push('/')
    } catch (e: any) {
      errorMsg.value = e.response?.data?.message || e.message || '注册失败，请重试'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    max-width: 420px;
    margin: 60px auto;
    padding: 0 20px;
  }
  .register-card {
    padding: 32px;
    text-align: center;
  }
  .register-icon {
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
  </style>