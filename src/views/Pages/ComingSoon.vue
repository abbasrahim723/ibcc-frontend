<template>
  <admin-layout>
    <div class="flex h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
      <div class="rounded-full bg-brand-50 p-6 dark:bg-brand-900/20">
        <svg
          class="h-16 w-16 text-brand-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Coming Soon</h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        We're working hard to bring you this feature. Stay tuned!
      </p>
      <button
        @click="$router.back()"
        class="mt-8 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
      >
        Go Back
      </button>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
