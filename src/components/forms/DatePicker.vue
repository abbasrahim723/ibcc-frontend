<template>
  <div class="relative">
    <flat-pickr
      v-model="dateValue"
      :config="config"
      class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 h-11"
      :placeholder="placeholder"
      @on-close="handleClose"
      @on-change="handleChange"
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg v-if="mode === 'range'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/themes/material_blue.css'

const props = defineProps({
  modelValue: {
    type: [String, Date, Array] as any,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select date'
  },
  mode: {
    type: String as () => 'single' | 'range' | 'multiple',
    default: 'single'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const dateValue = ref(props.modelValue)

const config = computed(() => ({
  mode: props.mode,
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: props.mode === 'range' ? 'd/m/Y' : 'M j, Y',
  allowInput: true,
}))

watch(
  () => props.modelValue,
  (newVal) => {
    dateValue.value = newVal
  }
)

const handleChange = (selectedDates: Date[], dateStr: string) => {
  emit('update:modelValue', dateStr)
  emit('change', selectedDates)
}

const handleClose = (selectedDates: Date[], dateStr: string) => {
  emit('update:modelValue', dateStr)
  emit('change', selectedDates)
}
</script>

<style scoped>
:deep(.flatpickr-calendar) {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

:deep(.dark .flatpickr-calendar) {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

:deep(.dark .flatpickr-current-month .flatpickr-monthDropdown-months),
:deep(.dark .flatpickr-current-month input.cur-year) {
  color: white;
}

:deep(.dark .flatpickr-weekday) {
  color: #9ca3af;
}

:deep(.dark .flatpickr-day) {
  color: #e5e7eb;
}

:deep(.dark .flatpickr-day.flatpickr-disabled) {
  color: #4b5563;
}

:deep(.dark .flatpickr-day:hover) {
  background: #374151;
}

:deep(.dark .flatpickr-calendar.arrowTop:before),
:deep(.dark .flatpickr-calendar.arrowTop:after) {
  border-bottom-color: #1f2937;
}
</style>
