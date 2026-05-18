<template>
  <div class="bg-white min-h-full">

    <!-- Header -->
    <div class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-5 sm:px-10 py-7 sm:py-9">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

        <!-- Brand + Sender -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Invoicera</span>
          </div>
          <div class="text-blue-200 text-xs font-medium tracking-wide mb-4">Invoice Generator</div>

          <div v-if="data.sender?.businessName">
            <div class="text-sm sm:text-base font-bold text-white">{{ data.sender.businessName }}</div>
            <div v-if="data.sender.address" class="text-blue-200 text-xs sm:text-sm mt-1.5 whitespace-pre-line leading-relaxed">{{ data.sender.address }}</div>
            <div v-if="data.sender.email" class="text-blue-200 text-xs sm:text-sm mt-1">{{ data.sender.email }}</div>
            <div v-if="senderPhone" class="text-blue-200 text-xs sm:text-sm mt-0.5">{{ senderPhone }}</div>
          </div>
        </div>

        <!-- Invoice Meta -->
        <div class="flex-shrink-0 sm:text-right">
          <div class="text-2xl sm:text-3xl font-black text-white tracking-widest mb-3">INVOICE</div>
          <div class="space-y-2">
            <div class="flex sm:justify-end items-center gap-3">
              <span class="text-xs text-blue-300 uppercase tracking-wider font-semibold w-14 sm:w-auto">Number</span>
              <span class="text-sm font-bold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-lg">{{ data.invoiceNumber }}</span>
            </div>
            <div class="flex sm:justify-end items-center gap-3">
              <span class="text-xs text-blue-300 uppercase tracking-wider font-semibold w-14 sm:w-auto">Date</span>
              <span class="text-xs sm:text-sm text-blue-100">{{ formatDate(data.invoiceDate) }}</span>
            </div>
            <div v-if="data.dueDate" class="flex sm:justify-end items-center gap-3">
              <span class="text-xs text-blue-300 uppercase tracking-wider font-semibold w-14 sm:w-auto">Due</span>
              <span class="text-xs sm:text-sm text-blue-100">{{ formatDate(data.dueDate) }}</span>
            </div>
            <div v-if="data.currency" class="flex sm:justify-end items-center gap-3 pt-1">
              <span class="text-xs text-blue-300 uppercase tracking-wider font-semibold w-14 sm:w-auto">Currency</span>
              <span class="text-xs font-bold text-white bg-blue-600/60 px-2 py-0.5 rounded-md">{{ data.currency }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Body -->
    <div class="px-5 sm:px-10 py-6 sm:py-8">

      <!-- Bill To -->
      <div class="mb-6">
        <div class="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2.5">Bill To</div>
        <div class="bg-slate-50 rounded-xl p-4 border-l-[3px] border-blue-500">
          <div class="font-bold text-slate-900 text-sm sm:text-base">{{ data.client?.name }}</div>
          <div v-if="data.client?.address" class="text-slate-500 text-xs sm:text-sm mt-1.5 whitespace-pre-line leading-relaxed">{{ data.client.address }}</div>
          <div v-if="data.client?.email" class="text-slate-500 text-xs sm:text-sm mt-1">{{ data.client.email }}</div>
        </div>
      </div>

      <!-- Line Items -->
      <div class="mb-6">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Items</div>
        <div class="overflow-x-auto rounded-xl border border-slate-100">
          <table class="w-full min-w-[400px]">
            <thead>
              <tr class="bg-blue-700">
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-white uppercase tracking-wide">Description</th>
                <th class="text-center px-3 py-2.5 text-xs font-semibold text-white uppercase tracking-wide w-14">Qty</th>
                <th class="text-right px-3 py-2.5 text-xs font-semibold text-white uppercase tracking-wide w-24">Unit Price</th>
                <th class="text-right px-4 py-2.5 text-xs font-semibold text-white uppercase tracking-wide w-24">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(item, i) in data.lineItems" :key="i" :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'">
                <td class="px-4 py-3 text-xs sm:text-sm text-slate-700 break-words">{{ item.description || '—' }}</td>
                <td class="px-3 py-3 text-xs sm:text-sm text-slate-500 text-center whitespace-nowrap">{{ item.quantity }}</td>
                <td class="px-3 py-3 text-xs sm:text-sm text-slate-500 text-right break-all">{{ formatCurrency(item.unitPrice, data.currency) }}</td>
                <td class="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 text-right break-all">{{ formatCurrency(item.quantity * item.unitPrice, data.currency) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Totals -->
      <div class="flex justify-end mb-6">
        <div class="w-full sm:w-72 space-y-1.5">
          <div class="flex justify-between items-start gap-4 py-2 border-b border-slate-100">
            <span class="text-sm text-slate-500 flex-shrink-0">Subtotal</span>
            <span class="text-sm font-semibold text-slate-700 text-right break-all min-w-0">{{ formatCurrency(data.subtotal, data.currency) }}</span>
          </div>
          <div v-if="data.taxRate > 0" class="flex justify-between items-start gap-4 py-2 border-b border-slate-100">
            <span class="text-sm text-slate-500 flex-shrink-0 whitespace-nowrap">Tax ({{ data.taxRate }}%)</span>
            <span class="text-sm font-semibold text-slate-700 text-right break-all min-w-0">{{ formatCurrency(data.taxAmount, data.currency) }}</span>
          </div>
          <div class="bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-xl px-4 py-4 mt-1">
            <div class="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">Total Due</div>
            <div class="font-black text-lg sm:text-xl break-all leading-tight">{{ formatCurrency(data.total, data.currency) }}</div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="data.notes" class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Notes / Payment Terms</div>
        <div class="text-xs sm:text-sm text-amber-900 whitespace-pre-line leading-relaxed">{{ data.notes }}</div>
      </div>

      <!-- Footer -->
      <div class="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-center sm:text-left">
        <div class="text-xs text-slate-400">
          Generated by <span class="text-blue-500 font-semibold">Invoicera</span>
        </div>
        <div class="text-xs text-slate-400">Thank you for your business!</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '../composables/useInvoices.js'

const props = defineProps({
  data: { type: Object, required: true },
})

const senderPhone = computed(() => {
  const { phoneCode, phone } = props.data.sender ?? {}
  if (!phone) return null
  return phoneCode ? `${phoneCode} ${phone}` : phone
})
</script>
