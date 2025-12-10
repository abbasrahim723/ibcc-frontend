<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Customer Management</h3>

        <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-center lg:gap-4">
          <!-- Date Range -->
          <DateRangePicker
            v-model="dateRange"
            @change="handleSearch"
            @update:modelValue="handleSearch"
            class="w-full lg:w-56"
          />

          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            @change="handleSearch"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white w-full lg:w-40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search customers..."
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white w-full lg:flex-1"
          />

          <!-- Add Customer Button -->
          <button
            @click="handleAddCustomer"
            :class="[
              'rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 w-full lg:w-auto',
              can('customers', 'create')
                ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed opacity-60'
            ]"
          >
            <span class="flex items-center gap-2">
              <span>Add Customer</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Projects</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">WhatsApp</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="customer in customers" :key="customer.id" :class="!customer.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img v-if="customer.profile_photo_url" :src="customer.profile_photo_url" :alt="customer.name" class="h-10 w-10 rounded-full object-cover" />
                    <div v-else class="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                      {{ customer.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <router-link
                      :to="`/customers/${customer.id}`"
                      class="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      {{ getFullName(customer) }}
                      <span v-if="!customer.is_active" class="ml-2 text-xs text-gray-500">(Inactive)</span>
                    </router-link>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ customer.email || 'No email' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a v-if="customer.phone_primary" :href="`tel:${customer.phone_primary}`" class="text-sm text-gray-900 dark:text-white hover:text-brand-600 hover:underline block">{{ customer.phone_primary }}</a>
                <span v-else class="text-sm text-gray-500 block">No phone</span>
                <div class="text-xs text-gray-500 max-w-[12rem] truncate" :title="customer.address || 'No address'">{{ customer.address || 'No address' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                 <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                    {{ customer.projects_count || 0 }} Projects
                 </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  v-if="customer.whatsapp_number"
                  @click="openWhatsApp(customer.whatsapp_number)"
                  class="text-green-500 hover:text-green-600 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
                <span v-else class="text-xs text-gray-400">N/A</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(customer.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="customer.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <!-- Edit Button -->
                <button
                  @click="handleEditCustomer(customer)"
                  :class="[
                    'mr-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                    can('customers', 'edit')
                      ? 'text-brand-600 dark:text-brand-400 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed opacity-60'
                  ]"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <!-- Deactivate/Activate Button -->
                <button
                  @click="handleToggleStatus(customer)"
                  :class="[
                    'mr-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                    can('customers', 'edit')
                      ? (customer.is_active
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-green-600 dark:text-green-400')
                      : 'text-gray-400 cursor-not-allowed opacity-60'
                  ]"
                  :title="customer.is_active ? 'Deactivate' : 'Activate'"
                >
                  <svg v-if="customer.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                <!-- Delete Button -->
                <button
                  @click="handleDeleteCustomer(customer)"
                  :class="[
                    'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                    can('customers', 'delete')
                      ? 'text-red-600 dark:text-red-400 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed opacity-60'
                  ]"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="customers.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No customers found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmButtonText="confirmModalButtonText"
      @close="closeConfirmModal"
      @confirm="confirmAction"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DateRangePicker from '@/components/forms/DateRangePicker.vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

const { can } = usePermissions()

interface Customer {
  id: number
  name: string
  email: string | null
  phone_primary: string | null
  phone_secondary: string | null
  whatsapp_number: string | null
  cnic_number: string | null
  address: string | null
  is_active: boolean
  profile_photo_url: string | null
  created_at?: string | null
}

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Customers')
const customers = ref<Customer[]>([])
const searchQuery = ref('')
const dateRange = ref<string[]>([])
const statusFilter = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

// Confirmation Modal State
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalButtonText = ref('Confirm')
const pendingAction = ref<{ type: 'toggle' | 'delete', id: number, status?: boolean } | null>(null)

const fetchCustomers = async (page = 1) => {
  try {
    const params: any = {
      page,
      search: searchQuery.value || undefined,
    }

    if (statusFilter.value) {
      params.is_active = statusFilter.value === 'active' ? 1 : 0
      params.status = statusFilter.value
    }

    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    const response = await api.get('/customers', { params })
    customers.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching customers')
  }
}

const handleSearch = () => {
  fetchCustomers(1)
}

const changePage = (page: number) => {
  fetchCustomers(page)
}

const openWhatsApp = (number: string) => {
  const cleanNumber = number.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${cleanNumber}`, '_blank')
}

const getFullName = (customer: any) => {
  if (!customer) return ''
  const prefix = customer.name_prefix ? `${customer.name_prefix} ` : ''
  return `${prefix}${customer.name}`
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Permission-aware action handlers
const handleAddCustomer = () => {
  if (!can('customers', 'create')) {
    toast.error('You are not authorized to perform this action')
    return
  }
  router.push('/customers/create')
}

const handleEditCustomer = (customer: any) => {
  if (!can('customers', 'edit')) {
    toast.error('You are not authorized to perform this action')
    return
  }
  router.push(`/customers/${customer.id}/edit`)
}

const handleToggleStatus = (customer: any) => {
  if (!can('customers', 'edit')) {
    toast.error('You are not authorized to perform this action')
    return
  }
  toggleCustomerStatus(customer)
}

const handleDeleteCustomer = (customer: any) => {
  if (!can('customers', 'delete')) {
    toast.error('You are not authorized to perform this action')
    return
  }
  deleteCustomer(customer)
}

const toggleCustomerStatus = (customer: any) => {
  pendingAction.value = { type: 'toggle', id: customer.id, status: !customer.is_active }
  if (customer.is_active) {
    confirmModalTitle.value = 'Deactivate Customer'
    confirmModalMessage.value = 'Are you sure you want to deactivate this customer?'
    confirmModalButtonText.value = 'Deactivate'
  } else {
    confirmModalTitle.value = 'Activate Customer'
    confirmModalMessage.value = 'Are you sure you want to activate this customer?'
    confirmModalButtonText.value = 'Activate'
  }
  showConfirmModal.value = true
}

const deleteCustomer = (customer: any) => {
  pendingAction.value = { type: 'delete', id: customer.id }
  confirmModalTitle.value = 'Delete Customer'
  confirmModalMessage.value = 'Are you sure you want to delete this customer? This action cannot be undone.'
  confirmModalButtonText.value = 'Delete'
  showConfirmModal.value = true
}

const confirmAction = async () => {
  if (!pendingAction.value) return

  try {
    if (pendingAction.value.type === 'toggle') {
      const customer = customers.value.find((c: Customer) => c.id === pendingAction.value!.id)
      if (customer) {
        const response = await api.put(`/customers/${pendingAction.value.id}`, {
          is_active: pendingAction.value.status,
          name: customer.name // Name is required in update validation
        })
        toast.success(response.data.message)
      }
    } else if (pendingAction.value.type === 'delete') {
      const response = await api.delete(`/customers/${pendingAction.value.id}`)
      toast.success(response.data.message)
    }
    fetchCustomers(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error processing request')
  } finally {
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingAction.value = null
}

onMounted(() => {
  fetchCustomers()
})
</script>
