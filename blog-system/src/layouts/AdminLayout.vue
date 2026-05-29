<template>
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <router-link to="/" class="brand">📝 后台管理</router-link>
        </div>
        <nav class="sidebar-nav">
          <router-link to="/admin" exact-active-class="active" class="nav-item">
            📊 仪表盘
          </router-link>
          <router-link to="/admin/articles" active-class="active" class="nav-item">
            📄 文章管理
          </router-link>
          <router-link to="/admin/categories" active-class="active" class="nav-item">
            📂 分类管理
          </router-link>
          <router-link to="/admin/articles/new" active-class="active" class="nav-item">
            ➕ 发布新文章
          </router-link>
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item" @click="handleLogout">🚪 退出</button>
        </div>
      </aside>
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  function handleLogout() {
    authStore.logout()
    router.push('/')
  }
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: #f5f6fa;
  }
  .admin-sidebar {
    width: 220px;
    background: #2d3436;
    color: #dfe6e9;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
  }
  .sidebar-header {
    padding: 0 20px 20px;
    border-bottom: 1px solid #636e72;
    margin-bottom: 20px;
  }
  .brand {
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
  }
  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .nav-item {
    display: block;
    padding: 10px 20px;
    color: #b2bec3;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
    border: none;
    background: none;
    text-align: left;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .nav-item:hover {
    background: #636e72;
    color: #fff;
  }
  .nav-item.active {
    background: #0984e3;
    color: #fff;
    font-weight: 600;
  }
  .sidebar-footer {
    border-top: 1px solid #636e72;
    padding-top: 10px;
    margin-top: 20px;
  }
  .admin-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
  }
  /* 移动端适配：侧边栏折叠到顶部 */
  @media (max-width: 768px) {
    .admin-layout {
      flex-direction: column;
    }
    .admin-sidebar {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding: 10px;
      gap: 10px;
    }
    .sidebar-header { border-bottom: none; margin-bottom: 0; padding: 0; }
    .sidebar-nav { flex-direction: row; flex-wrap: wrap; gap: 0; }
    .nav-item { padding: 6px 12px; font-size: 0.85rem; }
    .sidebar-footer { margin-top: 0; border-top: none; }
    .admin-content { padding: 20px; }
  }
  </style>