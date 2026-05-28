<template>
    <div class="main-content">
      <div class="page-header">
        <h1>📂 分类管理</h1>
      </div>
  
      <div class="card">
        <!-- 添加新分类 -->
        <div class="add-category">
          <input
            v-model="newCategory"
            class="form-input"
            type="text"
            placeholder="输入新分类名称"
            @keydown.enter="handleAdd"
          />
          <button class="btn btn-primary" @click="handleAdd">➕ 添加</button>
        </div>
  
        <!-- 分类列表表格 -->
        <div v-if="articleStore.categories.length > 0" class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>分类名称</th>
                <th>文章数量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in articleStore.categories" :key="cat">
                <td>
                  <template v-if="editingCategory === cat">
                    <input
                      v-model="editingName"
                      class="form-input edit-input"
                      @keydown.enter="saveEdit"
                      @keydown.escape="cancelEdit"
                    />
                  </template>
                  <span v-else class="category-tag">{{ cat }}</span>
                </td>
                <td>{{ getArticleCount(cat) }}</td>
                <td>
                  <div class="actions-cell">
                    <template v-if="editingCategory === cat">
                      <button class="btn btn-sm btn-save" @click="saveEdit">✅ 保存</button>
                      <button class="btn btn-sm btn-outline" @click="cancelEdit">取消</button>
                    </template>
                    <template v-else>
                      <button class="btn btn-sm btn-outline" @click="startEdit(cat)">✏️ 编辑</button>
                      <button class="btn btn-sm btn-delete" @click="handleDelete(cat)">🗑 删除</button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">📭</div>
          <p>暂无分类，请添加</p>
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
  
  const newCategory = ref('')
  const editingCategory = ref<string | null>(null)
  const editingName = ref('')
  
  useTitle('分类管理 - 后台')
  
  onMounted(() => {
    articleStore.fetchCategories()
    articleStore.fetchArticles()
  })
  
  function getArticleCount(cat: string) {
    return articleStore.articles.filter((a) => a.category === cat).length
  }
  
  async function handleAdd() {
    const name = newCategory.value.trim()
    if (!name) {
      toastStore.error('请输入分类名称')
      return
    }
    try {
      await articleStore.addCategory(name)
      newCategory.value = ''
      toastStore.success('分类添加成功')
    } catch (e: any) {
      toastStore.error(e.message || '添加失败')
    }
  }
  
  function startEdit(cat: string) {
    editingCategory.value = cat
    editingName.value = cat
  }
  
  async function saveEdit() {
    const newName = editingName.value.trim()
    if (!newName) {
      toastStore.error('分类名称不能为空')
      return
    }
    if (newName === editingCategory.value) {
      cancelEdit()
      return
    }
    try {
      await articleStore.updateCategory(editingCategory.value!, newName)
      toastStore.success('分类更新成功')
      cancelEdit()
    } catch (e: any) {
      toastStore.error(e.message || '更新失败')
    }
  }
  
  function cancelEdit() {
    editingCategory.value = null
    editingName.value = ''
  }
  
  async function handleDelete(cat: string) {
    const count = getArticleCount(cat)
    if (count > 0 && !confirm(`该分类下有 ${count} 篇文章，删除后文章分类将变为空，确定删除？`)) {
      return
    }
    try {
      await articleStore.deleteCategory(cat)
      toastStore.success('分类已删除')
    } catch (e: any) {
      toastStore.error(e.message || '删除失败')
    }
  }
  </script>
  
  <style scoped>
  .main-content {
    max-width: 700px;
    margin: 0 auto;
    padding: 24px 20px;
  }
  .add-category {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .add-category .form-input {
    flex: 1;
    min-width: 200px;
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
  .edit-input {
    width: 150px;
  }
  .actions-cell {
    display: flex;
    gap: 8px;
  }
  .btn-save {
    background: var(--success);
    color: #fff;
  }
  .btn-delete {
    background: transparent;
    color: var(--danger);
    border: 1px solid #fecaca;
  }
  .btn-delete:hover {
    background: #fef2f2;
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