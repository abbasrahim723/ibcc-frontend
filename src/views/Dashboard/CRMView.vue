<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Projects -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active_projects || 0 }}</h3>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">In progress / planning</div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <svg class="h-7 w-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Suppliers -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Suppliers</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active_suppliers || 0 }}</h3>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Providing materials / services</div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
              <svg class="h-7 w-7 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Labour -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Labour/Staff</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active_labours || 0 }}</h3>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">On active projects</div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg class="h-7 w-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
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
              <div class="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-green-600 border border-green-200">
                Rs
              </div>
            </div>
          </div>
        </div>

        <!-- Outgoing Payments -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Outgoing (Completed)</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.outgoing_completed_total) }}</h3>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Payments made ({{ stats.outgoing_completed_count || 0 }} items)</div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <div class="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-red-600 border border-red-200">
                Rs
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Projects -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Projects</p>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Incoming (Completed) -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Incoming (Completed)</p>
              <h3 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.incoming_completed_total) }}</h3>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Payments received ({{ stats.incoming_completed_count || 0 }} items)</div>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <div class="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-green-600 border border-green-200">
                Rs
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Progress -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Revenue Chart -->
        <div :class="['rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]', isFullscreen ? 'lg:col-span-3' : 'lg:col-span-2']">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Revenue trends over time</p>
            </div>
            <div class="flex items-center gap-3">
              <select v-model="chartRange" @change="handleRangeChange" class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option :value="12">Last 12 months (monthly)</option>
                <option :value="6">Last 6 months (monthly)</option>
                <option :value="3">Last 3 months (monthly)</option>
                <option :value="1">Last month (monthly)</option>
                <option value="week">Selected month (weekly)</option>
              </select>
              <FlatPickr
                v-if="chartRange === 'week'"
                v-model="chartMonth"
                :config="monthPickerConfig"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button @click="toggleFullscreen" class="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700" title="Toggle fullscreen">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V5a1 1 0 011-1h3M4 16v3a1 1 0 001 1h3m8-15h3a1 1 0 011 1v3m-4 12h3a1 1 0 001-1v-3" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="mb-6 flex items-center gap-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Avg. Yearly Profit</p>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(revenueAnalytics.yearly_profit) }}</h4>
              <span class="text-sm font-semibold text-green-600">+25.2%</span>
            </div>
          </div>

          <div ref="chartContainer" :class="isFullscreen ? 'h-[480px]' : 'h-[320px]'"></div>
        </div>

        <!-- Estimated Revenue Circle -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Estimated Revenue</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Current month incoming (completed vs pending/scheduled)</p>
          </div>

          <div class="flex flex-col items-center gap-6">
            <div class="relative h-48 w-48">
              <svg class="h-full w-full -rotate-90 transform">
                <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="none" class="text-gray-200 dark:text-gray-700" />
                <circle
                  cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="none"
                  class="text-brand-600 dark:text-brand-400"
                  :stroke-dasharray="`${(estimatedProgress / 100) * 553} 553`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">This Month</span>
                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ estimatedProgress }}%</span>
              </div>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(estimated.incoming_completed_month) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Pending / Scheduled</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(estimated.incoming_pending_month) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Monthly Target</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(estimated.target || 0) }}
                </span>
              </div>
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
                <img
                  v-if="getCustomerPhoto(customer)"
                  :src="getCustomerPhoto(customer)"
                  class="h-10 w-10 rounded-full object-cover border border-gray-200"
                />
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-bold text-white"
                >
                  {{ customer.name?.charAt(0)?.toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCustomerName(customer) }}</p>
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
                  <svg v-if="activity.type === 'payment_in'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg v-else-if="activity.type === 'payment_out'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
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
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import ApexCharts from 'apexcharts'
import FlatPickr from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { formatAmount } from '@/utils/currency'

const toast = useToast()
const currentPageTitle = ref('CRM Dashboard')
const chartContainer = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null

const stats = ref({
  active_customers: 0,
  active_projects: 0,
  active_suppliers: 0,
  active_labours: 0,
  outgoing_completed_total: 0,
  outgoing_completed_count: 0,
  incoming_completed_total: 0,
  incoming_completed_count: 0,
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
  monthly_outgoing: [],
  monthly_incoming: [],
  yearly_profit: 0,
  target: 90
})

