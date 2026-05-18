import { createRouter, createWebHistory } from 'vue-router'
import InvoiceForm from '../views/InvoiceForm.vue'
import InvoiceHistory from '../views/InvoiceHistory.vue'

const routes = [
  {
    path: '/',
    name: 'form',
    component: InvoiceForm,
    meta: { title: 'Create Invoice — Invoicera' },
  },
  {
    path: '/history',
    name: 'history',
    component: InvoiceHistory,
    meta: { title: 'Invoice History — Invoicera' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Invoicera — Invoice Generator'
})

export default router
