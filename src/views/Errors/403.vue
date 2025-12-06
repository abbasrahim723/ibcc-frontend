<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center px-4">
      <div class="mb-8">
        <svg
          class="mx-auto h-24 w-24 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      <h1 class="mb-4 text-6xl font-bold text-gray-900 dark:text-white">403</h1>
      
      <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Access Denied
      </h2>
      
      <p class="mb-8 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <div class="flex gap-4 justify-center">
        <button
          @click="$router.go(-1)"
          class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          Go Back
        </button>
        
        <router-link
          to="/"
          class="px-6 py-3 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
        >
          Go to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this simple page
</script>
