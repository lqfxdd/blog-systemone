import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as articleApi from '@/api/articles'
import * as categoryApi from '@/api/categories'
import type { Article } from '@/types'

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const categories = ref<string[]>([])
  const loading = ref(false)
  const currentArticle = ref<Article | null>(null)

  // 全局搜索与分类筛选状态
  const searchQuery = ref('')
  const selectedCategory = ref('')

  // 获取文章列表（默认取全部，或根据参数筛选）
  async function fetchArticles(params?: Record<string, any>) {
    loading.value = true
    try {
      const res = await articleApi.getArticles({ limit: 1000, ...params })
      articles.value = res.articles || []
    } finally {
      loading.value = false
    }
  }

  // 获取单篇文章
  async function fetchArticleById(id: string) {
    loading.value = true
    try {
      currentArticle.value = await articleApi.getArticleById(id)
      return currentArticle.value
    } finally {
      loading.value = false
    }
  }

  // 创建文章
  async function createArticle(data: Partial<Article>) {
    const article = await articleApi.createArticle(data)
    articles.value.unshift(article)
    return article
  }

  // 更新文章
  async function updateArticle(id: string, data: Partial<Article>) {
    const updated = await articleApi.updateArticle(id, data)
    const index = articles.value.findIndex(
      a => (a._id || a.id) === id
    )
    if (index !== -1) articles.value[index] = updated
    if ((currentArticle.value?._id || currentArticle.value?.id) === id) {
      currentArticle.value = updated
    }
    return updated
  }

  // 删除文章
  async function deleteArticle(id: string) {
    await articleApi.deleteArticle(id)
    articles.value = articles.value.filter(
      a => (a._id || a.id) !== id
    )
  }

  // 获取分类列表
  async function fetchCategories() {
    categories.value = await categoryApi.getCategories()
  }

  // 添加分类
  async function addCategory(name: string) {
    categories.value = await categoryApi.addCategory(name)
  }

  // 更新分类
  async function updateCategory(oldName: string, newName: string) {
    categories.value = await categoryApi.updateCategory(oldName, newName)
    // 同时更新本地缓存的文章分类
    articles.value.forEach(a => {
      if (a.category === oldName) a.category = newName
    })
  }

  // 删除分类
  async function deleteCategory(name: string) {
    categories.value = await categoryApi.deleteCategory(name)
  }

  // 设置搜索关键词
  function setSearchQuery(q: string) { searchQuery.value = q }
  // 设置当前选中的分类
  function setSelectedCategory(cat: string) { selectedCategory.value = cat }

  return {
    articles,
    categories,
    loading,
    currentArticle,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    fetchArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
})