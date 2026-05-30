<template>
    <div class="blog-layout">
      <BlogSidebar @search="handleSearch" />
      <main class="main-content">
        <div class="content-wrapper">
          <router-view :key="$route.fullPath" />
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import BlogSidebar from '@/components/BlogSidebar.vue'
  import { useArticleStore } from '@/stores/articles'
  
  const articleStore = useArticleStore()
  
  function handleSearch(query: string) {
    articleStore.setSearchQuery(query)
  }
  </script>
  
  <style scoped>
  .blog-layout {
    display: flex;
    min-height: 100vh;
  }
  .main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    background: #fff;
    min-height: 100vh;
  }
  .content-wrapper {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 30px;
  }
  
  /* 移动端：侧边栏变为顶部固定 */
  @media (max-width: 768px) {
    .blog-layout {
      flex-direction: column;
    }
    .main-content {
      margin-left: 0;
      margin-top: 60px; /* 侧边栏移动端高度 */
    }
    .content-wrapper {
      padding: 20px 15px;
    }
  }
  </style>