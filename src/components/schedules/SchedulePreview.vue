<template>
  <div
    class="fixed inset-0 z-[9999] overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

      <div class="relative bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ schedule?.title || 'Schedule Preview' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upcoming payment dates
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Schedule Info -->
          <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount</div>
              <div class="text-lg font-bold" :class="[
                schedule?.direction === 'incoming' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              ]">
                {{ formatCurrency(schedule?.amount, schedule?.currency) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Frequency</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {{ formatFrequency(schedule) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Generated</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ schedule?.occurrences_count || 0 }}
                <span v-if="schedule?.max_occurrences" class="text-sm text-gray-500">/ {{ schedule.max_occurrences }}</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Status</div>
              <div>
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                  :class="[
                    schedule?.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  ]"
                >
                  {{ schedule?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent"></div>
            <p class="text-sm text-gray-500 mt-2">Loading preview...</p>
          </div>

          <!-- Upcoming Dates -->
          <div v-else-if="upcomingDates.length > 0">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                Next {{ upcomingDates.length }} Payments
              </h4>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Total: {{ formatCurrency((schedule?.amount || 0) * upcomingDates.length, schedule?.currency) }}
              </div>
            </div>

            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="(date, index) in upcomingDates"
                :key="index"
                class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-semibold">
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
                <div class="text-sm font-semibold" :class="[
                  schedule?.direction === 'incoming' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                ]">
                  {{ formatCurrency(schedule?.amount, schedule?.currency) }}
                </div>
              </div>
            </div>
          </div>

          <!-- No Dates -->
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-gray-500 mt-2">No upcoming payments scheduled</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t dark:border-gray-700">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import { usePaymentSchedule } from '@/composables/usePaymentSchedule'
import { formatAmount } from '@/utils/currency'

interface Props {
  schedule: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { previewDates } = usePaymentSchedule()
const loading = ref(false)
const upcomingDates = ref<string[]>([])

const loadPreview = async () => {
  if (!props.schedule?.id) return

  loading.value = true
  try {
    const result = await previewDates(props.schedule.id, 10)
    upcomingDates.value = result.dates || []
  } catch (error) {
    console.error('Failed to load preview:', error)
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
  loadPreview()
})
</script>
