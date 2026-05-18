<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="border-t border-slate-200 bg-white mt-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400">
        © {{ year }} Invoicera — Invoice Generator. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const year = computed(() => new Date().getFullYear())
</script>
