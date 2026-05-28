import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '@/pages/front/HomePage.vue'
import ArticleDetail from '@/pages/front/ArticleDetail.vue'
import LoginPage from '@/pages/admin/LoginPage.vue'
import RegisterPage from '@/pages/front/RegisterPage.vue'   // 新增
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminArticles from '@/pages/admin/AdminArticles.vue'
import ArticleEditor from '@/pages/admin/ArticleEditor.vue'
import AdminCategories from '@/pages/admin/AdminCategories.vue'

const routes = [
  { path: '/', component: HomePage, meta: { title: '首页' } },
  { path: '/article/:id', component: ArticleDetail, props: true },
  { path: '/login', component: LoginPage, meta: { guest: true } },
  { path: '/register', component: RegisterPage, meta: { guest: true } },   // 新增
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/articles', component: AdminArticles, meta: { requiresAuth: true } },
  { path: '/admin/articles/new', component: ArticleEditor, meta: { requiresAuth: true } },
  { path: '/admin/articles/:id/edit', component: ArticleEditor, props: true, meta: { requiresAuth: true } },
  { path: '/admin/categories', component: AdminCategories, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/admin')
  } else {
    next()
  }
})

export default router