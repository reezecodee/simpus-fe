<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 1. Import Layouts kamu
// Pastikan path foldernya bener (layout vs layouts)
import MainLayout from './layouts/MainLayout.vue' 

// Kita butuh layout kosong buat cadangan (misal buat Login nanti)
// Kalau belum ada filenya, bikin dummy component di bawah
import BlankLayout from './layouts/BlankLayout.vue' 

const route = useRoute()

// 2. Logic Milih Layout
// Kalau di router ada meta: { layout: 'blank' }, pakai BlankLayout
// Sisanya pakai MainLayout (yang ada Sidebar-nya)
const layout = computed(() => {
  return route.meta.layout === 'blank' ? BlankLayout : MainLayout
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>