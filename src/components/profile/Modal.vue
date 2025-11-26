<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div @click="handleBackdropClick" class="fixed inset-0 h-full w-full bg-transparent"></div>
    <div
      class="relative z-10 w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const handleBackdropClick = () => {
  emit('close')
}
</script>
