<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">States</h3>

        <div v-if="!loading" class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- Country Filter -->
          <GenericSelect
            v-model="selectedCountryId"
            :options="countryOptions"
            placeholder="All Countries"
            searchable
            class="w-full sm:w-[200px]"
            @change="handleCountryChange"
          />

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search states..."
            class="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <!-- Skeleton Header -->
        <div v-else class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="sm:hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Country</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
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
                  @click="toggleActive(state)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    !canToggle
                      ? 'cursor-not-allowed opacity-50 text-gray-400'
                      : state.is_active
                        ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :title="state.is_active ? 'Deactivate' : 'Activate'"
                >
                  <component :is="state.is_active ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ state.is_active ? 'Deactivate' : 'Activate' }}</span>
                </button>
              </td>
            </tr>
          </tbody>

          <!-- Skeleton Table Rows -->
          <tbody v-else class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="n in 8" :key="n" class="animate-pulse">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
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

      <!-- Skeleton Pagination -->
      <div v-else-if="loading" class="mt-4 flex items-center justify-between">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="flex gap-2">
          <div class="h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-8 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RotateCcw, ShieldAlert } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

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
const { can } = usePermissions()
const currentPageTitle = ref('States')
const states = ref<State[]>([])
const countries = ref<Country[]>([])
const searchQuery = ref('')
const selectedCountryId = ref('')
const loading = ref(true)
const canToggle = computed(() => can('states', 'change_status'))

const countryOptions = computed(() => [
  { value: '', label: 'All Countries' },
  ...countries.value.map(c => ({ value: c.id.toString(), label: c.name }))
])

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

    // Set default to Pakistan
    const pakistan = countries.value.find(c => c.name === 'Pakistan')
    if (pakistan) {
      selectedCountryId.value = String(pakistan.id)
    }
  } catch (error) {
    console.error('Error fetching countries', error)
  }
}

const fetchStates = async (page = 1) => {
  loading.value = true
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
  } finally {
    loading.value = false
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

const toggleActive = async (state: State) => {
  if (!canToggle.value) {
    toast.error('You do not have permission to update state status')
    return
  }

  const newStatus = !state.is_active
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} state...`)

  try {
    await api.put(`/states/${state.id}`, {
      ...state,
      is_active: newStatus
    })
    toast.success(`State ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchStates(pagination.value.current_page)
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating state status')
  }
}

onMounted(async () => {
  await fetchCountries()
  fetchStates()
})
</script>
