<template>
  <div class="relative" ref="dropdownRef">
    <label v-if="label" :for="id" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        v-model="searchQuery"
        @focus="isOpen = true"
        @input="handleInput"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
        autocomplete="off"
      />
      
      <!-- Dropdown Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Dropdown List -->
    <div
      v-if="isOpen && filteredOptions.length > 0"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700"
    >
      <ul class="py-1">
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="cursor-pointer px-4 py-2 text-sm text-gray-900 hover:bg-brand-100 dark:text-white dark:hover:bg-brand-900/20"
          :class="{ 'bg-brand-50 dark:bg-brand-900/10': modelValue === option.value }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>

    <!-- No Results -->
    <div
      v-if="isOpen && filteredOptions.length === 0 && searchQuery"
      class="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-700"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">No results found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Select an option',
  disabled: false,
  required: false,
  id: 'searchable-select'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const searchQuery = ref('')
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Initialize search query with selected option label
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const selected = props.options.find(opt => opt.value === newValue)
    if (selected) {
      searchQuery.value = selected.label
    }
  } else {
    searchQuery.value = ''
  }
}, { immediate: true })

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  )
})

const handleInput = () => {
  isOpen.value = true
}

const selectOption = (option: Option) => {
  searchQuery.value = option.label
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    // Restore the selected option label if user didn't select anything
    if (props.modelValue) {
      const selected = props.options.find(opt => opt.value === props.modelValue)
      if (selected) {
        searchQuery.value = selected.label
      }
    } else {
      searchQuery.value = ''
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
