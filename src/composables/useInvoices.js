import { ref } from 'vue'

const INVOICES_KEY = 'invoicera_invoices'
const SENDER_KEY   = 'invoicera_sender'

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useInvoices() {
  const invoices = ref(load(INVOICES_KEY, []))

  function saveInvoice(invoice) {
    const idx = invoices.value.findIndex(i => i.invoiceNumber === invoice.invoiceNumber)
    if (idx >= 0) {
      invoices.value[idx] = { ...invoice, updatedAt: new Date().toISOString() }
    } else {
      invoices.value.push({ ...invoice, createdAt: new Date().toISOString() })
    }
    persist(INVOICES_KEY, invoices.value)
  }

  function deleteInvoice(invoiceNumber) {
    invoices.value = invoices.value.filter(i => i.invoiceNumber !== invoiceNumber)
    persist(INVOICES_KEY, invoices.value)
  }

  function getInvoice(invoiceNumber) {
    return invoices.value.find(i => i.invoiceNumber === invoiceNumber) ?? null
  }

  function generateInvoiceNumber() {
    const year = new Date().getFullYear()
    const highest = invoices.value.reduce((max, inv) => {
      const parts = inv.invoiceNumber?.split('-')
      const num = parseInt(parts?.[parts.length - 1] ?? '0', 10)
      return Math.max(max, num)
    }, 0)
    return `INV-${year}-${String(highest + 1).padStart(4, '0')}`
  }

  function getSenderInfo() {
    return load(SENDER_KEY, {})
  }

  function saveSenderInfo(sender) {
    persist(SENDER_KEY, sender)
  }

  return {
    invoices,
    saveInvoice,
    deleteInvoice,
    getInvoice,
    generateInvoiceNumber,
    getSenderInfo,
    saveSenderInfo,
  }
}

export function formatCurrency(amount, currencyCode = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(Number(amount) || 0)
  } catch {
    return `${currencyCode || 'USD'} ${Number(amount).toFixed(2)}`
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function today() {
  return new Date().toISOString().split('T')[0]
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function emptyLineItem() {
  return { id: Date.now() + Math.random(), description: '', quantity: 1, unitPrice: 0 }
}
