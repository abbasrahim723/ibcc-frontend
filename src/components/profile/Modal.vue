<template>
  <div v-if="isOpen" class="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
    <div @click="handleBackdropClick" class="fixed inset-0 bg-black/40 z-[1000001]"></div>

    <div class="relative z-[1000002] w-full sm:w-auto sm:max-w-[90vw]">
      <div
        class="relative w-full sm:w-auto sm:min-w-[360px] sm:max-w-[720px] max-h-[90vh] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl sm:rounded-2xl overflow-hidden flex flex-col"
      >
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          <slot v-if="$slots.default"></slot>
          <slot name="body" v-else></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const handleBackdropClick = () => {
  emit('close')
}

const lockBodyScroll = () => {
  try {
    document.body.style.overflow = 'hidden'
  } catch (e) {
    // noop for SSR or non-browser environments
  }
}

const unlockBodyScroll = () => {
  try {
    document.body.style.overflow = ''
  } catch (e) {
    // noop
  }
}

watch(() => props.isOpen, (open) => {
  if (open) lockBodyScroll()
  else unlockBodyScroll()
})

onMounted(() => {
  if (props.isOpen) lockBodyScroll()
})

onBeforeUnmount(() => {
  unlockBodyScroll()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
