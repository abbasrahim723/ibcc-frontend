<template>
  <div class="flex">
    <div class="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
      <div class="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 border-r border-gray-300 dark:border-gray-700">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">+92</span>
      </div>
      <input
        :value="modelValue"
        @input="handleInput"
        type="tel"
        :placeholder="placeholder"
        :class="[
          'px-3 py-2 focus:outline-none focus:ring-1 w-full',
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'focus:border-brand-500 focus:ring-brand-500',
          'dark:bg-gray-800 dark:text-white'
        ]"
        maxlength="10"
      />
    </div>
    <p v-if="hasError && errorMessage" class="mt-1 text-xs text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  hasError?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '3001234567',
  hasError: false,
  errorMessage: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Only allow digits
  const value = target.value.replace(/\D/g, '')
  emit('update:modelValue', value)
}
</script>
