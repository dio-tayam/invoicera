<template>
  <div class="invoice-preview bg-white" style="font-family: 'Inter', 'Segoe UI', sans-serif; color: #0f172a;">

    <!-- Header Band -->
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%); padding: 36px 48px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;">

        <!-- Sender -->
        <div>
          <div v-if="data.sender?.businessName">
            <div style="font-size: 16px; font-weight: 800; color: #fff;">{{ data.sender.businessName }}</div>
            <div v-if="data.sender.address" style="font-size: 12px; color: #bfdbfe; margin-top: 4px; white-space: pre-line; line-height: 1.5;">{{ data.sender.address }}</div>
            <div v-if="data.sender.email" style="font-size: 12px; color: #bfdbfe; margin-top: 2px;">{{ data.sender.email }}</div>
            <div v-if="senderPhone" style="font-size: 12px; color: #bfdbfe; margin-top: 2px;">{{ senderPhone }}</div>
          </div>
        </div>

        <!-- Invoice Meta -->
        <div style="text-align: right; flex-shrink: 0;">
          <div style="font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -0.5px;">INVOICE</div>
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: flex-end; gap: 16px; align-items: baseline;">
              <span style="font-size: 11px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.08em;">Number</span>
              <span style="font-size: 14px; font-weight: 700; color: #fff;">{{ data.invoiceNumber }}</span>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 16px; align-items: baseline;">
              <span style="font-size: 11px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.08em;">Date</span>
              <span style="font-size: 13px; color: #dbeafe;">{{ formatDate(data.invoiceDate) }}</span>
            </div>
            <div v-if="data.dueDate" style="display: flex; justify-content: flex-end; gap: 16px; align-items: baseline;">
              <span style="font-size: 11px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.08em;">Due</span>
              <span style="font-size: 13px; color: #dbeafe;">{{ formatDate(data.dueDate) }}</span>
            </div>
            <div v-if="data.currency && data.currency !== 'USD'" style="display: flex; justify-content: flex-end; gap: 16px; align-items: baseline; margin-top: 4px;">
              <span style="font-size: 11px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.08em;">Currency</span>
              <span style="font-size: 13px; color: #dbeafe; font-weight: 600;">{{ data.currency }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Body -->
    <div style="padding: 36px 48px;">

      <!-- Bill To -->
      <div style="margin-bottom: 32px;">
        <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Bill To</div>
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px 20px; border-left: 3px solid #3b82f6;">
          <div style="font-size: 16px; font-weight: 700; color: #0f172a;">{{ data.client?.name }}</div>
          <div v-if="data.client?.address" style="font-size: 13px; color: #475569; margin-top: 4px; white-space: pre-line;">{{ data.client.address }}</div>
          <div v-if="data.client?.email" style="font-size: 13px; color: #475569; margin-top: 2px;">{{ data.client.email }}</div>
        </div>
      </div>

      <!-- Line Items Table -->
      <div style="margin-bottom: 28px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #1d4ed8;">
              <th style="text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 6px 0 0 6px;">Description</th>
              <th style="text-align: center; padding: 10px 14px; font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; width: 64px;">Qty</th>
              <th style="text-align: right; padding: 10px 14px; font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; width: 110px;">Unit Price</th>
              <th style="text-align: right; padding: 10px 14px; font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.08em; width: 110px; border-radius: 0 6px 6px 0;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in data.lineItems"
              :key="i"
              :style="{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }"
            >
              <td style="padding: 12px 14px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">
                {{ item.description || '—' }}
              </td>
              <td style="padding: 12px 14px; text-align: center; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9;">
                {{ item.quantity }}
              </td>
              <td style="padding: 12px 14px; text-align: right; font-size: 13px; color: #475569; border-bottom: 1px solid #f1f5f9; word-break: break-all;">
                {{ formatCurrency(item.unitPrice, data.currency) }}
              </td>
              <td style="padding: 12px 14px; text-align: right; font-size: 13px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #f1f5f9; word-break: break-all;">
                {{ formatCurrency(item.quantity * item.unitPrice, data.currency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 28px;">
        <div style="width: 280px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="font-size: 13px; color: #64748b; flex-shrink: 0;">Subtotal</span>
            <span style="font-size: 13px; font-weight: 500; color: #1e293b; text-align: right; word-break: break-all;">{{ formatCurrency(data.subtotal, data.currency) }}</span>
          </div>
          <div v-if="data.taxRate > 0" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="font-size: 13px; color: #64748b; flex-shrink: 0; white-space: nowrap;">Tax ({{ data.taxRate }}%)</span>
            <span style="font-size: 13px; font-weight: 500; color: #1e293b; text-align: right; word-break: break-all;">{{ formatCurrency(data.taxAmount, data.currency) }}</span>
          </div>
          <div style="padding: 14px 16px; background: linear-gradient(135deg, #1e3a8a, #1d4ed8); border-radius: 10px; margin-top: 8px;">
            <div style="font-size: 11px; font-weight: 600; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;">Total Due</div>
            <div style="font-size: 18px; font-weight: 800; color: #fff; word-break: break-all; line-height: 1.3;">{{ formatCurrency(data.total, data.currency) }}</div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="data.notes" style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
        <div style="font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">Notes / Payment Terms</div>
        <div style="font-size: 13px; color: #78350f; white-space: pre-line; line-height: 1.6;">{{ data.notes }}</div>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 11px; color: #94a3b8;">Generated by <strong style="color: #3b82f6;">Invoicera</strong></div>
        <div style="font-size: 11px; color: #94a3b8;">Thank you for your business!</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '../composables/useInvoices.js'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const senderPhone = computed(() => {
  const { phoneCode, phone } = props.data.sender ?? {}
  if (!phone) return null
  return phoneCode ? `${phoneCode} ${phone}` : phone
})
</script>
