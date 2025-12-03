<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="isEdit ? 'Edit Payment' : 'New Payment'" />

    <form @submit.prevent="save" class="space-y-6">
      <!-- Payment Details -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Project Dropdown -->
          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Project</label>
            <div class="relative">
              <button
                type="button"
                @click="isProjectDropdownOpen = !isProjectDropdownOpen"
                class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <span v-if="selectedProject" class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                    {{ selectedProject.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium">{{ selectedProject.name }}</div>
                    <div class="text-xs text-gray-500">{{ selectedProject.address || 'No address' }}</div>
                  </div>
                </span>
                <span v-else class="text-gray-500">Select project (Optional)</span>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                v-if="isProjectDropdownOpen"
                class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <input
                    v-model="projectSearch"
                    type="text"
                    class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Search projects..."
                    @click.stop
                  />
                </div>
                <div
                  @click="selectProject(null)"
                  class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 italic"
                >
                  No Project
                </div>
                <div
                  v-for="project in filteredProjects"
                  :key="project.id"
                  @click="selectProject(project)"
                  class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div class="h-8 w-8 rounded bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                    {{ project.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ project.name }}</div>
                    <div class="text-xs text-gray-500">{{ project.address || 'No address' }}</div>
                  </div>
                </div>
                <div v-if="filteredProjects.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
                  No projects found
                </div>
              </div>
            </div>
            <!-- Overlay to close dropdown -->
            <div v-if="isProjectDropdownOpen" @click="isProjectDropdownOpen = false" class="fixed inset-0 z-10"></div>
          </div>

          <!-- Customer Dropdown -->
          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Payer (Customer)</label>
            <div class="relative">
              <button
                type="button"
                @click="isCustomerDropdownOpen = !isCustomerDropdownOpen"
                class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <span v-if="selectedCustomer" class="flex items-center gap-2">
                  <img
                    v-if="selectedCustomer.profile_photo_url"
                    :src="selectedCustomer.profile_photo_url"
                    alt=""
                    class="h-6 w-6 rounded-full object-cover"
                  />
                  <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                    {{ selectedCustomer.name.charAt(0) }}
                  </span>
                  <div>
                    <div class="font-medium">{{ selectedCustomer.name }}</div>
                    <div class="text-xs text-gray-500">{{ selectedCustomer.address || 'No address' }}</div>
                  </div>
                </span>
                <span v-else class="text-gray-500">Select customer</span>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                v-if="isCustomerDropdownOpen"
                class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <input
                    v-model="customerSearch"
                    type="text"
                    class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Search customers..."
                    @click.stop
                  />
                </div>
                <div
                  v-for="customer in filteredCustomers"
                  :key="customer.id"
                  @click="selectCustomer(customer)"
                  class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <img
                    v-if="customer.profile_photo_url"
                    :src="customer.profile_photo_url"
                    alt=""
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                    {{ customer.name.charAt(0) }}
                  </span>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ customer.name }}</div>
                    <div class="text-xs text-gray-500">{{ customer.address || 'No address' }}</div>
                  </div>
                </div>
                <div v-if="filteredCustomers.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
                  No customers found
                </div>
              </div>
            </div>
            <!-- Overlay to close dropdown -->
            <div v-if="isCustomerDropdownOpen" @click="isCustomerDropdownOpen = false" class="fixed inset-0 z-10"></div>
          </div>

          <!-- Amount & Currency -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Amount</label>
            <div class="flex gap-2 items-center">
              <div class="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                <button type="button" @click="selectCurrency('PKR')" :class="['px-3 py-2 text-sm font-medium transition-colors', form.currency === 'PKR' ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']">PKR</button>
                <button type="button" @click="selectCurrency('USD')" :class="['px-3 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-700 transition-colors', form.currency === 'USD' ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']">USD</button>
                <button type="button" @click="selectCurrency('EUR')" :class="['px-3 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-700 transition-colors', form.currency === 'EUR' ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']">EUR</button>
              </div>
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 font-semibold text-lg">{{ currencySymbol }}</span>
                <input v-model.number="form.amount" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 pl-8 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="0.00" required />
              </div>
            </div>
          </div>

          <!-- Payment Date -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Payment Date</label>
            <input v-model="form.payment_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
          </div>

          <!-- Payment Method -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Payment Method</label>
            <select v-model="form.method" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select method</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online">Online</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Reference -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Reference / Cheque No.</label>
            <input v-model="form.reference" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g. CHQ-123456" />
          </div>

          <!-- Received By -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Received By</label>
            <select v-model="form.received_by" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option :value="null">Select user</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>

          <!-- Approved By -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Approved By</label>
            <select v-model="form.approved_by" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option :value="null">Select user</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Notes</label>
            <textarea v-model="form.notes" rows="3" class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="Additional notes..."></textarea>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Documents</h3>
        
        <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/30 p-6 text-center">
          <svg class="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Drag and drop files or click to browse</p>
          <input
            type="file"
            multiple
            @change="onFiles"
            class="hidden"
            ref="fileInput"
          />
          <button
            type="button"
            @click="fileInput?.click()"
            class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Select Files
          </button>
        </div>

        <!-- File List -->
        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ (file.size / 1024).toFixed(2) }} KB</p>
              </div>
            </div>
            <button
              type="button"
              @click="removeFile(index)"
              class="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="router.push('/payments')"
          class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300"
        >
          {{ isEdit ? 'Update Payment' : 'Create Payment' }}
        </button>
      </div>
    </form>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)

