<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div v-if="loading" class="flex justify-center py-10">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
    </div>

    <div v-else-if="schedule" class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ schedule.title || 'Scheduled Payment' }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ schedule.project?.name || 'No project' }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold"
              :class="schedule.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'"
            >
              {{ schedule.is_active ? 'Active' : 'Inactive' }}
            </span>
            <router-link
              :to="`/scheduled-payments/${schedule.id}/edit`"
              class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Edit
            </router-link>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</div>
            <div class="text-lg font-bold" :class="schedule.direction === 'incoming' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ formatCurrency(schedule.amount, schedule.currency) }}
            </div>
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Frequency</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {{ formatFrequency(schedule) }}
            </div>
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Generated</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ schedule.occurrences_count || 0 }}
              <span v-if="schedule.max_occurrences" class="text-sm text-gray-500">/ {{ schedule.max_occurrences }}</span>
            </div>
          </div>
          <div>
            <div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Next Due</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatDate(schedule.next_due_date) }}
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            Next {{ upcomingDates.length }} Payments
          </h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ formatCurrency((schedule?.amount || 0) * upcomingDates.length, schedule?.currency) }}
          </div>
        </div>
        <div v-if="upcomingDates.length === 0" class="text-center py-8 text-gray-500">
          No upcoming payments scheduled
        </div>
        <div v-else class="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          <div
            v-for="(date, index) in upcomingDates"
            :key="index"
            class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-semibold dark:bg-brand-900/30 dark:text-brand-400">
                {{ index + 1 }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatDate(date) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getRelativeTime(date) }}
                </div>
              </div>
            </div>
            <div class="text-sm font-semibold" :class="schedule.direction === 'incoming' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ formatCurrency(schedule.amount, schedule.currency) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { usePaymentSchedule } from '@/composables/usePaymentSchedule'
import { useToast } from '@/composables/useToast'
import { formatAmount } from '@/utils/currency'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getSchedule, previewDates } = usePaymentSchedule()

const pageTitle = ref('Scheduled Payment Preview')
const schedule = ref<any>(null)
const upcomingDates = ref<string[]>([])
const loading = ref(true)

const loadSchedule = async () => {
  try {
    const id = Number(route.params.id)
    schedule.value = await getSchedule(id)
    const preview = await previewDates(id, 20)
    upcomingDates.value = preview.dates || []
    pageTitle.value = schedule.value?.title || 'Scheduled Payment Preview'
  } catch (error) {
    toast.error('Schedule not found')
    router.push('/scheduled-payments')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value: number, currency: string = 'PKR') =>
  formatAmount(value, currency, { compact: true })

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Past due'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`
  if (diffDays < 365) return `In ${Math.floor(diffDays / 30)} months`
  return `In ${Math.floor(diffDays / 365)} years`
}

const formatFrequency = (schedule: any) => {
  if (!schedule) return '-'
  if (schedule.schedule_type === 'one_time') return 'One-time'
  const freq = schedule.frequency?.replace(/_/g, ' ') || 'Unknown'
  const interval = schedule.interval > 1 ? `Every ${schedule.interval} ` : ''
  return `${interval}${freq}`
}

onMounted(() => {
  loadSchedule()
})
</script>
