<template>
    <div class="main-content">
      <div class="page-header">
        <div class="header-row">
          <h1>📝 文章管理</h1>
          <button class="btn btn-primary" @click="$router.push('/admin/articles/new')">
            ➕ 发布新文章
          </button>
        </div>
      </div>
  
      <!-- 加载状态 -->
      <div v-if="articleStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
  
      <!-- 空状态 -->
      <div v-else-if="articleStore.articles.length === 0" class="card empty-state">
        <div class="empty-icon">📭</div>
        <p>还没有文章，快去发布第一篇吧</p>
      </div>
  
      <!-- 文章表格 -->
      <div v-else class="card" style="padding: 0; overflow: hidden">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>标题</th>
                <th>分类</th>
                <th>阅读</th>
                <th>发布日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in articleStore.articles" :key="article.id">
                <td class="title-cell">{{ article.title }}</td>
                <td>
                  <span class="category-tag">{{ article.category || '未分类' }}</span>
                </td>
                <td>{{ article.views || 0 }}</td>
                <td>{{ formatDate(article.createdAt) }}</td>
                <td>
                  <div class="actions-cell">
                    <button
                      class="btn btn-sm btn-outline"
                      @click="$router.push(`/admin/articles/${article.id}/edit`)"
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      class="btn btn-sm"
                      :class="deleteConfirmId === article.id ? 'btn-delete-confirm' : 'btn-delete'"
                      @click="handleDelete(article.id)"
                    >
                      {{ deleteConfirmId === article.id ? '⚠️ 确认删除' : '🗑 删除' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useArticleStore } from '@/stores/articles'
  import { useToastStore } from '@/stores/toast'
  import { useTitle } from '@vueuse/core'
  
  const articleStore = useArticleStore()
  const toastStore = useToastStore()
  const deleteConfirmId = ref<string | null>(null)
  
  useTitle('文章管理 - 后台')
  
  onMounted(() => {
    articleStore.fetchArticles()
  })
  
  async function handleDelete(id: string) {
    if (deleteConfirmId.value === id) {
      try {
        await articleStore.deleteArticle(id)
        toastStore.success('文章已删除')
        deleteConfirmId.value = null
      } catch {
        toastStore.error('删除失败')
      }
    } else {
      deleteConfirmId.value = id
      // 4秒后自动取消确认状态
      setTimeout(() => {
        if (deleteConfirmId.value === id) deleteConfirmId.value = null
      }, 4000)
    }
  }
  
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }
  </script>
  
  <style scoped>
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 20px;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .loading-state {
    text-align: center;
    padding: 60px 0;
    color: var(--text-secondary);
  }
  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .table-wrapper {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  th {
    background: #f8fafc;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
  }
  tr:hover td {
    background: #fafbfc;
  }
  .title-cell {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .actions-cell {
    display: flex;
    gap: 8px;
  }
  .btn-delete {
    background: transparent !important;
    color: var(--danger) !important;
    border: 1px solid #fecaca !important;
  }
  .btn-delete:hover {
    background: #fef2f2 !important;
  }
  .btn-delete-confirm {
    background: var(--danger) !important;
    color: #fff !important;
  }
  .empty-state {
    text-align: center;
    padding: 40px;
  }
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }
  </style>