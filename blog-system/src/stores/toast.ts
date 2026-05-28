import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let idCounter = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function addToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = ++idCounter
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), duration)
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg: string) => addToast(msg, 'success')
  const error = (msg: string) => addToast(msg, 'error')
  const info = (msg: string) => addToast(msg, 'info')

  return { toasts, addToast, removeToast, success, error, info }
})