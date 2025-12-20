<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Towns</h3>

        <div v-if="!loading" class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- State Filter -->
          <select
            v-model="selectedStateId"
            @change="handleStateChange"
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All States</option>
            <option v-for="state in states" :key="state.id" :value="state.id">
              {{ state.name }}
            </option>
          </select>

          <!-- City Filter -->
          <select
            v-model="selectedCityId"
            @change="handleCityChange"
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Cities</option>
            <option v-for="city in filteredCities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search towns..."
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <!-- Add Button -->
          <button
            v-if="canCreate"
            @click="handleAddTown"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Town
          </button>
        </div>

        <!-- Skeleton Header -->
        <div v-else class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="h-10 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="sm:hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">City</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">State</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Zip Code</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="town in towns" :key="town.id" :class="!town.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ town.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getCityName(town.city_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getStateName(town.city_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ town.zip_code || '-' }}
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
                  @click="toggleActive(town)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    !canToggle
                      ? 'cursor-not-allowed opacity-50 text-gray-400'
                      : town.is_active
                        ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :title="town.is_active ? 'Deactivate' : 'Activate'"
                  class="mr-2"
                >
                  <component :is="town.is_active ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ town.is_active ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button
                  @click="handleEditTown(town)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 mr-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    canEdit
                      ? 'text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-200'
                      : 'cursor-not-allowed opacity-50 text-gray-400'
                  ]"
                  title="Edit"
                >
                  <SquarePen class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </button>
                <button
                  @click="deleteTown(town)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-red-50 dark:hover:bg-white/5',
                    canDelete
                      ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                      : 'cursor-not-allowed opacity-50 text-gray-400'
                  ]"
                  title="Delete"
                >
                  <Trash2 class="h-4 w-4" />
                  <span class="sr-only">Delete</span>
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
                <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex gap-2 justify-end">
                  <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
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

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showDeleteModal"
      :title="`Delete ${townToDelete?.name}?`"
      message="Are you sure you want to delete this town? This action cannot be undone."
      confirmButtonText="Delete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { RotateCcw, ShieldAlert, SquarePen, Trash2 } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

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
  state_id: number
}

interface State {
  id: number
  name: string
}

const toast = useToast()
const router = useRouter()
const { can } = usePermissions()
const currentPageTitle = ref('Towns')
const towns = ref<Town[]>([])
const states = ref<State[]>([])
const allCities = ref<City[]>([])
const searchQuery = ref('')
const selectedStateId = ref('')
const selectedCityId = ref('') // Default to "All Cities"
const showDeleteModal = ref(false)
const townToDelete = ref<Town | null>(null)
const isDeleting = ref(false)
const loading = ref(true)
const canCreate = computed(() => can('towns', 'create'))
const canEdit = computed(() => can('towns', 'edit'))
const canDelete = computed(() => can('towns', 'delete'))
const canToggle = computed(() => can('towns', 'change_status'))

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

const filteredCities = computed(() => {
  if (!selectedStateId.value) return []
  return allCities.value.filter(c => c.state_id === Number(selectedStateId.value))
})

const fetchStates = async () => {
  try {
    const response = await api.get('/states', { params: { all: true } })
    states.value = response.data
  } catch (error) {
    console.error('Error fetching states', error)
  }
}

const fetchCities = async () => {
  try {
    const response = await api.get('/cities', { params: { all: true } })
    allCities.value = response.data
  } catch (error) {
    console.error('Error fetching cities', error)
  }
}

const fetchTowns = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
      state_id: selectedStateId.value || undefined,
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
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchTowns(1)
}

const handleStateChange = () => {
  selectedCityId.value = ''
  fetchTowns(1)
}

const handleCityChange = () => {
  fetchTowns(1)
}

const handleAddTown = () => {
  if (!canCreate.value) {
    toast.error('You do not have permission to add towns')
    return
  }
  router.push('/admin/locations/towns/create')
}

const handleEditTown = (town: Town) => {
  if (!canEdit.value) {
    toast.error('You do not have permission to edit towns')
    return
  }
  router.push(`/admin/locations/towns/${town.id}/edit`)
}

const changePage = (page: number) => {
  fetchTowns(page)
}

const getCityName = (cityId: number) => {
  const city = allCities.value.find(c => c.id === cityId)
  return city ? city.name : 'Unknown'
}

const getStateName = (cityId: number) => {
  const city = allCities.value.find(c => c.id === cityId)
  if (!city) return 'Unknown'
  const state = states.value.find(s => s.id === city.state_id)
  return state ? state.name : 'Unknown'
}

const toggleActive = async (town: Town) => {
  if (!canToggle.value) {
    toast.error('You do not have permission to update town status')
    return
  }

  const newStatus = !town.is_active
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} town...`)

  try {
    await api.put(`/towns/${town.id}`, {
      ...town,
      is_active: newStatus
    })
    toast.success(`Town ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchTowns(pagination.value.current_page)
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating town status')
  }
}

const deleteTown = (town: Town) => {
  if (!canDelete.value) {
    toast.error('You do not have permission to delete towns')
    return
  }
  townToDelete.value = town
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!townToDelete.value) return

  isDeleting.value = true
  toast.info('Deleting town...')

  try {
    await api.delete(`/towns/${townToDelete.value.id}`)
    toast.success('Town deleted successfully')
    showDeleteModal.value = false
    townToDelete.value = null
    fetchTowns(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting town')
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  await fetchStates()
  await fetchCities()
  fetchTowns()
})
</script>
