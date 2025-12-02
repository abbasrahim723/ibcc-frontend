<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-start justify-center pt-20 sm:items-center sm:pt-0">
    <div @click="handleBackdropClick" class="fixed inset-0 bg-black/40 z-[999999]"></div>

    <!-- Container: anchored near top on desktop (below header), full-screen on mobile -->
    <div class="relative z-[1000000] w-full h-full sm:h-auto sm:max-w-[90vw] mx-auto">
      <div
        class="relative w-full h-full sm:h-auto sm:mx-auto sm:max-w-[820px] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl sm:rounded-2xl overflow-hidden"
      >
        <!-- Inner scrollable area: on mobile it fills viewport, on desktop constrained to viewport minus header -->
        <div class="h-full overflow-auto p-4 sm:p-6 sm:max-h-[calc(100vh-6rem)]">
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
