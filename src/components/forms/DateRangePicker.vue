<template>
  <div class="relative">
    <flat-pickr
      v-model="dateRange"
      :config="config"
      class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      placeholder="Select Date Range"
      @on-close="handleClose"
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const props = defineProps({
  modelValue: {
    type: [Array, String] as any,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const dateRange = ref(props.modelValue)

const config: any = {
  mode: 'range',
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'M j, Y',
  allowInput: true,
}

watch(() => props.modelValue, (newVal) => {
  dateRange.value = newVal
})

const handleClose = (selectedDates: Date[]) => {
  // Flatpickr returns Date objects, we might want to emit formatted strings or keep as is
  // For API filtering, usually YYYY-MM-DD strings are best.
  // However, vue-flatpickr-component v-model usually syncs the string value based on dateFormat if not wrapped?
  // Actually, let's check what v-model gives.
  // With mode: 'range', it gives a string "start to end" if not handled carefully, 
  // but usually we want to emit the array or the raw string.
  // Let's emit the raw value from the input which flatpickr updates.
  
  // Actually, let's just emit the selectedDates array or the string representation
  emit('update:modelValue', dateRange.value)
  emit('change', dateRange.value)
}
</script>

<style scoped>
:deep(.flatpickr-calendar) {
  background-color: white;
  border-color: #e5e7eb;
  color: #111827;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.dark .flatpickr-calendar) {
  background-color: #1f2937;
  border-color: #374151;
  color: white;
}

:deep(.flatpickr-day) {
  color: #374151;
}

:deep(.dark .flatpickr-day) {
  color: #d1d5db;
}

:deep(.flatpickr-day:hover) {
  background-color: #f3f4f6;
}

:deep(.dark .flatpickr-day:hover) {
  background-color: #374151;
}

:deep(.flatpickr-day.selected),
:deep(.flatpickr-day.startRange),
:deep(.flatpickr-day.endRange),
:deep(.flatpickr-day.selected.inRange),
:deep(.flatpickr-day.startRange.inRange),
:deep(.flatpickr-day.endRange.inRange) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.flatpickr-day.inRange) {
  background-color: #dbeafe;
  box-shadow: none;
  border: none;
}

:deep(.dark .flatpickr-day.inRange) {
  background-color: rgba(37, 99, 235, 0.3);
}

:deep(.flatpickr-months .flatpickr-month) {
  background-color: white;
  color: #111827;
}

:deep(.dark .flatpickr-months .flatpickr-month) {
  background-color: #1f2937;
  color: white;
}

:deep(.flatpickr-current-month .flatpickr-monthDropdown-months) {
  background-color: white;
  color: #111827;
}

:deep(.dark .flatpickr-current-month .flatpickr-monthDropdown-months) {
  background-color: #1f2937;
  color: white;
}

:deep(.flatpickr-months .flatpickr-prev-month),
:deep(.flatpickr-months .flatpickr-next-month) {
  color: #111827;
  fill: #111827;
}

:deep(.dark .flatpickr-months .flatpickr-prev-month),
:deep(.dark .flatpickr-months .flatpickr-next-month) {
  color: white;
  fill: white;
}
</style>
