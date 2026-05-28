<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="logo-icon">B</span>
        <span>博客系统</span>
      </router-link>
      <button v-if="isMobile" class="menu-toggle" @click="toggleMenu">
        {{ menuOpen ? '✕' : '☰' }}
      </button>
      <div class="navbar-links" :class="{ open: menuOpen }">
        <router-link to="/" @click="closeMenu">🏠 首页</router-link>
        <template v-if="authStore.isAuthenticated">
          <router-link to="/admin" @click="closeMenu">📊 仪表盘</router-link>
          <router-link to="/admin/articles" @click="closeMenu">📝 文章管理</router-link>
          <router-link to="/admin/categories" @click="closeMenu">📂 分类管理</router-link>
          <button class="btn-danger-sm" @click="handleLogout">🚪 退出</button>
        </template>
        <template v-else>
          <router-link to="/register" class="btn-outline-sm" @click="closeMenu">📝 注册</router-link>
          <router-link to="/login" class="btn-primary-sm" @click="closeMenu">🔑 登录</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMediaQuery } from '@vueuse/core'

const authStore = useAuthStore()
const router = useRouter()
const isMobile = useMediaQuery('(max-width: 768px)')
const menuOpen = ref(false)

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
function handleLogout() {
  authStore.logout()
  closeMenu()
  router.push('/')
}
</script>

<style scoped>
.navbar { background: var(--card-bg); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; height: 64px; }
.navbar-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 100%; }
.navbar-brand { font-size: 1.4rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 8px; }
.logo-icon { width: 36px; height: 36px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.2rem; }
.navbar-links { display: flex; align-items: center; gap: 8px; list-style: none; }
.navbar-links a, .navbar-links button { text-decoration: none; color: var(--text-secondary); font-weight: 500; padding: 8px 14px; border-radius: 8px; transition: var(--transition); font-size: 0.9rem; }
.navbar-links a:hover, .navbar-links button:hover { background: var(--primary-light); color: var(--primary); }
.menu-toggle { display: none; background: none; border: none; font-size: 1.6rem; cursor: pointer; padding: 4px 8px; color: var(--text); }
.btn-primary-sm { background: var(--primary)!important; color: #fff!important; padding: 8px 16px!important; }
.btn-outline-sm { border: 1.5px solid var(--border)!important; background: transparent!important; color: var(--text-secondary)!important; }
.btn-outline-sm:hover { border-color: var(--primary)!important; color: var(--primary)!important; }
.btn-danger-sm { background: transparent!important; color: var(--danger)!important; border: 1.5px solid transparent!important; }
.btn-danger-sm:hover { background: #fef2f2!important; border-color: #fecaca!important; }
.router-link-active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
@media (max-width: 768px) {
  .navbar-links { display: none; position: absolute; top: 64px; left: 0; right: 0; background: var(--card-bg); flex-direction: column; padding: 12px; border-bottom: 2px solid var(--border); box-shadow: var(--shadow-md); gap: 4px; }
  .navbar-links.open { display: flex; }
  .menu-toggle { display: block; }
}
</style>