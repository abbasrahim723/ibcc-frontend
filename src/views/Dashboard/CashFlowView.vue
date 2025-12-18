<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Cash Flow" />

    <div class="space-y-6">
      <!-- KPIs -->
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
              <p class="text-sm text-gray-500 dark:text-gray-400">Incoming (Completed)</p>
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
              <p class="text-sm text-gray-500 dark:text-gray-400">Outgoing (Completed)</p>
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
              <p class="text-sm text-gray-500 dark:text-gray-400">Pending / Scheduled Incoming</p>
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

      <!-- Chart -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <!-- Chart Loading Skeleton -->
        <div v-if="loading" class="animate-pulse">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <div class="h-6 bg-gray-200 rounded w-40 mb-2 dark:bg-gray-700"></div>
              <div class="h-4 bg-gray-200 rounded w-56 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-8 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
              <div class="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          </div>
          <div :class="isFullscreen ? 'h-[460px]' : 'h-[320px]'" class="bg-gray-100 rounded dark:bg-gray-800"></div>
        </div>

        <!-- Actual Chart -->
        <div v-else>
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow Trend</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Incoming vs outgoing vs forecast</p>
            </div>
            <div class="flex items-center gap-2">
              <select v-model.number="chartRange" @change="renderChart" class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option :value="12">Last 12 months</option>
                <option :value="6">Last 6 months</option>
                <option :value="3">Last 3 months</option>
              </select>
              <button @click="toggleFullscreen" class="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V5a1 1 0 011-1h3m8 0h3a1 1 0 011 1v3m0 8v3a1 1 0 01-1 1h-3m-8 0H5a1 1 0 01-1-1v-3" />
                </svg>
              </button>
            </div>
          </div>
          <div ref="chartContainer" :class="isFullscreen ? 'h-[460px]' : 'h-[320px]'"></div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import ApexCharts from 'apexcharts'
import { formatAmount } from '@/utils/currency'

const toast = useToast()
const chartContainer = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null

const loading = ref(true)

const stats = ref<any>({
  incoming_completed_total: 0,
  incoming_completed_count: 0,
  outgoing_completed_total: 0,
  outgoing_completed_count: 0
})
const revenueAnalytics = ref<any>({
  monthly_incoming: [],
  monthly_outgoing: [],
  monthly_forecast: []
})
const estimated = ref<any>({
  incoming_pending_month: 0
})

const chartRange = ref(12)
const isFullscreen = ref(false)

const netCash = computed(() => (stats.value.incoming_completed_total || 0) - (stats.value.outgoing_completed_total || 0))

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/crm/dashboard')
    stats.value = res.data.stats
    revenueAnalytics.value = res.data.revenue_analytics
    estimated.value = res.data.estimated
    // Ensure chart renders after DOM is fully updated
    setTimeout(() => renderChart(), 200)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Failed to load cash flow data')
  } finally {
    loading.value = false
  }
}

const renderChart = () => {
  if (!chartContainer.value) {
    // Retry after a short delay if container not ready
    setTimeout(() => renderChart(), 100)
    return
  }
  if (chart) chart.destroy()

  const months = revenueAnalytics.value.monthly_incoming?.map((m: any) => m.month) || []
  const incoming = (revenueAnalytics.value.monthly_incoming || []).map((i: any) => Number(i.revenue) || 0)
  const outgoing = (revenueAnalytics.value.monthly_outgoing || []).map((i: any) => Number(i.revenue) || 0)
  const forecast = (revenueAnalytics.value.monthly_forecast || []).map((i: any) => Number(i.revenue) || 0)

  const slice = chartRange.value ? -chartRange.value : undefined
  const categories = slice ? months.slice(slice) : months
  const incomingData = slice ? incoming.slice(slice) : incoming
  const outgoingData = slice ? outgoing.slice(slice) : outgoing
  const forecastData = slice ? forecast.slice(slice) : forecast

  const options = {
    series: [
      { name: 'Incoming (Completed)', data: incomingData },
      { name: 'Outgoing (Completed)', data: outgoingData },
      { name: 'Incoming (Forecast)', data: forecastData }
    ],
    chart: {
      type: 'line',
      height: isFullscreen.value ? 460 : 320,
      toolbar: { show: false }
    },
    stroke: { width: [2, 2, 2], curve: 'smooth' },
    markers: { size: 3 },
    colors: ['#10B981', '#EF4444', '#6366F1'],
    dataLabels: { enabled: false },
    xaxis: { categories },
    yaxis: {
      labels: {
        formatter: (val: number) => formatCurrency(val)
      }
    },
    tooltip: {
      y: { formatter: (val: number) => formatCurrency(val) }
    }
  }

  chart = new ApexCharts(chartContainer.value, options)
  chart.render()
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  nextTick(() => renderChart())
}

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') =>
  formatAmount(value, currency, { compact: true })

onMounted(() => {
  fetchData()
})

watch(chartRange, () => {
  renderChart()
})

watch(isFullscreen, () => {
  nextTick(() => renderChart())
})
</script>
