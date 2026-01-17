<template>
  <div class="relative" ref="container">
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
      :class="{ 'border-brand-500 ring-1 ring-brand-500': isOpen }"
    >
      <span v-if="selectedOption" class="flex items-center gap-2 overflow-hidden flex-1">
        <img
          v-if="selectedOption.image"
          :src="selectedOption.image"
          class="h-6 w-6 rounded-full object-cover flex-shrink-0"
          alt=""
        />
        <span v-else-if="selectedOption.image === ''" class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-xs font-bold text-brand-600 dark:text-brand-400 flex-shrink-0">
          {{ selectedOption.label.charAt(0) }}
        </span>
        <span class="truncate font-medium">
          {{ selectedOption.label }}
        </span>
      </span>
      <span v-else class="text-gray-500 truncate">{{ placeholder || 'Select an option' }}</span>
      
      <div class="flex items-center gap-2">
        <LoadingSpinner v-if="loading" size="sm" />
        <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div v-if="searchable" class="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
        <input
          v-model="searchQuery"
          ref="searchInput"
          type="text"
          class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Search..."
          @click.stop
        />
      </div>
      
      <div v-if="loading && options.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
        Loading...
      </div>
      
      <template v-else>
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-brand-50 dark:bg-brand-900/20': modelValue === option.value }"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <!-- Image -->
            <img
              v-if="option.image"
              :src="option.image"
              class="h-8 w-8 rounded-full object-cover flex-shrink-0"
              alt=""
            />
            <div v-else-if="option.image === ''" class="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold flex-shrink-0">
              {{ option.label.charAt(0).toUpperCase() }}
            </div>

            <div class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ option.label }}
              </span>
              <span v-if="option.subtitle" class="block text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {{ option.subtitle }}
              </span>
            </div>
          </div>

          <div v-if="modelValue === option.value" class="text-brand-600 dark:text-brand-400 flex-shrink-0">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div v-if="filteredOptions.length === 0" class="px-3 py-4 text-sm text-gray-500 text-center">
          No results found
        </div>
      </template>
    </div>
    
    <!-- Overlay to close dropdown -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40 bg-transparent"></div>
    <!-- Hidden input for required validation -->
    <input
      v-if="required"
      :id="id"
      :value="modelValue"
      :required="required"
      class="absolute bottom-0 left-0 -z-10 h-0 w-0 opacity-0"
      tabindex="-1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface Option {
  value: string | number
  label: string
  subtitle?: string
  image?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  options?: Option[]
  placeholder?: string
  searchable?: boolean
  loading?: boolean
  disabled?: boolean
  id?: string
  required?: boolean
}>(), {
  modelValue: null,
  options: () => [],
  placeholder: 'Select option',
  searchable: false,
  loading: false,
  disabled: false,
  id: '',
  required: false,
})

const emit = defineEmits(['update:modelValue', 'change'])

const container = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const search = searchQuery.value.toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(search) ||
    (opt.subtitle && opt.subtitle.toLowerCase().includes(search))
  )
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

// Close dropdown when clicking outside (fallback for overlay)
const handleClickOutside = (e: MouseEvent) => {
  if (container.value && !container.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
