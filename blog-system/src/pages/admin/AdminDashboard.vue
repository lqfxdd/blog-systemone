<template>
    <div class="main-content">
      <div class="page-header">
        <h1>📊 后台仪表盘</h1>
        <p>欢迎回来，{{ authStore.currentUser?.nickname || '管理员' }}</p>
      </div>
  
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-value">{{ articleStore.articles.length }}</div>
          <div class="stat-label">文章总数</div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon">📂</div>
          <div class="stat-value">{{ articleStore.categories.length }}</div>
          <div class="stat-label">分类数量</div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon">👁</div>
          <div class="stat-value">{{ totalViews }}</div>
          <div class="stat-label">总阅读量</div>
        </div>
      </div>
  
      <!-- 快捷操作 -->
      <div class="quick-actions">
        <button class="btn btn-primary" @click="$router.push('/admin/articles')">
          📝 管理文章
        </button>
        <button class="btn btn-outline" @click="$router.push('/admin/articles/new')">
          ➕ 发布新文章
        </button>
        <button class="btn btn-outline" @click="$router.push('/admin/categories')">
          📂 管理分类
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useArticleStore } from '@/stores/articles'
  import { useAuthStore } from '@/stores/auth'
  import { useTitle } from '@vueuse/core'
  
  const articleStore = useArticleStore()
  const authStore = useAuthStore()
  
  useTitle('仪表盘 - 后台管理')
  
  onMounted(() => {
    articleStore.fetchArticles()
    articleStore.fetchCategories()
  })
  
  const totalViews = computed(() =>
    articleStore.articles.reduce((sum, a) => sum + (a.views || 0), 0)
  )
  </script>
  
  <style scoped>
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 20px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    text-align: center;
    padding: 28px 20px;
  }
  .stat-icon {
    font-size: 2.2rem;
    margin-bottom: 8px;
  }
  .stat-value {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--primary);
  }
  .stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  .quick-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  </style>