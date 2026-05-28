<template>
    <div class="app-container">
      <Navbar />
      <router-view />
      <ToastContainer />
    </div>
  </template>
  
  <script setup lang="ts">
  import Navbar from '@/components/Navbar.vue'
  import ToastContainer from '@/components/ToastContainer.vue'
  
  </script>
  
  <style>
  .app-container { min-height: 100vh; display: flex; flex-direction: column; }
  </style>