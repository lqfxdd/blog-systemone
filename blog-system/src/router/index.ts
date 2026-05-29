import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// 前台布局
import BlogLayout from '@/layouts/BlogLayout.vue'
// 后台布局
import AdminLayout from '@/layouts/AdminLayout.vue'

// 前台页面
import HomePage from '@/pages/front/HomePage.vue'
import ArticleDetail from '@/pages/front/ArticleDetail.vue'
import LoginPage from '@/pages/admin/LoginPage.vue'

// 后台页面
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminArticles from '@/pages/admin/AdminArticles.vue'
import ArticleEditor from '@/pages/admin/ArticleEditor.vue'
import AdminCategories from '@/pages/admin/AdminCategories.vue'

const routes = [
  {
    path: '/',
    component: BlogLayout,      // 前台所有页面共用此布局（侧边栏 + 主内容区）
    children: [
      {
        path: '',
        component: HomePage,
        meta: { title: '首页' }
      },
      {
        path: 'article/:id',
        component: ArticleDetail,
        props: true,
        meta: { title: '文章详情' }
      },
      {
        path: 'login',
        component: LoginPage,
        meta: { guest: true, title: '登录' }
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,     // 后台页面共用此布局（侧边导航 + 内容区）
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: AdminDashboard,
        meta: { title: '仪表盘' }
      },
      {
        path: 'articles',
        component: AdminArticles,
        meta: { title: '文章管理' }
      },
      {
        path: 'articles/new',
        component: ArticleEditor,
        meta: { title: '发布文章' }
      },
      {
        path: 'articles/:id/edit',
        component: ArticleEditor,
        props: true,
        meta: { title: '编辑文章' }
      },
      {
        path: 'categories',
        component: AdminCategories,
        meta: { title: '分类管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
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