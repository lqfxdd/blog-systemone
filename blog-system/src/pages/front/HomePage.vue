<template>
  <div class="home">
    <!-- 顶部导航标签栏 -->
    <div class="tabs">
      <button
        :class="{ active: articleStore.selectedCategory === '' }"
        @click="articleStore.setSelectedCategory('')"
      >
        🌟 近期发布
      </button>
      <button
        v-for="cat in articleStore.categories"
        :key="cat"
        :class="{ active: articleStore.selectedCategory === cat }"
        @click="articleStore.setSelectedCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 文章列表 -->
    <div v-if="articleStore.loading" class="loading">加载中...</div>
    <div v-else-if="filteredArticles.length === 0" class="empty-state">
      <p>📭 这里还没有文章</p>
    </div>
    <div v-else class="article-list">
      <article
        v-for="article in filteredArticles"
        :key="article._id || article.id"
        class="article-card"
        @click="goToArticle((article._id || article.id)!)"
      >
        <div class="card-header">
          <span class="category-tag">{{ article.category || '未分类' }}</span>
          <span class="date">{{ formatDate(article.createdAt) }}</span>
        </div>
        <h2 class="title">{{ article.title }}</h2>
        <p class="excerpt">{{ article.excerpt || article.content?.replace(/[#*`\n]/g, '').slice(0, 150) }}</p>
        <div class="card-footer">
          <span>👁 {{ article.views || 0 }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articles'

const articleStore = useArticleStore()
const router = useRouter()

onMounted(() => {
  articleStore.fetchArticles()
  articleStore.fetchCategories()
})

// 只根据分类筛选，不再使用 searchQuery
const filteredArticles = computed(() => {
  let result = articleStore.articles
  const cat = articleStore.selectedCategory
  if (cat) result = result.filter(a => a.category === cat)
  // 按创建时间倒序排列
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function goToArticle(id: string) { router.push(`/article/${id}`) }
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.home { padding-top: 10px; }
.tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 15px;
}
.tabs button {
  padding: 6px 18px;
  border-radius: 20px;
  background: #f1f2f6;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s;
}
.tabs button.active {
  background: linear-gradient(135deg, #ff9a9e, #a18cd1);
  color: #fff;
  box-shadow: 0 4px 10px rgba(255,154,158,0.3);
}
.article-list { display: flex; flex-direction: column; gap: 20px; }
.article-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 25px;
  box-shadow: var(--shadow);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid transparent;
}
.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(161,140,209,0.3);
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.category-tag {
  background: rgba(161,140,209,0.15);
  color: var(--primary-light);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}
.date { color: var(--text-secondary); font-size: 0.85rem; }
.title { font-size: 1.4rem; font-weight: 700; margin-bottom: 10px; color: var(--text); }
.excerpt { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 15px; line-height: 1.6; }
.card-footer { display: flex; justify-content: flex-end; color: var(--text-secondary); font-size: 0.85rem; }
.loading, .empty-state { text-align: center; padding: 60px 0; color: var(--text-secondary); }
</style>