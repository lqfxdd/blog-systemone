<template>
  <router-view />
  <ToastContainer />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import ToastContainer from '@/components/ToastContainer.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toastStore = useToastStore()
const authStore = useAuthStore()

authStore.checkAuth()

// 监听路由变化，清除上一页面遗留的 Toast
watch(
  () => router.currentRoute.value.fullPath,
  () => {
    toastStore.clearAll()
  }
)
</script>