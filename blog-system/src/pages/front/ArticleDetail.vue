<template>
    <div class="main-content">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!article" class="card empty-state">文章不存在</div>
      <div v-else class="card">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <span class="category-tag">{{ article.category }}</span>
          <span>👁 {{ article.views }}</span>
          <span>📅 {{ formatDate(article.createdAt) }}</span>
        </div>
        <hr>
        <div class="md-preview" v-html="renderMarkdown(article.content)"></div>
      </div>
      <button class="btn btn-outline" @click="$router.push('/')">← 返回列表</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useArticleStore } from '@/stores/articles'
  import { renderMarkdown } from '@/utils/markdown'
  import type { Article } from '@/types'
  
  const route = useRoute()
  const articleStore = useArticleStore()
  const article = ref<Article | null>(null)
  const loading = ref(true)
  
  onMounted(async () => {
    try {
      article.value = await articleStore.fetchArticleById(route.params.id as string)
    } catch { article.value = null }
    loading.value = false
  })
  
  function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }
  </script>
  
  <style scoped>
  .main-content { max-width: 800px; margin: 0 auto; padding: 24px 20px; }
  hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .md-preview h1, .md-preview h2 { margin-top: 1em; }
  .md-preview pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; }
  .md-preview blockquote { border-left: 4px solid var(--primary); padding-left: 16px; color: var(--text-secondary); background: #f8fafc; }
  </style>