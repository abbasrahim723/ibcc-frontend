<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="overflow-x-hidden">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Payments</h3>

          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center lg:flex-initial">
            <!-- Filters -->
            <select v-model="filters.project_id" @change="handleSearch" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white max-w-[200px]">
              <option value="">All Projects</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>

            <select v-model="filters.customer_id" @change="handleSearch" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white max-w-[200px]">
              <option value="">All Payers</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>

            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search payments..."
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <button
              @click="router.push('/payments/create')"
              class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
            >
              <span class="flex items-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="hidden md:inline">New Payment</span>
              </span>
            </button>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-16">#</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[180px]">Project</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[150px]">Payer</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[150px]">Received By</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[150px]">Approved By</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Status</th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ payment.id }}
                  </td>
                  <td class="px-4 py-4">
                    <router-link 
                      v-if="payment.project" 
                      :to="`/projects/${payment.project.id}`" 
                      class="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline truncate block max-w-[180px]"
                    >
                      {{ payment.project.name }}
                    </router-link>
                    <span v-else class="text-sm text-gray-400">—</span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                      {{ payment.payer?.name || payment.payer_id || '—' }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(payment.amount, payment.currency) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(payment.payment_date) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     <div class="flex items-center gap-2">
                        <div v-if="payment.received_by" class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                           {{ payment.received_by.name?.charAt(0) }}
                        </div>
                        <span class="truncate max-w-[120px]">{{ payment.received_by?.name || '—' }}</span>
                     </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     <div class="flex items-center gap-2">
                        <div v-if="payment.approved_by" class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                           {{ payment.approved_by.name?.charAt(0) }}
                        </div>
                        <span class="truncate max-w-[120px]">{{ payment.approved_by?.name || '—' }}</span>
                     </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    ]">
                      {{ payment.status }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link :to="`/payments/${payment.id}/edit`" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3 transition-colors">Edit</router-link>
                  </td>
                </tr>
                <tr v-if="payments.length === 0">
                  <td colspan="9" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No payments found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-400">Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results</div>
          <div class="flex gap-2">
            <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Previous</button>
            <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Payments')
const payments = ref<any[]>([])
const projects = ref<any[]>([])
const customers = ref<any[]>([])
const searchQuery = ref('')
const filters = ref({
  project_id: '',
  customer_id: ''
})

const pagination = ref({ current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 })

const fetchPayments = async (page = 1) => {
  try {
    const params = { 
      page, 
      search: searchQuery.value || undefined,
      project_id: filters.value.project_id || undefined,
      customer_id: filters.value.customer_id || undefined // Note: this maps to payer_id in backend if payer_type is customer, or project owner
    }
    const res = await api.get('/payments', { params })
    payments.value = res.data.data
    pagination.value = {
      current_page: res.data.current_page,
      last_page: res.data.last_page,
      per_page: res.data.per_page,
      total: res.data.total,
      from: res.data.from,
      to: res.data.to,
    }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching payments')
  }
}

const fetchProjects = async () => {
  try {
    const res = await api.get('/projects')
    projects.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

const fetchCustomers = async () => {
  try {
    const res = await api.get('/customers')
    customers.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

const handleSearch = () => fetchPayments(1)
const changePage = (page: number) => fetchPayments(page)

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') => {
  if (value === null || value === undefined) return '—'
  const num = Number(value) || 0
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(num)
  return `${currency} ${formatted}`
}

const formatDate = (dateString: string) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchPayments()
  fetchProjects()
  fetchCustomers()
})
</script>
