<template>
    <div class="editor-wrapper">
      <MdEditor
        v-model="content"
        :language="'zh-CN'"
        :toolbars="toolbars"
        :preview="true"
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
  
  const toolbars = [
    'bold', 'italic', 'strikeThrough', 'title', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList',
    'code', 'link', 'image', 'table', 'preview'
  ]
  </script>
  
  <style scoped>
  .editor-wrapper { border-radius: 8px; overflow: hidden; }
  </style>