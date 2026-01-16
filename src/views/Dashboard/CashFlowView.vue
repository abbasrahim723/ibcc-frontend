<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Cash Flow" />

    <div class="space-y-6">
      <!-- KPIs (Global) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <!-- Loading Skeletons -->
        <div v-if="loading" v-for="n in 4" :key="'kpi-skeleton-' + n" class="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-24 mb-2 dark:bg-gray-700"></div>
              <div class="h-8 bg-gray-200 rounded w-20 mb-2 dark:bg-gray-700"></div>
              <div class="h-3 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
            </div>
            <div class="h-12 w-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Actual KPI Cards -->
        <div v-if="!loading" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Incoming (All Time)</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.incoming_completed_total) }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Received ({{ stats.incoming_completed_count || 0 }} items)</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-semibold">
              Rs
            </div>
          </div>
        </div>

        <div v-if="!loading" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Outgoing (All Time)</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.outgoing_completed_total) }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Paid ({{ stats.outgoing_completed_count || 0 }} items)</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-semibold">
              Rs
            </div>
          </div>
        </div>

        <div v-if="!loading" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Net Cash Flow</p>
              <h3 class="mt-2 text-3xl font-bold" :class="netCash >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                {{ formatCurrency(netCash) }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Incoming minus outgoing</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m0 0l-4-4m4 4l4-4M4 4v4m0-4h4M4 4l4 4m12 12v-4m0 4h-4m4 0l-4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div v-if="!loading" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pending / Scheduled</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(estimated.incoming_pending_month) }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Due this month</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Filters Section -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Detailed Analysis</h3>
          <div class="flex items-center gap-2">
            <button @click="resetFilters" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Reset Filters
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Date Range -->
          <div class="relative w-full">
            <DateRangePicker v-model="filters.dateRange" />
          </div>

          <!-- Project Filter -->
          <ProjectSelect 
            v-model="filters.project_id" 
            :projects="projects"
            placeholder="📂 All Projects"
          />
          
          <!-- Payer Filter -->
          <CustomerSelect 
            v-model="filters.payer_id" 
            :customers="customers"
            placeholder="👤 All Payers"
          />

           <!-- Type/Category Filter -->
          <GenericSelect
            v-model="filters.type"
            :options="typeOptions"
            placeholder="🔄 All Types"
            class="w-full"
            @change="fetchAnalytics"
          />
        </div>

        <!-- Filtered Stats Cards -->
        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-xl bg-green-50 p-4 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
            <p class="text-sm font-medium text-green-600 dark:text-green-400">Filtered Income</p>
            <p class="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">{{ formatCurrency(filteredStats.incoming) }}</p>
          </div>
          <div class="rounded-xl bg-red-50 p-4 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
            <p class="text-sm font-medium text-red-600 dark:text-red-400">Filtered Outgoing</p>
            <p class="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">{{ formatCurrency(filteredStats.outgoing) }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Net Result</p>
            <p class="mt-1 text-2xl font-bold" :class="filteredStats.net >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'">
              {{ formatCurrency(filteredStats.net) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div v-if="loadingAnalytics" class="animate-pulse h-[460px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span class="text-gray-400">Loading analysis...</span>
        </div>
        <div v-else>
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow Trend</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Based on selected filters</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="toggleFullscreen" class="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V5a1 1 0 011-1h3m8 0h3a1 1 0 011 1v3m0 8v3a1 1 0 01-1 1h-3m-8 0H5a1 1 0 01-1-1v-3" />
                </svg>
              </button>
            </div>
          </div>
          <div ref="chartContainer" :class="isFullscreen ? 'h-[460px]' : 'h-[400px]'"></div>
        </div>
      </div>

      <!-- Transactions Timeline -->
      <div v-if="!loadingAnalytics" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 class="mb-8 text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        
        <div class="relative">
            <!-- Center Line -->
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 dark:bg-gray-700"></div>

            <div v-for="tx in transactions" :key="tx.id" class="relative mb-8 flex items-center justify-between">
                
                <!-- Incoming (Left Side) -->
                <div class="w-1/2 pr-8 flex justify-end">
                    <div v-if="tx.direction === 'incoming'" class="flex items-center gap-4 text-right">
                        <div>
                            <p class="font-bold text-gray-900 dark:text-white">{{ tx.title }}</p>
                            <p class="text-xs text-gray-500">{{ tx.date }} • {{ tx.category }}</p>
                            <p class="mt-1 font-bold text-green-600 dark:text-green-400 text-lg">+ {{ formatCurrency(tx.amount) }}</p>
                            <p class="text-xs text-gray-400" v-if="tx.project">{{ tx.project }}</p>
                        </div>
                        <img 
                            v-if="tx.avatar" 
                            :src="tx.avatar" 
                            alt="Avatar" 
                            class="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm dark:border-gray-800"
                        />
                        <div v-else class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 border-2 border-white shadow-sm dark:border-gray-800 dark:bg-green-900/30 dark:text-green-400">
                             <span class="text-lg font-bold">{{ tx.title.charAt(0) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Center Point -->
                <div class="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white dark:border-gray-900 z-10"
                     :class="tx.direction === 'incoming' ? 'bg-green-500' : 'bg-red-500'">
                    <svg v-if="tx.direction === 'incoming'" class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <svg v-else class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>

                <!-- Outgoing (Right Side) -->
                <div class="w-1/2 pl-8 flex justify-start">
                    <div v-if="tx.direction !== 'incoming'" class="flex items-center gap-4 text-left">
                        <img 
                            v-if="tx.avatar" 
                            :src="tx.avatar" 
                            alt="Avatar" 
                            class="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm dark:border-gray-800"
                        />
                         <div v-else class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 border-2 border-white shadow-sm dark:border-gray-800 dark:bg-red-900/30 dark:text-red-400">
                             <span class="text-lg font-bold">{{ tx.title.charAt(0) }}</span>
                        </div>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-white">{{ tx.title }}</p>
                            <p class="text-xs text-gray-500">{{ tx.date }} • {{ tx.category }}</p>
                            <p class="mt-1 font-bold text-red-600 dark:text-red-400 text-lg">- {{ formatCurrency(tx.amount) }}</p>
                             <p class="text-xs text-gray-400" v-if="tx.project">{{ tx.project }}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div v-if="transactions.length === 0" class="text-center text-gray-500 py-12">
                No recent transactions found.
            </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch, reactive } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import ApexCharts from 'apexcharts'
import { formatAmount } from '@/utils/currency'
import DateRangePicker from '@/components/forms/DateRangePicker.vue'
import ProjectSelect from '@/components/forms/ProjectSelect.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'

const toast = useToast()
const chartContainer = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null

const loading = ref(true)
const loadingAnalytics = ref(false)
const isFullscreen = ref(false)

// Global Stats (Dashboard)
const stats = ref<any>({})
const estimated = ref<any>({})
const netCash = computed(() => (stats.value.incoming_completed_total || 0) - (stats.value.outgoing_completed_total || 0))

// Dropdown Data
const projects = ref<any[]>([])
const customers = ref<any[]>([])

// Filter State
const filters = reactive({
  dateRange: '', // 'YYYY-MM-DD to YYYY-MM-DD'
  project_id: '',
  payer_id: '',
  type: 'all', // all, incoming, outgoing, expense
  is_expense: false
})

const typeOptions = [
  { value: 'all', label: '🔄 All Types' },
  { value: 'incoming', label: '⬇️ Incoming Only' },
  { value: 'outgoing', label: '⬆️ Outgoing Only' },
  { value: 'expense', label: '💸 Expenses Only' }
]

// Filtered Stats (from analytics endpoint)
const filteredStats = ref({
  incoming: 0,
  outgoing: 0,
  net: 0
})
const transactions = ref<any[]>([])

const fetchGlobalData = async () => {
  loading.value = true
  try {
    const res = await api.get('/crm/dashboard')
    stats.value = res.data.stats
    estimated.value = res.data.estimated
  } catch (e: any) {
    toast.error('Failed to load global stats')
  } finally {
    loading.value = false
  }
}

const fetchDropdowns = async () => {
  try {
    const [pRes, cRes] = await Promise.all([
      api.get('/projects?per_page=100'),
      api.get('/customers?per_page=100')
    ])
    projects.value = pRes.data.data
    customers.value = cRes.data.data
  } catch (e) {
    console.error('Failed to load dropdowns', e)
  }
}

const fetchAnalytics = async () => {
  loadingAnalytics.value = true
  try {
    const params: any = {}
    
    // Parse Date Range
    if (filters.dateRange) {
      if (typeof filters.dateRange === 'string' && filters.dateRange.includes('to')) {
        const [start, end] = filters.dateRange.split(' to ')
        params.start_date = start
        params.end_date = end
      } else {
         params.start_date = filters.dateRange
         params.end_date = filters.dateRange
      }
    }

    if (filters.project_id) params.project_id = filters.project_id
    if (filters.payer_id) params.payer_id = filters.payer_id
    
    if (filters.type === 'expense') {
      params.is_expense = 1
    } else if (filters.type !== 'all') {
      params.direction = filters.type // 'incoming' or 'outgoing'
    }

    const res = await api.get('/crm/analytics/cash-flow', { params })
    
    // Update Filtered Stats
    filteredStats.value = res.data.totals
    transactions.value = res.data.transactions || []

    // Render Chart
    // CRITICAL FIX: Set loading false BEFORE render so element exists
    loadingAnalytics.value = false
    await nextTick()
    renderChart(res.data)

  } catch (e: any) {
    console.error('Analytics error', e)
    toast.error('Failed to update analysis')
    loadingAnalytics.value = false
  }
}

const renderChart = (data: any) => {
  if (!chartContainer.value) return
  if (chart) chart.destroy()

  const showIncoming = filters.type !== 'outgoing' && filters.type !== 'expense'
  const showOutgoing = filters.type !== 'incoming'

  const series = []
  if (showIncoming) series.push({ name: 'Incoming', data: data.series.incoming })
  if (showOutgoing) series.push({ name: 'Outgoing', data: data.series.outgoing })
  series.push({ name: 'Net Flow', type: 'area', data: data.series.net })

  const options = {
    series: series,
    chart: {
      type: 'line',
      height: isFullscreen.value ? 460 : 400,
      fontFamily: 'inherit',
      toolbar: { show: false },
       animations: { enabled: true }
    },
    stroke: { width: [2, 2, 1], curve: 'smooth', dashArray: [0, 0, 5] },
    colors: ['#10B981', '#EF4444', '#6B7280'], // Green, Red, Gray
    dataLabels: { enabled: false },
    xaxis: { 
      categories: data.dates,
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: { formatter: (val: number) => formatCurrency(val) }
    },
    tooltip: {
      y: { formatter: (val: number) => formatCurrency(val) }
    },
    fill: {
        opacity: [1, 1, 0.1]
    },
    grid: {
        borderColor: '#f1f1f1',
    }
  }
  
  chart = new ApexCharts(chartContainer.value, options)
  chart.render()
}


const resetFilters = () => {
  filters.dateRange = ''
  filters.project_id = ''
  filters.payer_id = ''
  filters.type = 'all'
  filters.is_expense = false
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // chart resize handled by resize observer usually, but re-render helps
  nextTick(() => fetchAnalytics()) // simplified
}

const formatCurrency = (value: number | string | null | undefined) =>
  formatAmount(value, 'PKR', { compact: true })

onMounted(() => {
  fetchGlobalData()
  fetchDropdowns()
  fetchAnalytics() // Initial load
})

// Deep watch filters to re-fetch
watch(filters, () => {
  // Debounce could be added here
  fetchAnalytics()
}, { deep: true })

</script>
