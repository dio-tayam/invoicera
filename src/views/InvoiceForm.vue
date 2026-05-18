<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900">New Invoice</h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">Fill in the details to create a professional invoice</p>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-sm font-bold text-blue-600 font-mono">{{ invoiceNumber }}</div>
        <div class="text-xs text-slate-400 mt-0.5">Invoice #</div>
      </div>
    </div>

    <form @submit.prevent="handleSave" novalidate class="space-y-4 sm:space-y-6">

      <!-- Sender & Client row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        <!-- From -->
        <div class="card p-4 sm:p-6">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none">
                <path d="M3 21h18M3 7v1a3 3 0 006 0V7m6 0v1a3 3 0 006 0V7M3 7l2-4h14l2 4M12 21v-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="section-title">From (Your Details)</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="form-label">Biller / Business Name <span class="text-red-400 normal-case font-normal">*</span></label>
              <input
                v-model.trim="sender.businessName"
                @blur="touch('senderBusinessName')"
                :class="['form-input', errors.senderBusinessName && 'form-input-error']"
                placeholder="Your name or business name"
              />
              <p v-if="errors.senderBusinessName" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ errors.senderBusinessName }}
              </p>
            </div>

            <div>
              <label class="form-label">Address</label>
              <textarea
                v-model.trim="sender.address"
                class="form-textarea"
                rows="2"
                placeholder="123 Business Ave, Suite 100&#10;New York, NY 10001"
              />
            </div>

            <div>
              <label class="form-label">Email <span class="text-red-400 normal-case font-normal">*</span></label>
              <input
                v-model.trim="sender.email"
                @blur="touch('senderEmail')"
                type="email"
                :class="['form-input', errors.senderEmail && 'form-input-error']"
                placeholder="hello@yourbusiness.com"
              />
              <p v-if="errors.senderEmail" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ errors.senderEmail }}
              </p>
            </div>

            <div>
              <label class="form-label">
                Phone
                <span v-if="locationLoading" class="normal-case font-normal text-blue-400 ml-1">— detecting location…</span>
              </label>
              <div class="flex gap-2">
                <select v-model="sender.phoneCode" class="form-select w-32 flex-shrink-0 font-mono text-xs">
                  <option v-for="c in CALLING_CODES" :key="c.code" :value="c.code">
                    {{ c.flag }} {{ c.code }}
                  </option>
                </select>
                <input
                  v-model.trim="sender.phone"
                  type="tel"
                  class="form-input flex-1"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="handleSaveSender"
            class="mt-5 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Save as my default sender info
          </button>
        </div>

        <!-- Bill To -->
        <div class="card p-4 sm:p-6">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-sky-600" viewBox="0 0 24 24" fill="none">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h2 class="section-title">Bill To (Client Details)</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="form-label">Client Name <span class="text-red-400 normal-case font-normal">*</span></label>
              <input
                v-model.trim="client.name"
                @blur="touch('clientName')"
                :class="['form-input', errors.clientName && 'form-input-error']"
                placeholder="Jane Smith or Globex Inc."
              />
              <p v-if="errors.clientName" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ errors.clientName }}
              </p>
            </div>

            <div>
              <label class="form-label">Address</label>
              <textarea
                v-model.trim="client.address"
                class="form-textarea"
                rows="2"
                placeholder="456 Client Street&#10;Los Angeles, CA 90001"
              />
            </div>

            <div>
              <label class="form-label">Email</label>
              <input
                v-model.trim="client.email"
                @blur="touch('clientEmail')"
                type="email"
                :class="['form-input', errors.clientEmail && 'form-input-error']"
                placeholder="client@example.com"
              />
              <p v-if="errors.clientEmail" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ errors.clientEmail }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Invoice Meta -->
      <div class="card p-4 sm:p-6">
        <div class="flex items-center gap-2.5 mb-4 sm:mb-5">
          <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 class="section-title">Invoice Details</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label class="form-label">
              Currency
              <span v-if="locationLoading" class="normal-case font-normal text-blue-400">…</span>
            </label>
            <select v-model="currency" class="form-select">
              <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">
                {{ c.code }} — {{ c.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">Invoice Number</label>
            <input
              v-model.trim="invoiceNumber"
              class="form-input font-mono"
              placeholder="INV-2024-0001"
            />
          </div>
          <div>
            <label class="form-label">Invoice Date <span class="text-red-400 normal-case font-normal">*</span></label>
            <input
              v-model="invoiceDate"
              type="date"
              :class="['form-input', errors.invoiceDate && 'form-input-error']"
            />
          </div>
          <div>
            <label class="form-label">Due Date</label>
            <input v-model="dueDate" type="date" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Line Items -->
      <div class="card overflow-hidden">
        <div class="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 12h6M9 16h4M9 8h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h2 class="section-title">Line Items</h2>
          </div>
          <button type="button" @click="addItem" class="btn-primary text-sm px-4 py-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            Add Item
          </button>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-y border-slate-100">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/2">Description</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Qty</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">Unit Price</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Total</th>
                <th class="w-12 px-2 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="(item, idx) in lineItems" :key="item.id" class="group hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-3">
                  <input
                    v-model.trim="item.description"
                    @blur="touchItem(idx)"
                    :class="['form-input text-sm', itemErrors[idx]?.description && 'form-input-error']"
                    placeholder="Service or product description…"
                  />
                  <p v-if="itemErrors[idx]?.description" class="mt-1 text-xs text-red-500">{{ itemErrors[idx].description }}</p>
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="0"
                    step="any"
                    class="form-input text-sm text-right"
                    placeholder="1"
                  />
                </td>
                <td class="px-4 py-3">
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium select-none">
                      {{ currencySymbol }}
                    </span>
                    <input
                      v-model.number="item.unitPrice"
                      type="number"
                      min="0"
                      step="any"
                      class="form-input text-sm text-right pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </td>
                <td class="px-6 py-3 text-right">
                  <span class="text-sm font-semibold text-slate-800">{{ formatCurrency(lineTotal(item), currency) }}</span>
                </td>
                <td class="px-2 py-3 text-center">
                  <button
                    type="button"
                    @click="removeItem(idx)"
                    :disabled="lineItems.length === 1"
                    class="w-7 h-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="sm:hidden px-4 pb-4 space-y-3 mt-2">
          <div
            v-for="(item, idx) in lineItems"
            :key="item.id"
            class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-2.5">Item {{ idx + 1 }}</span>
              <button
                type="button"
                @click="removeItem(idx)"
                :disabled="lineItems.length === 1"
                class="w-7 h-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 flex items-center justify-center flex-shrink-0"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div>
              <label class="form-label">Description</label>
              <input v-model.trim="item.description" class="form-input" placeholder="Service or product…" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">Quantity</label>
                <input v-model.number="item.quantity" type="number" min="0" step="any" class="form-input" placeholder="1" />
              </div>
              <div>
                <label class="form-label">Unit Price</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium select-none">{{ currencySymbol }}</span>
                  <input v-model.number="item.unitPrice" type="number" min="0" step="any" class="form-input pl-8" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-slate-200">
              <span class="text-xs text-slate-500 font-medium">Line Total</span>
              <span class="text-sm font-bold text-blue-600">{{ formatCurrency(lineTotal(item), currency) }}</span>
            </div>
          </div>
        </div>

        <p v-if="errors.lineItems" class="px-6 pb-4 text-xs text-red-500 flex items-center gap-1">
          <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          {{ errors.lineItems }}
        </p>
      </div>

      <!-- Notes + Totals -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        <!-- Notes -->
        <div class="card p-4 sm:p-6">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none">
                <path d="M7 8h10M7 12h6M3 4h18v16H3V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="section-title">Notes / Payment Terms</h2>
          </div>
          <textarea
            v-model.trim="notes"
            class="form-textarea"
            rows="5"
            placeholder="e.g. Payment due within 30 days. Bank transfer preferred.&#10;&#10;Thank you for your business!"
          />
        </div>

        <!-- Totals -->
        <div class="card p-4 sm:p-6 flex flex-col justify-between">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none">
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h2 class="section-title">Summary</h2>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-slate-100">
              <span class="text-sm text-slate-500">Subtotal</span>
              <span class="text-sm font-semibold text-slate-700">{{ formatCurrency(subtotal, currency) }}</span>
            </div>

            <div class="flex items-center justify-between py-2 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-500">Tax</span>
                <div class="flex items-center gap-1">
                  <input
                    v-model.number="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-16 px-2 py-1 text-sm text-right rounded-lg border border-slate-200
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="0"
                  />
                  <span class="text-sm text-slate-400">%</span>
                </div>
              </div>
              <span class="text-sm font-semibold text-slate-700">{{ formatCurrency(taxAmount, currency) }}</span>
            </div>

            <div class="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-600
                        text-white rounded-xl px-4 py-3.5 mt-2">
              <span class="font-bold text-base">Total Due</span>
              <span class="font-extrabold text-xl">{{ formatCurrency(total, currency) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end pt-2 pb-4">
        <button type="button" @click="confirmReset" class="btn-secondary">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115.6-6.1L20 4M20 15a9 9 0 01-15.6 6.1L4 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Reset Form
        </button>
        <button
          type="button"
          @click="downloadPDF"
          :disabled="pdfLoading"
          class="btn-secondary border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <svg v-if="!pdfLoading" class="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 16l-4-4h3V4h2v8h3l-4 4zM4 18h16v2H4v-2z" fill="currentColor"/>
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="32" opacity="0.25"/>
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          </svg>
          {{ pdfLoading ? 'Generating…' : 'Download PDF' }}
        </button>
        <button type="submit" :disabled="saving" class="btn-success">
          <svg v-if="!saving" class="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="32" opacity="0.25"/>
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          </svg>
          {{ saving ? 'Saving…' : 'Save Invoice' }}
        </button>
      </div>

    </form>

    <!-- Hidden PDF target (off-screen, not display:none so html2canvas can read it) -->
    <div
      id="invoice-print-target"
      style="position:fixed; top:-99999px; left:-99999px; width:794px; background:#fff; z-index:-1;"
      aria-hidden="true"
    >
      <InvoicePreview :data="invoiceData" />
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast"
        :class="[
          'fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-xs z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium',
          toast.type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-200/60' : 'bg-red-600 text-white shadow-red-200/60'
        ]"
      >
        <svg v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Reset confirm -->
    <Transition name="modal">
      <div
        v-if="showResetConfirm"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm"
        @click.self="showResetConfirm = false"
      >
        <div class="modal-content bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl p-6 pb-8 sm:pb-6">
          <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Reset Form?</h3>
          <p class="text-slate-500 text-sm text-center mb-6">All unsaved changes will be lost.</p>
          <div class="flex gap-3">
            <button @click="showResetConfirm = false" class="btn-secondary flex-1">Cancel</button>
            <button @click="resetForm" class="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all">
              Reset
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import InvoicePreview from '../components/InvoicePreview.vue'
import {
  useInvoices,
  formatCurrency,
  today,
  addDays,
  emptyLineItem,
} from '../composables/useInvoices.js'
import { CURRENCIES, CALLING_CODES } from '../constants.js'

const router = useRouter()
const { saveInvoice, generateInvoiceNumber, getSenderInfo, saveSenderInfo } = useInvoices()

// ── State ──────────────────────────────────────────────────────────────────
const invoiceNumber   = ref(generateInvoiceNumber())
const invoiceDate     = ref(today())
const dueDate         = ref(addDays(today(), 30))
const notes           = ref('')
const taxRate         = ref(0)
const currency        = ref('USD')
const locationLoading = ref(false)

const sender = reactive({ businessName: '', address: '', email: '', phoneCode: '+1', phone: '' })
const client = reactive({ name: '', address: '', email: '' })

const lineItems  = ref([emptyLineItem()])
const touched    = reactive({})
const itemErrors = ref([])
const saving     = ref(false)
const pdfLoading = ref(false)
const toast      = ref(null)
const showResetConfirm = ref(false)

// ── Computed ───────────────────────────────────────────────────────────────
const subtotal = computed(() =>
  lineItems.value.reduce((sum, item) => sum + lineTotal(item), 0)
)
const taxAmount = computed(() => (subtotal.value * (taxRate.value || 0)) / 100)
const total     = computed(() => subtotal.value + taxAmount.value)

const currencySymbol = computed(() =>
  CURRENCIES.find(c => c.code === currency.value)?.symbol ?? currency.value
)

const invoiceData = computed(() => ({
  invoiceNumber: invoiceNumber.value,
  invoiceDate:   invoiceDate.value,
  dueDate:       dueDate.value,
  currency:      currency.value,
  sender:        { ...sender },
  client:        { ...client },
  lineItems:     lineItems.value.map(i => ({ ...i })),
  notes:         notes.value,
  taxRate:       taxRate.value,
  subtotal:      subtotal.value,
  taxAmount:     taxAmount.value,
  total:         total.value,
}))

// ── Validation ─────────────────────────────────────────────────────────────
const errors = computed(() => {
  const e = {}
  if (touched.senderBusinessName && !sender.businessName) e.senderBusinessName = 'Biller name is required.'
  if (touched.senderEmail && sender.email && !/^\S+@\S+\.\S+$/.test(sender.email)) e.senderEmail = 'Enter a valid email address.'
  if (touched.clientName && !client.name) e.clientName = 'Client name is required.'
  if (touched.clientEmail && client.email && !/^\S+@\S+\.\S+$/.test(client.email)) e.clientEmail = 'Enter a valid email address.'
  if (touched.invoiceDate && !invoiceDate.value) e.invoiceDate = 'Invoice date is required.'
  if (touched.lineItems) {
    const hasValidItem = lineItems.value.some(i => i.description.trim() && (i.quantity > 0))
    if (!hasValidItem) e.lineItems = 'Add at least one line item with a description and quantity.'
  }
  return e
})

function touch(field) { touched[field] = true }

function touchItem(idx) {
  const errs = [...(itemErrors.value)]
  errs[idx] = lineItems.value[idx]?.description.trim()
    ? undefined
    : { description: 'Description is required.' }
  itemErrors.value = errs
}

function touchAll() {
  ['senderBusinessName', 'senderEmail', 'clientName', 'clientEmail', 'invoiceDate', 'lineItems']
    .forEach(f => { touched[f] = true })
  lineItems.value.forEach((_, i) => touchItem(i))
}

function isValid() {
  touchAll()
  return Object.keys(errors.value).length === 0 &&
    itemErrors.value.filter(Boolean).length === 0
}

// ── Helpers ────────────────────────────────────────────────────────────────
function lineTotal(item) {
  return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
}

function addItem() { lineItems.value.push(emptyLineItem()) }

function removeItem(idx) {
  if (lineItems.value.length > 1) lineItems.value.splice(idx, 1)
}

function showToast(message, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Geolocation ────────────────────────────────────────────────────────────
async function detectLocation() {
  locationLoading.value = true
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res  = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timeout)
    const data = await res.json()

    if (data.country_calling_code && !sender.phoneCode) {
      const code = `+${data.country_calling_code}`
      if (CALLING_CODES.find(c => c.code === code)) sender.phoneCode = code
    }
    if (data.currency) {
      const found = CURRENCIES.find(c => c.code === data.currency)
      if (found) currency.value = found.code
    }
  } catch {
    // silently fallback to defaults
  } finally {
    locationLoading.value = false
  }
}

// ── Actions ────────────────────────────────────────────────────────────────
async function handleSave() {
  if (!isValid()) return
  saving.value = true
  await new Promise(r => setTimeout(r, 400))
  saveInvoice({ ...invoiceData.value })
  saving.value = false
  showToast('Invoice saved successfully!')
  setTimeout(() => router.push('/history'), 900)
}

function handleSaveSender() {
  saveSenderInfo({ ...sender, currency: currency.value })
  showToast('Sender info saved as default.')
}

async function downloadPDF() {
  pdfLoading.value = true
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])
    await nextTick()
    const el = document.getElementById('invoice-print-target')
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
    const imgData = canvas.toDataURL('image/png')
    const pdf   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()   // 210 mm
    const pageH = pdf.internal.pageSize.getHeight()  // 297 mm
    const margin = 10 // mm — white gutter on every edge

    // Scale image to fill width inside left+right margins
    const contentW  = pageW - 2 * margin
    const imgScaledH = (canvas.height / canvas.width) * contentW
    // Usable vertical space per page between top and bottom gutter
    const sliceH = pageH - 2 * margin

    let yOffset = 0
    let pageNum = 0
    while (yOffset < imgScaledH) {
      if (pageNum > 0) pdf.addPage()

      // Draw invoice image shifted up by accumulated offset
      pdf.addImage(imgData, 'PNG', margin, margin - yOffset, contentW, imgScaledH)

      // White bars mask content that bleeds into the top/bottom margins
      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageW, margin, 'F')
      pdf.rect(0, pageH - margin, pageW, margin + 1, 'F')

      yOffset += sliceH
      pageNum++
    }
    pdf.save(`${invoiceNumber.value}.pdf`)
    showToast('PDF downloaded!')
  } catch (err) {
    console.error(err)
    showToast('PDF generation failed. Try printing instead.', 'error')
  } finally {
    pdfLoading.value = false
  }
}

function confirmReset() { showResetConfirm.value = true }

function resetForm() {
  invoiceNumber.value = generateInvoiceNumber()
  invoiceDate.value   = today()
  dueDate.value       = addDays(today(), 30)
  notes.value         = ''
  taxRate.value       = 0
  Object.assign(client, { name: '', address: '', email: '' })
  lineItems.value  = [emptyLineItem()]
  itemErrors.value = []
  Object.keys(touched).forEach(k => delete touched[k])
  showResetConfirm.value = false
  showToast('Form has been reset.')
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  const saved = getSenderInfo()
  if (saved.businessName) Object.assign(sender, saved)
  if (saved.currency) currency.value = saved.currency

  // Only detect location if no saved preferences yet
  if (!saved.phoneCode || !saved.currency) {
    await detectLocation()
  }
})
</script>
