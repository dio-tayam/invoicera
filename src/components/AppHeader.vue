<template>
  <header class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-lg sticky top-0 z-40">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">

        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-3 group select-none">
          <div>
            <div class="text-white font-bold text-xl leading-none tracking-tight">Invoicera</div>
            <div class="text-blue-200 text-xs font-medium leading-none mt-0.5 tracking-wide">Invoice Generator</div>
          </div>
        </RouterLink>

        <!-- Nav -->
        <nav class="flex items-center gap-1">
          <RouterLink
            to="/"
            :class="[
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 select-none',
              $route.path === '/'
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16m-8-8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="hidden sm:inline">New Invoice</span>
            <span class="sm:hidden">New</span>
          </RouterLink>

          <RouterLink
            to="/history"
            :class="[
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 select-none',
              $route.path === '/history'
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>History</span>
            <span
              v-if="invoiceCount > 0"
              class="ml-0.5 bg-blue-500 text-white text-xs font-bold
                     w-5 h-5 rounded-full flex items-center justify-center leading-none"
            >{{ invoiceCount > 99 ? '99+' : invoiceCount }}</span>
          </RouterLink>
        </nav>

      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useInvoices } from '../composables/useInvoices.js'

const { invoices } = useInvoices()
const invoiceCount = computed(() => invoices.value.length)
</script>
