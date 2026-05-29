<template>
    <aside class="sidebar" :class="{ open: mobileMenuOpen }">
      <div class="sidebar-inner">
        <!-- 头像区域 -->
        <div class="profile">
          <div class="avatar-wrapper">
            <img src="/avatar.png" alt="头像" class="avatar" @error="onImgError" />
          </div>
          <h2 class="nickname">两栖</h2>
          <p class="bio">hellohello</p>
        </div>
  
        <!-- 欢迎语（上移至这里） -->
        <div class="welcome-msg">
          <p>🌼 欢迎光临</p>
        </div>
  
        <!-- 并排按钮：首页 + 登录/退出 -->
        <div class="auth-link">
          <router-link to="/" class="auth-btn home-btn">🏠 首页</router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/login" class="auth-btn login-btn">🔑 登录</router-link>
          <button v-else class="auth-btn logout-btn" @click="handleLogout">🚪 退出</button>
        </div>
  
        <!-- 搜索框（带图标） -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="localSearch"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @input="performSearch"
          />
        </div>
  
        <!-- 搜索结果列表（搜索框下方） -->
        <div v-if="searchResults.length > 0" class="search-results">
          <div
            v-for="article in searchResults"
            :key="article._id || article.id"
            class="search-item"
            @click="goToArticle(article._id || article.id)"
          >
            <span class="item-title">{{ article.title }}</span>
            <span class="item-date">{{ formatDate(article.createdAt) }}</span>
          </div>
        </div>
        <div v-else-if="localSearch.trim() && searchResults.length === 0" class="search-no-result">
          没有找到相关文章
        </div>
      </div>
  
      <!-- 移动端汉堡按钮 -->
      <button class="mobile-toggle" @click="toggleMobileMenu">
        <span v-if="!mobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useArticleStore } from '@/stores/articles'
  
  const authStore = useAuthStore()
  const articleStore = useArticleStore()
  const router = useRouter()
  const localSearch = ref('')
  const mobileMenuOpen = ref(false)
  
  // 主动拉取文章数据，确保搜索时有数据
  onMounted(() => {
    articleStore.fetchArticles()
  })
  
  const searchResults = computed(() => {
    const q = localSearch.value.trim().toLowerCase()
    if (!q) return []
    return articleStore.articles
      .filter(article =>
        article.title.toLowerCase().includes(q) ||
        article.content?.toLowerCase().includes(q) ||
        article.tags?.some(tag => tag.toLowerCase().includes(q))
      )
      .slice(0, 10) // 最多显示10条
  })
  
  function goToArticle(id: string | undefined) {
    if (id) {
      router.push(`/article/${id}`)
      localSearch.value = '' // 清空搜索，让结果消失
    }
  }
  
  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
  
  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }
  
  function handleLogout() {
    authStore.logout()
    router.push('/')
  }
  
  function onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23ff9a9e"/><text x="50" y="65" font-size="40" text-anchor="middle" fill="white">🐻</text></svg>'
  }
  </script>
  
  <style scoped>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--sidebar-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-right: 1px solid rgba(255,255,255,0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    color: #fff;
    z-index: 100;
    transition: transform 0.3s ease;
  }
  .sidebar-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    width: 100%;
  }
  .profile {
    text-align: center;
  }
  .avatar-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 15px;
    border: 3px solid rgba(255,255,255,0.8);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .nickname {
    font-size: 1.6rem;
    font-weight: 700;
    text-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .bio {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: 5px;
  }
  
  /* 欢迎语 */
  .welcome-msg {
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.9;
    line-height: 1.6;
    margin: 0;
  }
  
  /* 按钮组 */
  .auth-link {
    display: flex;
    gap: 10px;
    width: 100%;
  }
  .auth-btn {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: background 0.3s;
    backdrop-filter: blur(5px);
    color: #fff;
    text-decoration: none;
    background: rgba(255,255,255,0.2);
    border: none;
    cursor: pointer;
  }
  .auth-btn:hover {
    background: rgba(255,255,255,0.4);
  }
  
  /* 搜索框 */
  .search-box {
    position: relative;
    width: 100%;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border-radius: 30px;
    border: none;
    background: rgba(255,255,255,0.3);
    backdrop-filter: blur(5px);
    color: #fff;
    font-size: 0.9rem;
    outline: none;
    transition: background 0.3s;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.7); }
  .search-input:focus { background: rgba(255,255,255,0.5); }
  
  /* 搜索结果 */
  .search-results {
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 8px;
    margin-top: -10px; /* 紧贴搜索框 */
  }
  .search-item {
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    color: #fff;
    font-size: 0.85rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;
  }
  .search-item:hover {
    background: rgba(255,255,255,0.3);
  }
  .item-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    margin-right: 10px;
  }
  .item-date {
    font-size: 0.75rem;
    opacity: 0.8;
    white-space: nowrap;
  }
  .search-no-result {
    width: 100%;
    text-align: center;
    color: rgba(255,255,255,0.8);
    font-size: 0.85rem;
    padding: 10px;
  }
  
  /* 移动端保持不变 */
  .mobile-toggle {
    display: none;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 110;
    background: var(--primary);
    color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: 60px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background: var(--sidebar-bg);
      backdrop-filter: blur(12px);
      transform: translateY(0);
    }
    .sidebar .profile, .sidebar .welcome-msg, .sidebar .search-box, .sidebar .auth-link, .sidebar .search-results {
      display: none;
    }
    .sidebar.open {
      height: 100vh;
      flex-direction: column;
      justify-content: center;
    }
    .sidebar.open .profile,
    .sidebar.open .welcome-msg,
    .sidebar.open .search-box,
    .sidebar.open .auth-link,
    .sidebar.open .search-results { display: flex; }
    .mobile-toggle { display: flex; align-items: center; justify-content: center; }
  }
  </style>