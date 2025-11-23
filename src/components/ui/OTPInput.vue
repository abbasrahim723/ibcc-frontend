<template>
  <div class="space-y-4">
    <div class="flex justify-center gap-2">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="(el) => (inputRefs[index] = el as HTMLInputElement)"
        v-model="digits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
        :class="[
          error 
            ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/20 animate-shake' 
            : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
        ]"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </div>

    <div class="text-center">
      <p v-if="error" class="mb-3 text-sm font-medium text-red-500 animate-pulse">
        Invalid code. Please try again.
      </p>
      <button
        v-if="canResend"
        @click="$emit('resend')"
        :disabled="isResending"
        class="text-sm text-brand-500 hover:text-brand-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isResending ? 'Sending...' : 'Resend Code' }}
      </button>
      <p v-else class="text-sm text-gray-500 dark:text-gray-400">
        Resend code in {{ formatTime(countdown) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  countdown: number
  canResend: boolean
  isResending?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  complete: [code: string]
  resend: []
  'update:error': [value: boolean]
}>()

const digits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

const handleInput = (index: number, event: Event) => {
  if (props.error) {
    emit('update:error', false)
  }
  
  const input = event.target as HTMLInputElement
  const value = input.value

  // Only allow numbers
  if (value && !/^\d$/.test(value)) {
    digits.value[index] = ''
    return
  }

  // Move to next input
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }

  // Check if all digits are filled
  checkComplete()
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (props.error) {
    emit('update:error', false)
  }

  // Handle backspace
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  if (props.error) {
    emit('update:error', false)
  }
  
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  
  if (pastedData && /^\d{6}$/.test(pastedData)) {
    const pastedDigits = pastedData.split('')
    digits.value = pastedDigits
    inputRefs.value[5]?.focus()
    checkComplete()
  }
}

const checkComplete = () => {
  const code = digits.value.join('')
  if (code.length === 6 && /^\d{6}$/.test(code)) {
    emit('complete', code)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const reset = () => {
  digits.value = ['', '', '', '', '', '']
  inputRefs.value[0]?.focus()
}

onMounted(() => {
  inputRefs.value[0]?.focus()
})

defineExpose({ reset })
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
