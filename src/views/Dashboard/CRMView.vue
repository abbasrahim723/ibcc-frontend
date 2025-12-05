<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <!-- Active Customers -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Customers</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active_customers || 0 }}</h3>
              <div class="mt-2 flex items-center gap-2">
                <span :class="getTrendClass(stats.trends?.customers)" class="text-sm font-semibold">
                  {{ stats.trends?.customers || '0%' }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">From last month</span>
              </div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg class="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Total</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.total_revenue) }}</h3>
              <div class="mt-2 flex items-center gap-2">
                <span :class="getTrendClass(stats.trends?.revenue)" class="text-sm font-semibold">
                  {{ stats.trends?.revenue || '0%' }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">From last month</span>
              </div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg class="h-7 w-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Closed Deals -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Closed Deals</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.closed_deals || 0 }}</h3>
              <div class="mt-2 flex items-center gap-2">
                <span :class="getTrendClass(stats.trends?.deals)" class="text-sm font-semibold">
                  {{ stats.trends?.deals || '0%' }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">From last month</span>
              </div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <svg class="h-7 w-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Progress -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Revenue trends over time</p>
          </div>
          
          <div class="mb-6 flex items-center gap-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Avg. Yearly Profit</p>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(revenueAnalytics.yearly_profit) }}</h4>
              <span class="text-sm font-semibold text-green-600">+25.2%</span>
            </div>
          </div>

          <div ref="chartContainer" class="h-[300px]"></div>
        </div>

        <!-- Estimated Revenue Circle -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Estimated Revenue</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Target you've set for each month</p>
          </div>

          <div class="flex flex-col items-center justify-center py-8">
            <div class="relative h-48 w-48">
              <svg class="h-full w-full -rotate-90 transform">
                <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="none" class="text-gray-200 dark:text-gray-700" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="none" class="text-brand-600 dark:text-brand-400" 
                  :stroke-dasharray="`${(revenueAnalytics.target / 100) * 553} 553`" stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">June Goals</span>
                <span class="text-3xl font-bold text-gray-900 dark:text-white">${{ revenueAnalytics.target }}</span>
              </div>
            </div>

            <div class="mt-8 w-full space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Marketing</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">$30,569.00</span>
              </div>
              <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-full w-[85%] rounded-full bg-brand-600"></div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">85%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Customers & Recent Activities -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Top Customers -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top Customers</h3>
          <div class="space-y-4">
            <div v-for="customer in topCustomers" :key="customer.id" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <span class="text-sm font-bold text-white">{{ customer.name?.charAt(0)?.toUpperCase() }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ customer.email || 'No email' }}</p>
                </div>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(customer.total_revenue) }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
          <div class="space-y-4 max-h-[400px] overflow-y-auto">
            <div v-for="(activity, index) in recentActivities" :key="index" class="flex gap-3">
              <div class="flex-shrink-0">
                <div :class="getActivityIconClass(activity.type)" class="h-8 w-8 rounded-full flex items-center justify-center">
                  <svg v-if="activity.type === 'payment'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import ApexCharts from 'apexcharts'

const toast = useToast()
const currentPageTitle = ref('CRM Dashboard')
const chartContainer = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null

const stats = ref({
  active_customers: 0,
  total_revenue: 0,
  closed_deals: 0,
  active_deals: 0,
  trends: {
    customers: '0%',
    revenue: '0%',
    deals: '0%'
  }
})

const revenueAnalytics = ref({
  monthly: [],
  yearly_profit: 0,
  target: 90
})

const topCustomers = ref<any[]>([])
const recentActivities = ref<any[]>([])
const pipeline = ref({
  planning: 0,
  in_progress: 0,
  completed: 0,
  on_hold: 0,
  cancelled: 0
})

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/crm/dashboard')
    const data = response.data

    stats.value = data.stats
    revenueAnalytics.value = data.revenue_analytics
    topCustomers.value = data.top_customers
    recentActivities.value = data.recent_activities
    pipeline.value = data.pipeline

    await nextTick()
    renderChart()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching dashboard data')
  }
}

const renderChart = () => {
  if (!chartContainer.value) return

  if (chart) {
    chart.destroy()
  }

  const months = revenueAnalytics.value.monthly.map((item: any) => item.month)
  const revenues = revenueAnalytics.value.monthly.map((item: any) => parseFloat(item.revenue))

  const options = {
    series: [{
      name: 'Revenue',
      data: revenues
    }],
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      }
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF'
        },
        formatter: (value: number) => formatCurrency(value)
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    colors: ['#3B82F6'],
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    }
  }

  chart = new ApexCharts(chartContainer.value, options)
  chart.render()
}

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') => {
  if (value === null || value === undefined) return '—'
  const num = Number(value) || 0
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(num)
  return `${currency} ${formatted}`
}

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return d.toLocaleDateString()
}

const getTrendClass = (trend: string) => {
  if (!trend) return 'text-gray-500'
  return trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
}

const getActivityIconClass = (type: string) => {
  if (type === 'payment') {
    return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  }
  return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
}

onMounted(() => {
  fetchDashboardData()
})
</script>
