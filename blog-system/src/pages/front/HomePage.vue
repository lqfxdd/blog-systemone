<template>
  <div class="main-content">
    <div class="page-header">
      <h1>📰 文章列表</h1>
      <p>共 {{ articleStore.articles.length }} 篇文章</p>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" class="search-input" placeholder="🔍 搜索文章..." />
    </div>
    <div class="category-filter">
      <button :class="{ active: !selectedCategory }" @click="selectedCategory = ''">全部</button>
      <button v-for="cat in articleStore.categories" :key="cat" :class="{ active: selectedCategory === cat }" @click="selectedCategory = cat">{{ cat }}</button>
    </div>
    <div v-if="articleStore.loading" class="loading">加载中...</div>
    <div v-else-if="filteredArticles.length === 0" class="card empty-state">暂无文章</div>
    <div v-else class="article-list">
      <!-- 修复：使用 article._id || article.id，并传给 goToArticle 时确保非空 -->
      <div v-for="article in filteredArticles" :key="article._id || article.id" class="card article-card" @click="goToArticle((article._id || article.id)!)">
        <h3>{{ article.title }}</h3>
        <p class="article-excerpt" v-if="article.excerpt">{{ article.excerpt }}</p>
        <div class="article-meta">
          <span class="category-tag">{{ article.category }}</span>
          <span>👁 {{ article.views }}</span>
          <span>📅 {{ formatDate(article.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articles'
import { useTitle } from '@vueuse/core'

const articleStore = useArticleStore()
const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('')

useTitle('博客前台')

onMounted(() => {
  articleStore.fetchArticles()
  articleStore.fetchCategories()
})

const filteredArticles = computed(() => {
  let result = articleStore.articles
  if (selectedCategory.value) result = result.filter(a => a.category === selectedCategory.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(q) || a.content?.includes(q))
  }
  return result
})

function goToArticle(id: string) { router.push(`/article/${id}`) }
function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }
</script>

<style scoped>
.main-content { max-width: 1200px; margin: 0 auto; padding: 24px 20px; }
.search-input { flex: 1; padding: 10px 16px; border-radius: 8px; border: 1.5px solid var(--border); }
.category-filter { display: flex; gap: 8px; margin: 16px 0; flex-wrap: wrap; }
.category-filter button { padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--card-bg); cursor: pointer; }
.category-filter button.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.article-list { display: grid; gap: 16px; }
.article-card { cursor: pointer; border-left: 3px solid transparent; }
.article-card:hover { border-left-color: var(--primary); }
.article-excerpt { color: var(--text-secondary); font-size: 0.9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.article-meta { display: flex; gap: 16px; font-size: 0.8rem; color: var(--text-secondary); margin-top: 8px; }
</style>