const form = ref<any>({
  project_id: null,
  payer_id: null,
  amount: '',
  currency: 'PKR',
  payment_date: new Date().toISOString().split('T')[0],
  method: '',
  reference: '',
  notes: '',
  received_by: null,
  approved_by: null,
})

const projects = ref<any[]>([])
const customers = ref<any[]>([])
const users = ref<any[]>([])
const files = ref<File[]>([])

// Dropdown states
const isProjectDropdownOpen = ref(false)
const projectSearch = ref('')
const isCustomerDropdownOpen = ref(false)
const customerSearch = ref('')

// Template Refs
const fileInput = ref<HTMLInputElement | null>(null)

const selectedProject = computed(() => {
  return projects.value.find(p => p.id === form.value.project_id)
})

const filteredProjects = computed(() => {
  if (!projectSearch.value) return projects.value
  const search = projectSearch.value.toLowerCase()
  return projects.value.filter(p => p.name.toLowerCase().includes(search))
})

const selectedCustomer = computed(() => {
  return customers.value.find(c => c.id === form.value.payer_id)
})

const filteredCustomers = computed(() => {
  if (!customerSearch.value) return customers.value
  const search = customerSearch.value.toLowerCase()
  return customers.value.filter(c => 
    c.name.toLowerCase().includes(search) || 
    (c.email && c.email.toLowerCase().includes(search))
  )
})

const currencySymbol = computed(() => {
  const symbols: Record<string, string> = {
    'PKR': '₨',
    'USD': '$',
    'EUR': '€'
  }
  return symbols[form.value.currency] || form.value.currency
})

const selectCurrency = (curr: string) => {
  form.value.currency = curr
}

const selectProject = (project: any) => {
  form.value.project_id = project ? project.id : null
  isProjectDropdownOpen.value = false
  
  // Auto-select customer if project has one
  if (project && project.customer_id) {
    form.value.payer_id = project.customer_id
  }
}

const selectCustomer = (customer: any) => {
  form.value.payer_id = customer.id
  isCustomerDropdownOpen.value = false
}

const loadData = async () => {
  try {
    const [pRes, cRes, uRes] = await Promise.all([
      api.get('/projects?per_page=100'), 
      api.get('/customers?per_page=100'),
      api.get('/users?per_page=100')
    ])
    projects.value = pRes.data.data || pRes.data
    customers.value = cRes.data.data || cRes.data
    users.value = uRes.data.data || uRes.data
  } catch (e) {
    console.error(e)
  }
}

const onFiles = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach(f => files.value.push(f))
  // Reset input so same file can be selected again if needed
  input.value = ''
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const save = async () => {
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => { 
      if (v !== null && v !== undefined && v !== '') fd.append(k, v as any) 
    })
    
    // Default payer_type to customer if payer_id is set
    if (form.value.payer_id) {
      fd.append('payer_type', 'customer')
    }

    files.value.forEach((f, i) => { fd.append(`document_files[${i}]`, f) })
    
    if (isEdit.value) {
      fd.append('_method', 'PUT')
      await api.post(`/payments/${route.params.id}`, fd)
      toast.success('Payment updated')
    } else {
      await api.post('/payments', fd)
      toast.success('Payment created')
    }
    router.push('/payments')
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error saving payment')
  }
}

onMounted(async () => {
  await loadData()
  if (isEdit.value) {
    try {
      const r = await api.get(`/payments/${route.params.id}`)
      const data = r.data
      
      // Map basic fields
      Object.keys(form.value).forEach(k => {
        if (data[k] !== undefined && data[k] !== null) {
          form.value[k] = data[k]
        }
      })
      
      // Ensure date format is correct for input type="date"
      if (data.payment_date) {
        form.value.payment_date = new Date(data.payment_date).toISOString().split('T')[0]
      }
    } catch (e) {
      console.error(e)
      toast.error('Error loading payment details')
    }
  }
})
</script>
