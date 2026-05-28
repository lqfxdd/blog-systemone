import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './styles/global.css'   // 稍后创建

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')