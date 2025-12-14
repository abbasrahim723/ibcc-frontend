<template>
  <div
    class="group relative rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
    :class="[
      schedule.direction === 'incoming' 
        ? 'border-green-200 dark:border-green-900/30' 
        : 'border-red-200 dark:border-red-900/30',
      isDue ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : '',
      isEnded ? 'opacity-60' : ''
    ]"
  >
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <h5 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {{ schedule.title || 'Untitled Schedule' }}
        </h5>
        <p v-if="schedule.project" class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {{ schedule.project.name }}
        </p>
      </div>
      
      <!-- Direction Badge -->
      <span
        class="ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="[
          schedule.direction === 'incoming'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        ]"
      >
        {{ schedule.direction === 'incoming' ? 'In' : 'Out' }}
      </span>
    </div>

    <!-- Amount -->
    <div class="mb-3">
      <div class="text-2xl font-bold" :class="[
        schedule.direction === 'incoming' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      ]">
        {{ formatCurrency(schedule.amount, schedule.currency) }}
      </div>
    </div>

    <!-- Schedule Info -->
    <div class="space-y-2 mb-3">
      <!-- Frequency -->
      <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="capitalize">{{ formatFrequency(schedule) }}</span>
      </div>

      <!-- Next Due Date -->
      <div v-if="schedule.next_due_date" class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Next: {{ formatDate(schedule.next_due_date) }}</span>
      </div>

      <!-- Occurrences -->
      <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>{{ schedule.occurrences_count }} generated</span>
        <span v-if="schedule.max_occurrences" class="text-gray-400">/ {{ schedule.max_occurrences }}</span>
      </div>

      <!-- Payer -->
      <div v-if="schedule.payer" class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="truncate">{{ schedule.payer.name }}</span>
      </div>
    </div>

    <!-- Status Badge -->
    <div class="mb-3">
      <span
        v-if="!schedule.is_active"
        class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Inactive
      </span>
      <span
        v-else-if="isDue"
        class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Due Now
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Active
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
      <button
        v-if="can('scheduled_payments', 'view')"
        @click="$emit('preview', schedule)"
        class="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        title="Preview Dates"
      >
        Preview
      </button>

      <button
        v-if="can('scheduled_payments', 'edit') && !isEnded"
        @click="$emit('edit', schedule)"
        class="flex-1 rounded-md bg-brand-100 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50"
        title="Edit Schedule"
      >
        Edit
      </button>

      <button
        v-if="can('scheduled_payments', 'edit') && !isEnded"
        @click="$emit('toggle-active', schedule)"
        class="rounded-md px-3 py-1.5 text-xs font-medium"
        :class="[
          schedule.is_active
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
        ]"
        :title="schedule.is_active ? 'Deactivate' : 'Activate'"
      >
        {{ schedule.is_active ? 'Pause' : 'Resume' }}
      </button>

      <button
        v-if="can('scheduled_payments', 'delete')"
        @click="$emit('delete', schedule)"
        class="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        title="Delete Schedule"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { formatAmount } from '@/utils/currency'

interface Props {
  schedule: any
  isDue?: boolean
  isEnded?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['edit', 'delete', 'toggle-active', 'preview'])
const { can } = usePermissions()

const formatCurrency = (value: number, currency: string = 'PKR') =>
  formatAmount(value, currency, { compact: true })

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatFrequency = (schedule: any) => {
  if (schedule.schedule_type === 'one_time') {
    return 'One-time'
  }
  
  const freq = schedule.frequency?.replace(/_/g, ' ') || 'Unknown'
  const interval = schedule.interval > 1 ? `Every ${schedule.interval} ` : ''
  
  return `${interval}${freq}`
}
</script>
