<template>
  <div class="relative" ref="container">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      :class="{ 'border-brand-500 ring-1 ring-brand-500': isOpen }"
    >
      <span v-if="modelValue" class="flex items-center gap-2">
        <component :is="getStatusIcon(modelValue)" class="h-4 w-4" :class="getStatusColor(modelValue)" />
        <span class="capitalize">{{ formatStatus(modelValue) }}</span>
      </span>
      <span v-else class="text-gray-500">{{ placeholder }}</span>
      <svg class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div
        v-for="status in statuses"
        :key="status"
        @click="selectStatus(status)"
        class="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        :class="{ 'bg-brand-50 dark:bg-brand-900/20': modelValue === status }"
      >
        <component :is="getStatusIcon(status)" class="h-4 w-4" :class="getStatusColor(status)" />
        <span class="capitalize text-sm text-gray-700 dark:text-gray-200">{{ formatStatus(status) }}</span>
        <div v-if="modelValue === status" class="ml-auto text-brand-600 dark:text-brand-400">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Overlay to close dropdown -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40 bg-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  PauseCircleIcon, 
  PlayCircleIcon,
  CalendarIcon
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'All Status'
  },
  statuses: {
    type: Array as () => string[],
    default: () => ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled', 'pending', 'failed']
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const container = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectStatus = (status: string) => {
  if (props.modelValue === status) {
    emit('update:modelValue', '')
    emit('change', '')
  } else {
    emit('update:modelValue', status)
    emit('change', status)
  }
  isOpen.value = false
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ')
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'planning': return CalendarIcon
    case 'in_progress': return PlayCircleIcon
    case 'completed': return CheckCircleIcon
    case 'on_hold': return PauseCircleIcon
    case 'cancelled': return XCircleIcon
    case 'pending': return ClockIcon
    case 'failed': return AlertCircleIcon
    default: return ClockIcon
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning': return 'text-blue-500'
    case 'in_progress': return 'text-yellow-500'
    case 'completed': return 'text-green-500'
    case 'on_hold': return 'text-orange-500'
    case 'cancelled': return 'text-red-500'
    case 'pending': return 'text-yellow-500'
    case 'failed': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (container.value && !container.value.contains(e.target as Node) && isOpen.value) {
      // Logic handled by the fixed overlay
    }
  })
})
</script>
