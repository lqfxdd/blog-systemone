<template>
    <div class="main-content">
      <div class="page-header">
        <h1>{{ isEdit ? '✏️ 编辑文章' : '📝 发布新文章' }}</h1>
      </div>
  
      <div class="card">
        <!-- 标题 -->
        <div class="form-group">
          <label>文章标题 <span class="required">*</span></label>
          <input
            v-model="form.title"
            class="form-input"
            type="text"
            placeholder="输入文章标题..."
          />
        </div>
  
        <!-- 分类 + 标签 -->
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select v-model="form.category" class="form-select">
              <option value="">选择分类...</option>
              <option
                v-for="cat in articleStore.categories"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>标签（逗号分隔）</label>
            <input
              v-model="tagsInput"
              class="form-input"
              type="text"
              placeholder="例如：Vue, TypeScript"
            />
          </div>
        </div>
  
        <!-- 摘要 -->
        <div class="form-group">
          <label>摘要（留空则自动截取正文前 150 字）</label>
          <textarea
            v-model="form.excerpt"
            class="form-textarea"
            rows="2"
            placeholder="文章摘要..."
          ></textarea>
        </div>
  
        <!-- Markdown 编辑器 -->
        <div class="form-group">
          <label>文章内容 <span class="required">*</span>（Markdown）</label>
          <MarkdownEditor v-model="form.content" />
        </div>
  
        <!-- 操作按钮 -->
        <div class="actions">
          <button
            class="btn btn-primary"
            :disabled="saving"
            @click="handleSave"
          >
            {{ saving ? '保存中...' : isEdit ? '💾 更新文章' : '📤 发布文章' }}
          </button>
          <button class="btn btn-outline" @click="$router.push('/admin/articles')">
            取消
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useArticleStore } from '@/stores/articles'
  import { useToastStore } from '@/stores/toast'
  import MarkdownEditor from '@/components/MarkdownEditor.vue'
  import type { Article } from '@/types'
  
  const route = useRoute()
  const router = useRouter()
  const articleStore = useArticleStore()
  const toastStore = useToastStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  const tagsInput = ref('')
  
  const form = reactive<Partial<Article>>({
    title: '',
    content: '',
    category: '',
    excerpt: '',
    tags: [],
  })
  
  onMounted(async () => {
    await articleStore.fetchCategories()
    if (isEdit.value) {
      const article = await articleStore.fetchArticleById(route.params.id as string)
      if (article) {
        form.title = article.title
        form.content = article.content
        form.category = article.category
        form.excerpt = article.excerpt || ''
        tagsInput.value = article.tags?.join(', ') || ''
      }
    }
  })
  
  async function handleSave() {
    if (!form.title?.trim()) {
      toastStore.error('请输入文章标题')
      return
    }
    if (!form.content?.trim()) {
      toastStore.error('请输入文章内容')
      return
    }
  
    saving.value = true
    const data: Partial<Article> = {
      ...form,
      tags: tagsInput.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      excerpt:
        form.excerpt ||
        form.content?.replace(/[#*`>\n]/g, '').substring(0, 150) + '...',
    }
  
    try {
      if (isEdit.value) {
        await articleStore.updateArticle(route.params.id as string, data)
        toastStore.success('文章更新成功')
      } else {
        await articleStore.createArticle(data)
        toastStore.success('文章发布成功')
      }
      router.push('/admin/articles')
    } catch (e: any) {
      toastStore.error(e.message || '保存失败，请重试')
    } finally {
      saving.value = false
    }
  }
  </script>
  
  <style scoped>
  .main-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 20px;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 600px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  .required {
    color: var(--danger);
    margin-left: 2px;
  }
  .actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  </style>