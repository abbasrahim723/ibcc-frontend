<template>
  <div class="relative">
    <flat-pickr
      v-model="dateValue"
      :config="config"
      class="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      :placeholder="placeholder"
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
    type: [String, Date] as any,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select date'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const dateValue = ref(props.modelValue)

const config: any = {
  mode: 'single',
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'M j, Y',
  allowInput: true
}

watch(
  () => props.modelValue,
  (newVal) => {
    dateValue.value = newVal
  }
)

watch(
  dateValue,
  (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
)

const handleClose = () => {
  emit('update:modelValue', dateValue.value)
  emit('change', dateValue.value)
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

:deep(.flatpickr-day.selected) {
  background-color: #2563eb;
  border-color: #2563eb;
  color: white;
}
</style>
