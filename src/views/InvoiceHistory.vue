<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900">Invoice History</h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">
          {{ invoices.length === 0
            ? 'No invoices yet'
            : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} saved` }}
        </p>
      </div>
      <RouterLink to="/" class="btn-primary flex-shrink-0 text-sm px-4 py-2.5">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="hidden sm:inline">New Invoice</span>
        <span class="sm:hidden">New</span>
      </RouterLink>
    </div>

    <!-- Search -->
    <div v-if="invoices.length > 0" class="mb-5 relative">
      <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search by client name or invoice number…"
        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
               text-slate-800 placeholder:text-slate-300 outline-none focus:border-blue-400
               focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>

    <!-- Empty state -->
    <div v-if="invoices.length === 0" class="text-center py-16 sm:py-24">
      <div class="w-16 sm:w-20 h-16 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg class="w-8 sm:w-10 h-8 sm:h-10 text-blue-400" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h2 class="text-base sm:text-lg font-bold text-slate-800 mb-2">No invoices yet</h2>
      <p class="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
        Create your first invoice and it will appear here. Everything is saved locally in your browser.
      </p>
      <RouterLink to="/" class="btn-primary mx-auto">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Create First Invoice
      </RouterLink>
    </div>

    <!-- No search results -->
    <div v-else-if="filtered.length === 0" class="text-center py-14">
      <div class="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="text-slate-500 font-medium text-sm">No results for "{{ search }}"</p>
      <button @click="search = ''" class="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
        Clear search
      </button>
    </div>

    <!-- Invoice list -->
    <div v-else class="space-y-3">
      <div v-for="inv in filtered" :key="inv.invoiceNumber"
           class="card p-4 sm:p-5 hover:shadow-md transition-all duration-200">

        <!-- Mobile layout -->
        <div class="flex flex-col sm:hidden gap-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="font-bold text-slate-900 truncate">{{ inv.client?.name }}</div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">{{ inv.invoiceNumber }}</div>
              <div v-if="inv.dueDate" class="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Due {{ formatDate(inv.dueDate) }}
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-base font-extrabold text-blue-600">{{ formatCurrency(inv.total, inv.currency) }}</div>
              <div class="text-xs text-slate-400 mt-0.5">{{ formatDate(inv.invoiceDate) }}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="openView(inv)"
                    class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200
                           text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all active:bg-slate-100">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              View
            </button>
            <button @click="confirmDelete(inv)"
                    class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-100
                           text-red-600 text-sm font-medium hover:bg-red-50 transition-all active:bg-red-100">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>

        <!-- Desktop layout -->
        <div class="hidden sm:flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="font-bold text-slate-900 truncate text-sm">{{ inv.client?.name }}</div>
            <div class="text-xs text-slate-400 font-mono mt-0.5">{{ inv.invoiceNumber }}</div>
          </div>

          <div class="hidden md:block w-36 text-center">
            <div class="text-sm text-slate-600">{{ formatDate(inv.invoiceDate) }}</div>
            <div v-if="inv.dueDate" class="text-xs text-slate-400 mt-0.5">Due {{ formatDate(inv.dueDate) }}</div>
          </div>

          <div class="hidden lg:block w-36 text-right truncate">
            <div class="text-sm text-slate-400 truncate">{{ inv.sender?.businessName || '' }}</div>
          </div>

          <div class="text-right flex-shrink-0 w-28">
            <div class="text-base font-extrabold text-blue-600">{{ formatCurrency(inv.total, inv.currency) }}</div>
            <div v-if="inv.currency && inv.currency !== 'USD'" class="text-xs text-slate-400 mt-0.5">{{ inv.currency }}</div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="openView(inv)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 text-sm font-medium
                           hover:text-slate-700 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              View
            </button>
            <button @click="confirmDelete(inv)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 text-sm font-medium
                           hover:text-red-700 hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>

  <!-- ── View Modal (full-screen on mobile, dialog on desktop) ─────────────── -->
  <Transition name="modal">
    <div v-if="viewingInvoice"
         class="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center sm:p-6
                bg-slate-900/60 backdrop-blur-sm overflow-hidden"
         @click.self="closeView">

      <div class="modal-content flex flex-col w-full h-full sm:h-auto sm:max-h-[90vh]
                  sm:max-w-3xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden">

        <!-- Modal toolbar -->
        <div class="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4
                    border-b border-slate-100 bg-white flex-shrink-0">
          <div class="min-w-0 flex-1 mr-3">
            <div class="font-bold text-slate-900 text-sm truncate">{{ viewingInvoice.invoiceNumber }}</div>
            <div class="text-xs text-slate-400 mt-0.5 truncate">{{ viewingInvoice.client?.name }}</div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="downloadPDFFor(viewingInvoice)" :disabled="pdfLoading"
                    class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200
                           text-slate-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl
                           transition-all shadow-sm disabled:opacity-50">
              <svg v-if="!pdfLoading" class="w-3.5 sm:w-4 h-3.5 sm:h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 16l-4-4h3V4h2v8h3l-4 4zM4 18h16v2H4v-2z" fill="currentColor"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="32" opacity="0.25"/>
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <span class="hidden sm:inline">{{ pdfLoading ? 'Generating…' : 'Download PDF' }}</span>
              <span class="sm:hidden">{{ pdfLoading ? '…' : 'PDF' }}</span>
            </button>
            <button @click="closeView"
                    class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200
                           flex items-center justify-center transition-colors flex-shrink-0">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Invoice display (responsive, scrollable) -->
        <div class="flex-1 overflow-y-auto overscroll-contain">
          <InvoiceDisplay :data="viewingInvoice" />
        </div>

      </div>
    </div>
  </Transition>

  <!-- ── Delete confirm ─────────────────────────────────────────────────────── -->
  <Transition name="modal">
    <div v-if="deletingInvoice"
         class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4
                bg-slate-900/60 backdrop-blur-sm"
         @click.self="deletingInvoice = null">
      <div class="modal-content bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl p-6 pb-8 sm:pb-6">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-900 text-center mb-1">Delete Invoice?</h3>
        <p class="text-slate-500 text-sm text-center mb-1">
          <span class="font-semibold text-slate-700">{{ deletingInvoice.invoiceNumber }}</span>
          for <span class="font-semibold text-slate-700">{{ deletingInvoice.client?.name }}</span>
        </p>
        <p class="text-slate-400 text-xs text-center mb-6">This cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="deletingInvoice = null" class="btn-secondary flex-1">Cancel</button>
          <button @click="handleDelete"
                  class="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700
                         text-white font-semibold px-5 py-2.5 rounded-xl transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="toast"
         class="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-xs z-50
                bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl
                flex items-center gap-3 text-sm font-medium">
      <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      {{ toast }}
    </div>
  </Transition>

  <!-- Hidden PDF target (off-screen, full A4 width for html2canvas) -->
  <div id="history-pdf-target"
       style="position:fixed; top:-99999px; left:-99999px; width:794px; background:#fff; z-index:-1;"
       aria-hidden="true">
    <InvoicePreview v-if="viewingInvoice" :data="viewingInvoice" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import InvoiceDisplay from '../components/InvoiceDisplay.vue'
import InvoicePreview from '../components/InvoicePreview.vue'
import { useInvoices, formatCurrency, formatDate } from '../composables/useInvoices.js'

const { invoices, deleteInvoice } = useInvoices()

const search          = ref('')
const viewingInvoice  = ref(null)
const deletingInvoice = ref(null)
const pdfLoading      = ref(false)
const toast           = ref(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  const list = [...invoices.value].reverse()
  if (!q) return list
  return list.filter(inv =>
    inv.client?.name?.toLowerCase().includes(q) ||
    inv.invoiceNumber?.toLowerCase().includes(q) ||
    inv.sender?.businessName?.toLowerCase().includes(q)
  )
})

function openView(inv) {
  viewingInvoice.value = inv
  document.body.style.overflow = 'hidden'
}

function closeView() {
  viewingInvoice.value = null
  document.body.style.overflow = ''
}

// Restore body scroll if user navigates away while modal is open
onUnmounted(() => { document.body.style.overflow = '' })

function confirmDelete(inv) { deletingInvoice.value = inv }

function handleDelete() {
  if (!deletingInvoice.value) return
  deleteInvoice(deletingInvoice.value.invoiceNumber)
  showToast('Invoice deleted.')
  deletingInvoice.value = null
}

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = null }, 3000)
}

async function downloadPDFFor(inv) {
  pdfLoading.value = true
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])
    await nextTick()
    const el = document.getElementById('history-pdf-target')
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
    const imgData = canvas.toDataURL('image/png')
    const pdf   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgH  = (canvas.height * pageW) / canvas.width
    let y = 0
    while (y < imgH) {
      if (y > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -y, pageW, imgH)
      y += pageH
    }
    pdf.save(`${inv.invoiceNumber}.pdf`)
    showToast('PDF downloaded!')
  } catch (err) {
    console.error(err)
    showToast('Download failed — try again.')
  } finally {
    pdfLoading.value = false
  }
}
</script>
