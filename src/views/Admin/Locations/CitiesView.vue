<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cities</h3>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- Country Filter -->
          <select
            v-model="selectedCountryId"
            @change="handleCountryChange"
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Countries</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>

          <!-- State Filter -->
          <select
            v-model="selectedStateId"
            @change="handleStateChange"
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All States</option>
            <option v-for="state in filteredStates" :key="state.id" :value="state.id">
              {{ state.name }}
            </option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search cities..."
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="sm:hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">State</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Country</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="city in cities" :key="city.id" :class="!city.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ city.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getStateName(city.state_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getCountryName(city.country_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="city.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="toggleActive(city)"
                  :class="city.is_active ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                >
                  {{ city.is_active ? 'Deactivate' : 'Activate' }}
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
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

interface City {
  id: number
  name: string
  state_id: number
  country_id: number
  zip_code: string | null
  is_active: boolean
}

interface State {
  id: number
  name: string
  country_id: number
}

interface Country {
  id: number
  name: string
}

const toast = useToast()
const currentPageTitle = ref('Cities')
const cities = ref<City[]>([])
const countries = ref<Country[]>([])
const allStates = ref<State[]>([])
const searchQuery = ref('')
const selectedCountryId = ref('')
const selectedStateId = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

const filteredStates = computed(() => {
  if (!selectedCountryId.value) return []
  return allStates.value.filter(s => s.country_id === Number(selectedCountryId.value))
})

const fetchCountries = async () => {
  try {
    const response = await api.get('/countries', { params: { all: true } })
    countries.value = response.data

    // Set default to Pakistan
    const pakistan = countries.value.find(c => c.name === 'Pakistan')
    if (pakistan) {
      selectedCountryId.value = String(pakistan.id)
    }
  } catch (error) {
    console.error('Error fetching countries', error)
  }
}

const fetchStates = async () => {
  try {
    const response = await api.get('/states', { params: { all: true } })
    allStates.value = response.data

    // Set default to KPK after states are loaded
    const kpk = allStates.value.find(s =>
      s.name.toLowerCase().includes('khyber') ||
      s.name.toLowerCase().includes('kpk')
    )
    if (kpk) {
      selectedStateId.value = String(kpk.id)
    }
  } catch (error) {
    console.error('Error fetching states', error)
  }
}

const fetchCities = async (page = 1) => {
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
      country_id: selectedCountryId.value || undefined,
      state_id: selectedStateId.value || undefined
    }
    const response = await api.get('/cities', { params })
    cities.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error('Error fetching cities')
  }
}

const handleSearch = () => {
  fetchCities(1)
}

const handleCountryChange = () => {
  selectedStateId.value = ''
  fetchCities(1)
}

const handleStateChange = () => {
  fetchCities(1)
}

const changePage = (page: number) => {
  fetchCities(page)
}

const getCountryName = (countryId: number) => {
  const country = countries.value.find(c => c.id === countryId)
  return country ? country.name : 'Unknown'
}

const getStateName = (stateId: number) => {
  const state = allStates.value.find(s => s.id === stateId)
  return state ? state.name : 'Unknown'
}

const toggleActive = async (city: City) => {
  const newStatus = !city.is_active
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} city...`)

  try {
    await api.put(`/cities/${city.id}`, {
      ...city,
      is_active: newStatus
    })
    toast.success(`City ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchCities(pagination.value.current_page)
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating city status')
  }
}

onMounted(async () => {
  await fetchCountries()
  await fetchStates()
  fetchCities()
})
</script>
