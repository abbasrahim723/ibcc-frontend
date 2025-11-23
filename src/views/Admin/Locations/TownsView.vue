<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Towns</h3>
        
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- City Filter -->
          <select
            v-model="selectedCityId"
            @change="handleCityChange"
            class="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Cities</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search towns..."
            class="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          
          <!-- Add Button -->
          <button
            @click="openModal()"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Town
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">City</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Zip Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="town in towns" :key="town.id" :class="!town.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ town.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getCityName(town.city_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ town.zip_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="town.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openModal(town)" 
                  class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3"
                >
                  Edit
                </button>
                <button 
                  @click="deleteTown(town)" 
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
          {{ isEditMode ? 'Edit Town' : 'Add Town' }}
        </h3>
        
        <form @submit.prevent="saveTown" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
            <select v-model="form.city_id" required class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select City</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code (Optional)</label>
            <input v-model="form.zip_code" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
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

interface Town {
  id: number
  name: string
  city_id: number
  zip_code: string | null
  is_active: boolean
}

interface City {
  id: number
  name: string
}

const toast = useToast()
const currentPageTitle = ref('Towns')
const towns = ref<Town[]>([])
const cities = ref<City[]>([])
const searchQuery = ref('')
const selectedCityId = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  name: '',
  city_id: '' as number | '',
  zip_code: '',
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

const fetchCities = async () => {
  try {
    const response = await api.get('/cities', { params: { all: true } })
    cities.value = response.data
  } catch (error) {
    console.error('Error fetching cities', error)
  }
}

const fetchTowns = async (page = 1) => {
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
      city_id: selectedCityId.value || undefined
    }
    const response = await api.get('/towns', { params })
    towns.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error('Error fetching towns')
  }
}

const handleSearch = () => {
  fetchTowns(1)
}

const handleCityChange = () => {
  fetchTowns(1)
}

const changePage = (page: number) => {
  fetchTowns(page)
}

const getCityName = (cityId: number) => {
  const city = cities.value.find(c => c.id === cityId)
  return city ? city.name : 'Unknown'
}

const openModal = (town?: Town) => {
  if (town) {
    isEditMode.value = true
    editingId.value = town.id
    form.value = { ...town, zip_code: town.zip_code || '' }
  } else {
    isEditMode.value = false
    editingId.value = null
    form.value = {
      name: '',
      city_id: selectedCityId.value ? Number(selectedCityId.value) : '',
      zip_code: '',
      is_active: true
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveTown = async () => {
  try {
    if (isEditMode.value && editingId.value) {
      await api.put(`/towns/${editingId.value}`, form.value)
      toast.success('Town updated successfully')
    } else {
      await api.post('/towns', form.value)
      toast.success('Town created successfully')
    }
    closeModal()
    fetchTowns(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving town')
  }
}

const deleteTown = async (town: Town) => {
  if (!confirm('Are you sure you want to delete this town?')) return
  
  try {
    await api.delete(`/towns/${town.id}`)
    toast.success('Town deleted successfully')
    fetchTowns(pagination.value.current_page)
  } catch (error: any) {
    toast.error('Error deleting town')
  }
}

onMounted(() => {
  fetchCities()
  fetchTowns()
})
</script>
