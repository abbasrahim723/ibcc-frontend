<template>
  <div>
    <div class="flex gap-0">
      <div class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
        +92
      </div>
      <input
        :value="modelValue"
        @input="handleInput"
        type="tel"
        :placeholder="placeholder"
        maxlength="10"
        :required="required"
        class="rounded-none rounded-r-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white flex-1"
        :class="{ 'border-red-500': error }"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '3001234567',
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const error = ref('')

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove non-digits
  
  // Limit to 10 digits
  if (value.length > 10) {
    value = value.slice(0, 10)
  }
  
  // Validate format
  if (value.length > 0 && value.length < 10) {
    error.value = 'Phone number must be 10 digits'
  } else if (value.length === 10 && !value.startsWith('3')) {
    error.value = 'Mobile number must start with 3'
  } else {
    error.value = ''
  }
  
  emit('update:modelValue', value)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.length === 10 && newValue.startsWith('3')) {
    error.value = ''
  }
})
</script>
