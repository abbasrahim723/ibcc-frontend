<template>
  <div class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
    <div
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>
    
    <div class="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-lg dark:bg-gray-900 lg:p-10">
      <div class="flex flex-col items-center text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/30">
          <svg
            class="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        
        <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        
        <p class="mb-6 text-gray-500 dark:text-gray-400">
          {{ message }}
        </p>
        
        <div class="flex w-full gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Are you sure?',
  },
  message: {
    type: String,
    default: 'This action cannot be undone.',
  },
})

defineEmits(['close', 'confirm'])
</script>
