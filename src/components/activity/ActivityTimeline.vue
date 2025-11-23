<template>
  <div class="relative">
    <!-- Timeline Line -->
    <div
      class="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800 md:left-1/2 md:-ml-0.5"
    ></div>

    <!-- Loading State -->
    <div v-if="loading && logs.length === 0" class="flex justify-center py-8">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="logs.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div
        class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
      >
        <svg
          class="h-8 w-8 text-gray-400"
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
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        No activity found
      </h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        There are no activity logs to display at this time.
      </p>
    </div>

    <!-- Timeline Items -->
    <div v-else class="space-y-8">
      <div
        v-for="(log, index) in logs"
        :key="log.id"
        class="relative flex flex-col md:flex-row md:items-center md:justify-between"
        :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
      >
        <!-- Date/Time (Mobile: Top, Desktop: Side) -->
        <div class="mb-2 ml-12 md:mb-0 md:ml-0 md:w-5/12 md:text-right" :class="{ 'md:text-left': index % 2 !== 0 }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(log.created_at) }}
          </span>
        </div>

        <!-- Icon -->
        <div
          class="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-500 shadow-md dark:border-gray-900 md:left-1/2 md:-ml-4"
        >
          <svg
            class="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>

        <!-- Content Card -->
        <div class="ml-12 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:ml-0 md:w-5/12">
          <div class="flex items-center justify-between mb-2">
             <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ log.description }}
            </h4>
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {{ log.action }}
            </span>
          </div>
         
          <p v-if="log.user" class="mb-2 text-xs text-gray-500 dark:text-gray-400">
            By: {{ log.user.first_name }} {{ log.user.last_name }} ({{ log.user.email }})
          </p>
          
          <!-- Changes Diff -->
          <div v-if="log.changes" class="mt-3 rounded bg-gray-50 p-3 text-xs dark:bg-gray-800">
             <div v-if="log.changes.before" class="mb-2">
                <span class="font-semibold text-red-500">Before:</span>
                <pre class="mt-1 overflow-x-auto whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ formatChanges(log.changes.before) }}</pre>
             </div>
             <div v-if="log.changes.after">
                <span class="font-semibold text-green-500">After:</span>
                <pre class="mt-1 overflow-x-auto whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ formatChanges(log.changes.after) }}</pre>
             </div>
          </div>
          
          <div class="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>IP: {{ log.ip_address }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Infinite Scroll Trigger -->
    <div ref="observerTarget" class="h-4 w-full py-4">
        <div v-if="loadingMore" class="flex justify-center">
            <div class="h-6 w-6 animate-spin rounded-full border-2 border-solid border-brand-500 border-t-transparent"></div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import api from '@/utils/axios'
import { format } from 'date-fns'

const props = defineProps({
  userId: {
    type: [Number, String],
    default: null,
  },
  endpoint: {
    type: String,
    default: '/activity-logs',
  },
})

const logs = ref<any[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const observerTarget = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const fetchLogs = async (isLoadMore = false) => {
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const url = props.userId 
        ? `/users/${props.userId}/activity-logs` 
        : props.endpoint
        
    const response = await api.get(url, {
      params: {
        page: page.value,
        per_page: 15,
      },
    })

    const newLogs = response.data.data
    if (isLoadMore) {
      logs.value = [...logs.value, ...newLogs]
    } else {
      logs.value = newLogs
    }

    hasMore.value = response.data.next_page_url !== null
    page.value++
  } catch (error) {
    console.error('Error fetching activity logs:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss')
}

const formatChanges = (changes: any) => {
    if (typeof changes === 'object') {
        return JSON.stringify(changes, null, 2)
    }
    return changes
}

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value && !loadingMore.value) {
        fetchLogs(true)
      }
    },
    { threshold: 0.5 }
  )

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

onMounted(() => {
  fetchLogs()
  setupObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

watch(() => props.userId, () => {
    page.value = 1
    logs.value = []
    hasMore.value = true
    fetchLogs()
})
</script>
