<template>
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]" @click="removeToast(toast.id)">
        {{ toast.message }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useToastStore } from '@/stores/toast'
  const toastStore = useToastStore()
  const { toasts, removeToast } = toastStore
  </script>
  
  <style scoped>
  .toast-container { position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
  .toast { padding: 12px 20px; border-radius: 8px; color: #fff; font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideIn 0.3s; pointer-events: auto; cursor: pointer; max-width: 380px; }
  .toast.success { background: var(--success); }
  .toast.error { background: var(--danger); }
  .toast.info { background: var(--primary); }
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  </style>