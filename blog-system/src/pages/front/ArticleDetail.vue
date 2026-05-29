<template>
  <div class="article-detail">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!article" class="empty-state">文章不存在</div>
    <div v-else>
      <article class="content-card">
        <h1>{{ article.title }}</h1>
        <div class="meta">
          <span class="category-tag">{{ article.category }}</span>
          <span>👁 {{ article.views }}</span>
          <span>📅 {{ formatDate(article.createdAt) }}</span>
        </div>
        <hr />
        <div class="md-body" v-html="renderMarkdown(article.content)"></div>
      </article>
      <button class="back-btn" @click="$router.push('/')">← 返回首页</button>
    </div>
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
.article-detail { max-width: 750px; margin: 0 auto; }
.loading, .empty-state { text-align: center; padding: 60px 0; }
.content-card {
  background: #fff;
  border-radius: var(--radius);
  padding: 40px;
  box-shadow: var(--shadow);
}
h1 { font-size: 2rem; margin-bottom: 15px; }
.meta { display: flex; gap: 15px; color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px; align-items: center; }
.category-tag {
  background: rgba(161,140,209,0.15);
  color: var(--primary-light);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}
hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
.back-btn {
  margin-top: 30px;
  background: none;
  color: var(--primary);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
}
</style>