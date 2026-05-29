<template>
  <div class="editor-wrapper">
    <MdEditor
      v-model="content"
      :language="'zh-CN'"
      :toolbars="toolbars"
      :preview="true"
      :onUploadImg="handleUploadImg"
      style="height: 450px;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue)
watch(() => props.modelValue, (val) => { content.value = val })
watch(content, (val) => emit('update:modelValue', val))

const toolbars: any = [
  'bold', 'italic', 'strikeThrough', 'title', 'sub', 'sup', 'quote',
  'unorderedList', 'orderedList', 'code', 'link', 'image', 'table', 'preview'
]

/**
 * 图片上传回调
 * files: File[] 选择的文件数组
 * callback: (urls: string[]) => void  传入图片链接数组即可插入
 */
async function handleUploadImg(files: File[], callback: (urls: string[]) => void) {
  const urls: string[] = []
  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('image', file)

      // 使用 Imgur 免费 API（无需注册，但可能有限制）
      const res = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 546c25a59c58ad7', // 这是官方提供的免费 Client ID，用于上传
        },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        urls.push(data.data.link)
      } else {
        console.error('Imgur 上传失败', data)
      }
    } catch (err) {
      console.error('上传图片出错', err)
    }
  }
  callback(urls)
}
</script>

<style scoped>
.editor-wrapper { border-radius: 8px; overflow: hidden; }
</style>