const estimated = ref({
  incoming_completed_month: 0,
  incoming_pending_month: 0
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

const chartRange = ref<any>(12)
const isFullscreen = ref(false)
const chartMonth = ref('')
const monthPickerConfig = {
  altInput: true,
  altFormat: 'F Y',
  dateFormat: 'Y-m',
  allowInput: true,
  plugins: [
    new monthSelectPlugin({
      shorthand: true,
      dateFormat: 'Y-m',
      altFormat: 'F Y',
      theme: 'light'
    })
  ]
}

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/crm/dashboard')
    const data = response.data

    stats.value = data.stats
    revenueAnalytics.value = data.revenue_analytics
    estimated.value = data.estimated
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

  let categories: string[] = []
  let incomingData: number[] = []
  let outgoingData: number[] = []
  let forecastData: number[] = []

  if (chartRange.value === 'week' && chartMonth.value) {
    // Weekly breakdown for selected month
    const [year, month] = chartMonth.value.split('-').map(v => parseInt(v))
    const weeks = Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`)
    categories = weeks

    // derive weekly sums from monthly incoming/outgoing by naive split if backend not weekly
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    const incMonth = (revenueAnalytics.value.monthly_incoming || []).find((m: any) => m.month === monthKey)
    const outMonth = (revenueAnalytics.value.monthly_outgoing || []).find((m: any) => m.month === monthKey)
    const forMonth = (revenueAnalytics.value.monthly_forecast || []).find((m: any) => m.month === monthKey)

    const incTotal = incMonth ? parseFloat(incMonth.revenue) : 0
    const outTotal = outMonth ? parseFloat(outMonth.revenue) : 0
    const forTotal = forMonth ? parseFloat(forMonth.revenue) : 0

    // simple distribution placeholder: evenly divide into weeks
    incomingData = weeks.map(() => incTotal / weeks.length)
    outgoingData = weeks.map(() => outTotal / weeks.length)
    forecastData = weeks.map(() => forTotal / weeks.length)
  } else {
    const months = revenueAnalytics.value.monthly_incoming?.map((item: any) => item.month) || []
    const incoming = (revenueAnalytics.value.monthly_incoming || []).map((i: any) => parseFloat(i.revenue))
    const outgoing = (revenueAnalytics.value.monthly_outgoing || []).map((i: any) => parseFloat(i.revenue))
    const forecast = (revenueAnalytics.value.monthly_forecast || []).map((i: any) => parseFloat(i.revenue))

    const slice = typeof chartRange.value === 'number' ? -Math.min(months.length, chartRange.value) : undefined
    categories = slice ? months.slice(slice) : months
    incomingData = slice ? incoming.slice(slice) : incoming
    outgoingData = slice ? outgoing.slice(slice) : outgoing
    forecastData = slice ? forecast.slice(slice) : forecast
  }

  const options = {
    series: [
      {
        name: 'Incoming (Completed)',
        data: incomingData
      },
      {
        name: 'Outgoing (Completed)',
        data: outgoingData
      },
      {
        name: 'Incoming (Forecast)',
        data: forecastData
      }
    ],
    chart: {
      type: 'line',
      stacked: false,
      height: isFullscreen.value ? 480 : 320,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { width: [2, 2, 2], curve: 'smooth' },
    markers: { size: 3 },
    xaxis: {
      categories,
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
    colors: ['#10B981', '#EF4444', '#6366F1'],
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    },
    events: {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        if (config?.w?.globals?.categoryLabels) {
          const selectedMonth = config.w.globals.categoryLabels[config.dataPointIndex]
          if (selectedMonth) {
            chartRange.value = 'week'
            chartMonth.value = selectedMonth
            nextTick(() => renderChart())
          }
        }
      }
    }
  }

  chart = new ApexCharts(chartContainer.value, options)
  chart.render()
}

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') => {
  return formatAmount(value, currency, { compact: true })
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
  if (type === 'payment_in') {
    return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  }
  if (type === 'payment_out') {
    return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  }
  return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
}

const estimatedProgress = computed(() => {
  const completed = Number(estimated.value.incoming_completed_month || 0)
  const pending = Number(estimated.value.incoming_pending_month || 0)
  const total = completed + pending
  if (!total || Number.isNaN(total)) return 0
  const pct = (completed / total) * 100
  return Math.min(100, Math.round(pct))
})

const getCustomerPhoto = (c: any) => {
  if (!c) return ''
  const path = c.profile_photo_url || c.photo || c.avatar || c.profile_photo
  return path ? makeAbsoluteUrl(path) : ''
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  let base = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  base = base.replace(/\/api\/?$/, '')
  base = base.replace(/\/$/, '')
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

const formatCustomerName = (customer: any) => {
  if (!customer) return ''
  const prefix = customer.name_prefix ? `${customer.name_prefix} ` : ''
  return `${prefix}${customer.name || ''}`.trim()
}

onMounted(() => {
  fetchDashboardData()
})

watch(chartMonth, () => {
  if (chartRange.value === 'week') renderChart()
})

const handleRangeChange = () => {
  if (chartRange.value === 'week' && !chartMonth.value) {
    const now = new Date()
    chartMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
  renderChart()
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  nextTick(() => renderChart())
}
</script>
