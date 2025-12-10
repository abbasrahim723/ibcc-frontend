<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Search" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div class="flex flex-1 items-center gap-3">
          <input
            v-model="query"
            @keyup.enter="runSearch"
            type="text"
            placeholder="Search customers, projects, payments, documents..."
            class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            @click="runSearch"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Search
          </button>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Showing results for: <span class="font-medium text-gray-800 dark:text-white">{{ query || '�' }}</span>
        </div>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-medium">Filters:</span>
        <label v-if="canCustomers" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.customers" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Customers
        </label>
        <label v-if="canProjects" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.projects" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Projects
        </label>
        <label v-if="canPayments" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.payments" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Payments
        </label>
        <label v-if="canDocuments" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.documents" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Documents
        </label>
      </div>

      <div v-if="!query" class="text-gray-500 dark:text-gray-400 text-sm">
        Type a search term to see results.
      </div>

      <div v-else>
        <div v-if="loading" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Searching...</div>

        <div v-else class="space-y-8">
          <section v-if="canCustomers">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Customers</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.customers.length }} found</span>
            </header>
            <div v-if="results.customers.length" class="space-y-2">
              <div
                v-for="c in results.customers"
                :key="c.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div>
                  <router-link :to="`/customers/${c.id}`" class="font-medium text-brand-600 hover:underline">
                    {{ c.name }}
                  </router-link>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ c.email || 'No email' }}</div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Customer</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No customers found.</div>
          </section>

          <section v-if="canProjects">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Projects</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.projects.length }} found</span>
            </header>
            <div v-if="results.projects.length" class="grid gap-3 md:grid-cols-2">
              <div
                v-for="p in results.projects"
                :key="p.id"
                class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <router-link :to="`/projects/${p.id}`" class="font-medium text-brand-600 hover:underline">
                  {{ p.name }}
                </router-link>
                <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ p.address || p.plot_number || 'No address' }}
                </div>
                <div class="mt-2 flex items-center gap-2 text-xs">
                  <span :class="statusBadgeClass(p.status)" class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                    <component :is="statusIcon(p.status)" class="h-3.5 w-3.5" />
                    {{ prettyStatus(p.status) }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400">Created {{ formatDate(p.created_at) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No projects found.</div>
          </section>

          <section v-if="canPayments">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Payments</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.payments.length }} found</span>
            </header>
            <div v-if="results.payments.length" class="space-y-2">
              <div
                v-for="pay in results.payments"
                :key="pay.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(pay.amount) }} — {{ pay.description || 'Payment' }}
                  </div>
                  <div class="mt-2 flex items-center gap-2 text-xs">
                    <span :class="statusBadgeClass(pay.status)" class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                      <component :is="statusIcon(pay.status)" class="h-3.5 w-3.5" />
                      {{ prettyStatus(pay.status) }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">Created {{ formatDate(pay.created_at) }}</span>
                  </div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Payment</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No payments found.</div>
          </section>

          <section v-if="canDocuments">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Documents</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.documents.length }} found</span>
            </header>
            <div v-if="results.documents.length" class="space-y-2">
              <div
                v-for="d in results.documents"
                :key="d.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ d.title || d.name || 'Document' }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ d.description || d.file_name || '' }}</div>
                  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Created {{ formatDate(d.created_at) }}</div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Document</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No documents found.</div>
          </section>

          <div v-if="!hasAnyResults" class="text-sm text-gray-500 dark:text-gray-400">
            No results found for "{{ query }}".
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { usePermissions } from '@/composables/usePermissions'
import { ClockIcon, CheckCircleIcon, PlayCircleIcon, PauseCircleIcon, XCircleIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { can } = usePermissions()

const query = ref<string>((route.query.q as string) || '')
const loading = ref(false)
const filters = ref({
  customers: true,
  projects: true,
  payments: true,
  documents: true,
})

const results = ref({
  customers: [] as any[],
  projects: [] as any[],
  payments: [] as any[],
  documents: [] as any[],
})

const canCustomers = computed(() => can('customers', 'view'))
const canProjects = computed(() => can('projects', 'view'))
const canPayments = computed(() => can('payments', 'view'))
const canDocuments = computed(() => can('documents', 'view'))

const hasAnyResults = computed(() =>
  results.value.customers.length ||
  results.value.projects.length ||
  results.value.payments.length ||
  results.value.documents.length
)

const runSearch = async () => {
  const term = query.value.trim()
  if (!term) return
  router.replace({ path: '/search', query: { q: term } })
  loading.value = true
  results.value = { customers: [], projects: [], payments: [], documents: [] }

  const tasks: Promise<void>[] = []

  if (canCustomers.value) {
    tasks.push(fetchResource('/customers', 'customers', filters.value.customers))
  }
  if (canProjects.value) {
    tasks.push(fetchResource('/projects', 'projects', filters.value.projects))
  }
  if (canPayments.value) {
    tasks.push(fetchResource('/payments', 'payments', filters.value.payments))
  }
  if (canDocuments.value) {
    tasks.push(fetchResource('/documents', 'documents', filters.value.documents))
  }

  try {
    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
}

const fetchResource = async (url: string, key: keyof typeof results.value, enabled = true) => {
  if (!enabled) {
    results.value[key] = []
    return
  }
  try {
    const res = await api.get(url, { params: { search: query.value, per_page: 5 } })
    const data = res.data?.data ?? res.data ?? []
    results.value[key] = Array.isArray(data) ? data.slice(0, 5) : []
  } catch (e) {
    results.value[key] = []
  }
}

const formatCurrency = (value: any) => {
  const num = Number(value) || 0
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(num)
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString()
}

const prettyStatus = (status: string) => {
  if (!status) return '—'
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'active':
      return 'CheckCircleIcon'
    case 'in_progress':
    case 'planning':
      return 'PlayCircleIcon'
    case 'cancelled':
    case 'failed':
      return 'XCircleIcon'
    case 'on_hold':
      return 'PauseCircleIcon'
    default:
      return 'ClockIcon'
  }
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'in_progress':
    case 'planning':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'on_hold':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
  }
}

watch(
  () => route.query.q,
  (val) => {
    if (typeof val === 'string') {
      query.value = val
      runSearch()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (query.value) runSearch()
})
</script>
