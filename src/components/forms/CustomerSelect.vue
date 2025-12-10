<template>
  <div class="relative" ref="container">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      :class="{ 'border-brand-500 ring-1 ring-brand-500': isOpen }"
    >
      <span v-if="selectedCustomer" class="flex items-center gap-2 overflow-hidden">
        <img
          v-if="getCustomerPhoto(selectedCustomer)"
          :src="getCustomerPhoto(selectedCustomer)"
          alt=""
          class="h-6 w-6 rounded-full object-cover flex-shrink-0"
        />
        <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700 flex-shrink-0">
          {{ selectedCustomer.name.charAt(0) }}
        </span>
        <div class="truncate">
          <div class="font-medium truncate">{{ getDisplayName(selectedCustomer) }}</div>
          <div v-if="showAddress && selectedCustomer.address" class="text-xs text-gray-500 truncate">{{ selectedCustomer.address }}</div>
        </div>
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
      <div class="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
        <input
          v-model="searchQuery"
          ref="searchInput"
          type="text"
          class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Search customers..."
          @click.stop
        />
      </div>
      
      <div v-if="loading" class="px-3 py-4 text-center text-sm text-gray-500">
        Loading...
      </div>
      
      <template v-else>
        <div
          v-for="customer in filteredCustomers"
          :key="customer.id"
          @click="selectCustomer(customer)"
          class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-brand-50 dark:bg-brand-900/20': modelValue === customer.id }"
        >
          <img
            v-if="getCustomerPhoto(customer)"
            :src="getCustomerPhoto(customer)"
            alt=""
            class="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700 flex-shrink-0">
            {{ customer.name.charAt(0) }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-900 dark:text-white truncate">{{ getDisplayName(customer) }}</div>
            <div class="text-xs text-gray-500 truncate">{{ customer.address || 'No address' }}</div>
          </div>
          <div v-if="modelValue === customer.id" class="text-brand-600 dark:text-brand-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div v-if="filteredCustomers.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
          No customers found
        </div>
      </template>
    </div>
    
    <!-- Overlay to close dropdown -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40 bg-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '@/utils/axios'

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select Customer'
  },
  showAddress: {
    type: Boolean,
    default: true
  },
  customers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const container = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const internalCustomers = ref<any[]>([])
const loading = ref(false)

const customersList = computed(() => {
  return props.customers.length > 0 ? props.customers : internalCustomers.value
})

const selectedCustomer = computed(() => {
  if (!props.modelValue) return null
  return customersList.value.find((c: any) => c.id === props.modelValue)
})

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customersList.value
  const search = searchQuery.value.toLowerCase()
  return customersList.value.filter((c: any) => {
    const display = getDisplayName(c).toLowerCase()
    return (
      display.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search)) ||
      (c.phone && c.phone.includes(search))
    )
  })
})

const toggleDropdown = async () => {
  if (props.customers.length === 0 && internalCustomers.value.length === 0) {
    await fetchCustomers()
  }
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectCustomer = (customer: any) => {
  if (props.modelValue === customer.id) {
    emit('update:modelValue', null)
    emit('change', null)
  } else {
    emit('update:modelValue', customer.id)
    emit('change', customer)
  }
  isOpen.value = false
  searchQuery.value = ''
}

const fetchCustomers = async () => {
  if (props.customers.length > 0) return
  
  loading.value = true
  try {
    const res = await api.get('/customers', { params: { status: 'active', per_page: 100 } })
    internalCustomers.value = res.data.data || res.data
  } catch (e) {
    console.error('Error fetching customers', e)
  } finally {
    loading.value = false
  }
}

const getCustomerPhoto = (c: any) => {
  if (!c) return ''
  const path = c.profile_photo_url || c.photo || c.avatar || c.profile_photo
  return path ? makeAbsoluteUrl(path) : ''
}

const getDisplayName = (c: any) => {
  if (!c) return ''
  const prefix = c.name_prefix ? `${c.name_prefix} ` : ''
  return `${prefix}${c.name || ''}`.trim()
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (container.value && !container.value.contains(e.target as Node) && isOpen.value) {
      // Logic handled by the fixed overlay, but keeping this as backup or if overlay is removed
      // isOpen.value = false
    }
  })
})
</script>
