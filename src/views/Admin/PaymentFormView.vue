<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="isEdit ? 'Edit Payment' : 'New Payment'" />

    <form @submit.prevent="save" class="space-y-6">
      <!-- Payment Details -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3 md:col-span-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Expense</label>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.is_expense" class="sr-only">
              <span class="relative inline-block h-6 w-11 rounded-full transition"
                    :class="form.is_expense ? 'bg-brand-500' : 'bg-gray-300'">
                <span class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"
                      :class="form.is_expense ? 'translate-x-5' : ''"></span>
              </span>
            </label>
            <span class="text-xs text-gray-500 dark:text-gray-400">For travel/food/etc. sets outgoing automatically.</span>
          </div>
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
                  <div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img
                      v-if="getProjectThumbnail(selectedProject)"
                      :src="getProjectThumbnail(selectedProject)"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-600">
                      {{ selectedProject.name.charAt(0).toUpperCase() }}
                    </div>
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
                  <div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img
                      v-if="getProjectThumbnail(project)"
                      :src="getProjectThumbnail(project)"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-600">
                      {{ project.name.charAt(0).toUpperCase() }}
                    </div>
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

          <!-- Direction & Party Type -->
          <div v-if="!form.is_expense" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Direction</label>
               <div class="flex gap-4">
                 <label class="inline-flex items-center">
                   <input type="radio" v-model="form.direction" value="incoming" class="form-radio text-brand-600">
                   <span class="ml-2 text-gray-700 dark:text-gray-300">Incoming (Received)</span>
                 </label>
                 <label class="inline-flex items-center">
                   <input type="radio" v-model="form.direction" value="outgoing" class="form-radio text-brand-600">
                   <span class="ml-2 text-gray-700 dark:text-gray-300">Outgoing (Paid)</span>
                 </label>
               </div>
             </div>
             
             <div>
               <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Party Type</label>
               <div class="flex gap-4">
                 <label class="inline-flex items-center">
                   <input type="radio" v-model="partyType" value="customer" class="form-radio text-brand-600">
                   <span class="ml-2 text-gray-700 dark:text-gray-300">Customer</span>
                 </label>
                 <label class="inline-flex items-center">
                   <input type="radio" v-model="partyType" value="labour" class="form-radio text-brand-600">
                   <span class="ml-2 text-gray-700 dark:text-gray-300">Labour</span>
                 </label>
                 <label class="inline-flex items-center">
                   <input type="radio" v-model="partyType" value="supplier" class="form-radio text-brand-600">
                   <span class="ml-2 text-gray-700 dark:text-gray-300">Supplier</span>
                 </label>
               </div>
             </div>
          </div>

          <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" v-if="form.is_expense">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Expense Category</label>
              <GenericSelect
                v-model="form.category_id"
                :options="categoryOptions"
                placeholder="Select category"
                searchable
                required
              />
            </div>
          </div>

          <!-- Payer/Payee Selection -->
          <div class="md:col-span-2" v-if="!form.is_expense">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ form.direction === 'incoming' ? 'Payer' : 'Payee' }} ({{ partyType.charAt(0).toUpperCase() + partyType.slice(1) }})
            </label>
            <CustomerSelect
              v-model="form.payer_id"
              :type="partyType"
              :placeholder="`Select ${partyType}`"
            />
          </div>

          <!-- Amount & Currency -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Amount</label>
            <div class="flex h-11 items-stretch overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <div class="flex items-center px-3 bg-gray-50 text-gray-700 text-sm font-semibold dark:bg-gray-800 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                {{ currencySymbol }}
              </div>
              <input v-model.number="form.amount" type="number" step="0.01" class="flex-1 bg-transparent px-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white" placeholder="0.00" required />
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
            <GenericSelect
              v-model="form.method"
              :options="methodOptions"
              placeholder="Select method"
            />
          </div>

          <!-- Reference -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Reference / Cheque No.</label>
            <input v-model="form.reference" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g. CHQ-123456" />
          </div>

          <!-- Received By -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {{ form.direction === 'outgoing' ? 'Paid By' : 'Received By' }}
            </label>
            <div class="relative">
              <button
                type="button"
                @click="toggleUserDropdown('received')"
                class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <span v-if="selectedReceivedUser" class="flex items-center gap-2 overflow-hidden">
                  <img v-if="getUserPhoto(selectedReceivedUser)" :src="getUserPhoto(selectedReceivedUser)" class="h-6 w-6 rounded-full object-cover flex-shrink-0" />
                  <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700 flex-shrink-0">
                    {{ selectedReceivedUser.name.charAt(0) }}
                  </span>
                  <div class="truncate">
                    <div class="font-medium truncate">{{ getUserDisplay(selectedReceivedUser) }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ getUserRole(selectedReceivedUser) }}</div>
                  </div>
                </span>
                <span v-else class="text-gray-500">Select user</span>
                <svg class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-if="isReceivedDropdownOpen"
                class="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  v-for="user in users"
                  :key="user.id"
                  @click="selectReceivedUser(user)"
                  class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <img v-if="getUserPhoto(user)" :src="getUserPhoto(user)" class="h-8 w-8 rounded-full object-cover" />
                  <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                    {{ user.name.charAt(0) }}
                  </span>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ getUserDisplay(user) }}</div>
                    <div class="text-xs text-gray-500">{{ getUserRole(user) }}</div>
                  </div>
                </div>
                <div v-if="users.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">No users found</div>
              </div>
            </div>
          </div>

          <!-- Approved By -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Approved By</label>
            <div class="relative">
              <button
                type="button"
                @click="toggleUserDropdown('approved')"
                class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <span v-if="selectedApprovedUser" class="flex items-center gap-2 overflow-hidden">
                  <img v-if="getUserPhoto(selectedApprovedUser)" :src="getUserPhoto(selectedApprovedUser)" class="h-6 w-6 rounded-full object-cover flex-shrink-0" />
                  <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700 flex-shrink-0">
                    {{ selectedApprovedUser.name.charAt(0) }}
                  </span>
                  <div class="truncate">
                    <div class="font-medium truncate">{{ getUserDisplay(selectedApprovedUser) }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ getUserRole(selectedApprovedUser) }}</div>
                  </div>
                </span>
                <span v-else class="text-gray-500">Select user</span>
                <svg class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-if="isApprovedDropdownOpen"
                class="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  v-for="user in users"
                  :key="user.id"
                  @click="selectApprovedUser(user)"
                  class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <img v-if="getUserPhoto(user)" :src="getUserPhoto(user)" class="h-8 w-8 rounded-full object-cover" />
                  <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                    {{ user.name.charAt(0) }}
                  </span>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ getUserDisplay(user) }}</div>
                    <div class="text-xs text-gray-500">{{ getUserRole(user) }}</div>
                  </div>
                </div>
                <div v-if="users.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">No users found</div>
              </div>
            </div>
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

        <!-- Existing Docs -->
        <div v-if="existingDocs.length > 0" class="mt-4 space-y-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Existing Attachments</div>
          <div
            v-for="doc in existingDocs"
            :key="doc.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ doc.name || doc.original_name || 'Document' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ (doc.file_size ? (doc.file_size/1024).toFixed(2) : '0') + ' KB' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- New Files -->
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
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'
import { formatAmount } from '@/utils/currency'

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
  direction: 'incoming',
  type: 'incoming',
  is_expense: false,
  category_id: '',
})

const partyType = ref('customer')

const projects = ref<any[]>([])
const customers = ref<any[]>([])
const expenseCategories = ref<any[]>([])
const users = ref<any[]>([])
const files = ref<File[]>([])
const existingDocs = ref<any[]>([])

// Dropdown states
const isProjectDropdownOpen = ref(false)
const projectSearch = ref('')
const isCustomerDropdownOpen = ref(false)
const customerSearch = ref('')
const isReceivedDropdownOpen = ref(false)
const isApprovedDropdownOpen = ref(false)

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
    'PKR': 'Rs',
    'USD': '$',
    'EUR': '€'
  }
  return symbols[form.value.currency] || form.value.currency || 'Rs'
})

const selectedReceivedUser = computed(() => users.value.find(u => u.id === form.value.received_by))
const selectedApprovedUser = computed(() => users.value.find(u => u.id === form.value.approved_by))

const methodOptions = [
  { value: 'Cash', label: '💵 Cash' },
  { value: 'Cheque', label: '🧾 Cheque' },
  { value: 'Bank Transfer', label: '🏦 Bank Transfer' },
  { value: 'Online', label: '🌐 Online' },
  { value: 'Other', label: '✨ Other' },
]

const categoryOptions = computed(() => expenseCategories.value.map(c => ({ value: c.id, label: c.name })))

const selectProject = (project: any) => {
  form.value.project_id = project ? project.id : null
  isProjectDropdownOpen.value = false

  // Auto-select customer if project has one (only for normal payments)
  if (!form.value.is_expense && project && project.customer_id) {
    form.value.payer_id = project.customer_id
  }
}

const selectCustomer = (customer: any) => {
  form.value.payer_id = customer.id
  isCustomerDropdownOpen.value = false
}

const getProjectThumbnail = (p: any) => {
  if (!p) return ''
  const direct = p.thumbnail_url || p.thumbnail?.file_path || p.thumbnail?.thumb_url
  if (direct) return makeAbsoluteUrl(direct)
  const docThumb = (p.documents || []).find((d: any) => {
    const cat = (d.document_category || d.category || '').toLowerCase()
    return cat === 'thumbnail' || cat === 'thumb'
  })
  if (docThumb) return makeAbsoluteUrl(docThumb.file_path || docThumb.url || docThumb.thumb_url)
  return ''
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

const getUserPhoto = (u: any) => {
  if (!u) return ''
  const path = u.profile_photo_url || u.avatar || u.photo
  return path ? makeAbsoluteUrl(path) : ''
}

const getUserRole = (u: any) => (u.role?.name || u.role_name || u.roles?.[0]?.name || 'User')
const getUserDisplay = (u: any) => u.name || u.first_name || 'User'

const toggleUserDropdown = (type: 'received' | 'approved') => {
  if (type === 'received') {
    isReceivedDropdownOpen.value = !isReceivedDropdownOpen.value
    isApprovedDropdownOpen.value = false
  } else {
    isApprovedDropdownOpen.value = !isApprovedDropdownOpen.value
    isReceivedDropdownOpen.value = false
  }
}

const selectReceivedUser = (user: any) => {
  form.value.received_by = user?.id || null
  isReceivedDropdownOpen.value = false
}

const selectApprovedUser = (user: any) => {
  form.value.approved_by = user?.id || null
  isApprovedDropdownOpen.value = false
}

const loadData = async () => {
  try {
    const [pRes, catRes, uRes] = await Promise.all([
      api.get('/projects?per_page=100&with=documents'),
      api.get('/expense-categories'),
      api.get('/users?per_page=100')
    ])
    projects.value = pRes.data.data || pRes.data
    expenseCategories.value = catRes.data?.data ?? catRes.data ?? []
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
    // Base fields
    Object.entries(form.value).forEach(([k, v]) => { 
      if (k === 'is_expense') return // handled explicitly below
      if (v !== null && v !== undefined && v !== '') fd.append(k, v as any) 
    })
    fd.append('is_expense', form.value.is_expense ? '1' : '0')
    
    // Default payer_type to the selected party when not expense
    if (!form.value.is_expense && form.value.payer_id) {
      fd.append('payer_type', partyType.value || 'customer')
    }
    
    // Ensure direction/type is set
    const effectiveDirection = form.value.is_expense ? 'outgoing' : (form.value.direction || 'incoming')
    const effectiveType = form.value.is_expense ? 'expense' : (form.value.direction || 'incoming')
    fd.append('type', effectiveType)
    fd.append('direction', effectiveDirection)

    const uploadable = files.value.filter((f) => f instanceof File) as File[]
    uploadable.forEach((f, i) => { fd.append(`document_files[${i}]`, f) })
    
    if (isEdit.value) {
      fd.append('_method', 'PUT')
      await api.post(`/payments/${route.params.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Payment updated')
    } else {
      await api.post('/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Payment created')
    }
    router.push(form.value.is_expense ? '/expenses' : '/payments')
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error saving payment')
  }
}

onMounted(async () => {
  await loadData()
  if (isEdit.value) {
    try {
      files.value = []
      const r = await api.get(`/payments/${route.params.id}`)
      const data = r.data
      
      // Map basic fields
      Object.keys(form.value).forEach(k => {
        if (data[k] !== undefined && data[k] !== null) {
          form.value[k] = data[k]
        }
      })
      const getId = (val: any) => {
        if (val === null || val === undefined) return null
        if (typeof val === 'object' && val.id !== undefined) return val.id
        const n = Number(val)
        return Number.isNaN(n) ? val : n
      }
      form.value.received_by = getId(data.received_by)
      form.value.approved_by = getId(data.approved_by)
      existingDocs.value = Array.isArray(data.documents) ? data.documents : []
      
      // Ensure date format is correct for input type="date"
      if (data.payment_date) {
        form.value.payment_date = new Date(data.payment_date).toISOString().split('T')[0]
      }
      
      if (data.direction || data.type) {
        form.value.direction = data.direction || data.type
      }
      
      // Auto-detect party type
      if (data.payer?.type === 'labour') {
        partyType.value = 'labour'
      } else if (data.payer?.type === 'supplier') {
        partyType.value = 'supplier'
      }
    } catch (e) {
      console.error(e)
      toast.error('Error loading payment details')
    }
  } else {
    // Handle query params for new payment
    const { payer_id, type, direction, expense } = route.query
    if (payer_id) form.value.payer_id = Number(payer_id)
    if (type) partyType.value = type as string
    if (direction) form.value.direction = direction as string
    if (expense === '1' || expense === 'true') {
      form.value.is_expense = true
    }
  }
})

watch(partyType, (newType) => {
  if (newType === 'supplier' || newType === 'labour') {
    if (!isEdit.value && !route.query.direction) {
       form.value.direction = 'outgoing'
    }
  }
})

// Force expense behaviour
watch(() => form.value.is_expense, (isExpense) => {
  if (isExpense) {
    form.value.direction = 'outgoing'
    form.value.type = 'expense'
    form.value.payer_id = null
    partyType.value = 'customer'
    form.value.category_id = form.value.category_id || ''
  } else {
    form.value.type = form.value.direction || 'incoming'
    form.value.category_id = ''
  }
})
</script>
