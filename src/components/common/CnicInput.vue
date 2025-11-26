<template>
  <div class="relative">
    <input
      :value="formattedValue"
      @input="handleInput"
      @blur="$emit('blur')"
      type="text"
      placeholder="12345-1234567-1"
      maxlength="15"
      :class="[
        'w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1',
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700',
        'dark:bg-gray-800 dark:text-white'
      ]"
    />
    <p v-if="hasError && errorMessage" class="mt-1 text-xs text-red-600">
      {{ errorMessage }}
    </p>
    <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      Format: 12345-1234567-1
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string
  hasError?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const formattedValue = computed(() => {
  return formatCnic(props.modelValue || '')
})

const formatCnic = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  // Apply formatting: xxxxx-xxxxxxx-x
  let formatted = ''
  
  if (digits.length > 0) {
    formatted = digits.substring(0, 5)
  }
  if (digits.length > 5) {
    formatted += '-' + digits.substring(5, 12)
  }
  if (digits.length > 12) {
    formatted += '-' + digits.substring(12, 13)
  }
  
  return formatted
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  // Limit to 13 digits
  const limitedDigits = digits.substring(0, 13)
  
  // Emit the formatted value with dashes
  const formatted = formatCnic(limitedDigits)
  emit('update:modelValue', formatted)
}
</script>
