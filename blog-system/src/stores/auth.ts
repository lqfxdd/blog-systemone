import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, getCurrentUser } from '@/api/auth'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('blog_token') || '')
  const currentUser = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)

  // 应用启动时尝试恢复登录态
  async function checkAuth() {
    if (!token.value) return false
    try {
      const user = await getCurrentUser()
      currentUser.value = user
      return true
    } catch {
      logout()
      return false
    }
  }

  async function login(username: string, password: string) {
    const data = await apiLogin(username, password)
    token.value = data.token
    localStorage.setItem('blog_token', data.token)
    currentUser.value = data.user
  }

  function logout() {
    token.value = ''
    currentUser.value = null
    localStorage.removeItem('blog_token')
  }

  return { token, currentUser, isAuthenticated, login, logout, checkAuth }
})