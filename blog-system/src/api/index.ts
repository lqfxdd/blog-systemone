import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 开发走代理，生产用真实地址
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',   // 强制不缓存
    'Pragma': 'no-cache',          // 兼容 HTTP/1.0
  }
})

// 请求拦截器：自动带上 JWT token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('blog_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理 401 跳转登录页
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('blog_token')
      window.location.hash = '#/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient