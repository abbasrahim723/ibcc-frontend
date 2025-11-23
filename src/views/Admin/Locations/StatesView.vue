<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">States</h3>
        
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- Country Filter -->
          <select
            v-model="selectedCountryId"
            @change="handleCountryChange"
            class="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Countries</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search states..."
            class="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          
          <!-- Add Button -->
          <button
            @click="openModal()"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add State
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Country</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="state in states" :key="state.id" :class="!state.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ state.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getCountryName(state.country_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="state.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openModal(state)" 
                  class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3"
                >
                  Edit
                </button>
                <button 
                  @click="deleteState(state)" 
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
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

    <!-- Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit State' : 'Add State' }}
        </h3>
        
        <form @submit.prevent="saveState" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
            <select v-model="form.country_id" required class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select Country</option>
              <option v-for="country in countries" :key="country.id" :value="country.id">
                {{ country.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Country Code (Optional)</label>
            <input v-model="form.country_code" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div class="flex items-center">
            <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">Save</button>
          </div>
        </form>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

interface State {
  id: number
  name: string
  country_id: number
  country_code: string
  is_active: boolean
}

interface Country {
  id: number
  name: string
}

const toast = useToast()
const currentPageTitle = ref('States')
const states = ref<State[]>([])
const countries = ref<Country[]>([])
const searchQuery = ref('')
const selectedCountryId = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  name: '',
  country_id: '' as number | '',
  country_code: '',
  is_active: true
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

const fetchCountries = async () => {
  try {
    const response = await api.get('/countries', { params: { all: true } })
    countries.value = response.data
  } catch (error) {
    console.error('Error fetching countries', error)
  }
}

const fetchStates = async (page = 1) => {
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
      country_id: selectedCountryId.value || undefined
    }
    const response = await api.get('/states', { params })
    states.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error('Error fetching states')
  }
}

const handleSearch = () => {
  fetchStates(1)
}

const handleCountryChange = () => {
  fetchStates(1)
}

const changePage = (page: number) => {
  fetchStates(page)
}

const getCountryName = (countryId: number) => {
  const country = countries.value.find(c => c.id === countryId)
  return country ? country.name : 'Unknown'
}

const openModal = (state?: State) => {
  if (state) {
    isEditMode.value = true
    editingId.value = state.id
    form.value = { ...state }
  } else {
    isEditMode.value = false
    editingId.value = null
    form.value = {
      name: '',
      country_id: selectedCountryId.value ? Number(selectedCountryId.value) : '',
      country_code: '',
      is_active: true
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveState = async () => {
  try {
    if (isEditMode.value && editingId.value) {
      await api.put(`/states/${editingId.value}`, form.value)
      toast.success('State updated successfully')
    } else {
      await api.post('/states', form.value)
      toast.success('State created successfully')
    }
    closeModal()
    fetchStates(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving state')
  }
}

const deleteState = async (state: State) => {
  if (!confirm('Are you sure you want to delete this state?')) return
  
  try {
    await api.delete(`/states/${state.id}`)
    toast.success('State deleted successfully')
    fetchStates(pagination.value.current_page)
  } catch (error: any) {
    toast.error('Error deleting state')
  }
}

onMounted(() => {
  fetchCountries()
  fetchStates()
})
</script>
