<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Phases / Sectors</h3>

        <div v-if="!loading" class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- State Filter -->
          <GenericSelect
            v-model="selectedStateId"
            :options="stateOptions"
            placeholder="All States"
            searchable
            class="w-[180px]"
            @change="handleStateChange"
          />

          <!-- City Filter -->
          <GenericSelect
            v-model="selectedCityId"
            :options="cityOptions"
            placeholder="All Cities"
            searchable
            class="w-[180px]"
            :disabled="!selectedStateId"
            @change="handleCityChange"
          />

          <!-- Town Filter -->
          <GenericSelect
            v-model="selectedTownId"
            :options="townOptions"
            placeholder="All Towns"
            searchable
            class="w-[180px]"
            :disabled="!selectedCityId"
            @change="handleTownChange"
          />

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search phases..."
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <!-- Add Button -->
          <button
            v-if="canCreate"
            @click="handleAddPhase"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Phase
          </button>
        </div>

        <!-- Skeleton Header -->
        <div v-else class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="h-10 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
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
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Town</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">City</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="phase in phases" :key="phase.id" :class="!phase.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ phase.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ phase.town?.name || 'Unknown' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ phase.town?.city?.name || 'Unknown' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="phase.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="toggleActive(phase)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    !canToggle
                      ? 'cursor-not-allowed opacity-50 text-gray-400'
                      : phase.is_active
                        ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :title="phase.is_active ? 'Deactivate' : 'Activate'"
                  class="mr-2"
                >
                  <component :is="phase.is_active ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ phase.is_active ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button
                  @click="handleEditPhase(phase)"
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
                  @click="deletePhase(phase)"
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
      :title="`Delete ${phaseToDelete?.name}?`"
      message="Are you sure you want to delete this phase/sector? This action cannot be undone."
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
import GenericSelect from '@/components/forms/GenericSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

interface Phase {
  id: number
  name: string
  town_id: number
  is_active: boolean
  town?: {
    id: number
    name: string
    city?: {
      id: number
      name: string
    }
  }
}

interface Town {
  id: number
  name: string
  city_id: number
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
const currentPageTitle = ref('Phases / Sectors')
const phases = ref<Phase[]>([])
const states = ref<State[]>([])
const allCities = ref<City[]>([])
const allTowns = ref<Town[]>([])
const searchQuery = ref('')
const selectedStateId = ref('')
const selectedCityId = ref('') // Default to "All Cities"
const selectedTownId = ref('') // Default to "All Towns"
const showDeleteModal = ref(false)
const phaseToDelete = ref<Phase | null>(null)
const isDeleting = ref(false)
const loading = ref(true)
const canCreate = computed(() => can('phases', 'create'))
const canEdit = computed(() => can('phases', 'edit'))
const canDelete = computed(() => can('phases', 'delete'))
const canToggle = computed(() => can('phases', 'change_status'))

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

const filteredTowns = computed(() => {
  if (!selectedCityId.value) return []
  return allTowns.value.filter(t => t.city_id === Number(selectedCityId.value))
})

const stateOptions = computed(() => [
  { value: '', label: 'All States' },
  ...states.value.map(s => ({ value: s.id.toString(), label: s.name }))
])

const cityOptions = computed(() => [
  { value: '', label: 'All Cities' },
  ...filteredCities.value.map(c => ({ value: c.id.toString(), label: c.name }))
])

const townOptions = computed(() => [
  { value: '', label: 'All Towns' },
  ...filteredTowns.value.map(t => ({ value: t.id.toString(), label: t.name }))
])

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

const fetchTowns = async () => {
  try {
    const response = await api.get('/towns', { params: { all: true } })
    allTowns.value = response.data
  } catch (error) {
    console.error('Error fetching towns', error)
  }
}

const fetchPhases = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
      town_id: selectedTownId.value || undefined,
      city_id: selectedCityId.value || undefined,
      state_id: selectedStateId.value || undefined,
    }
    const response = await api.get('/phases', { params })
    phases.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error('Error fetching phases')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchPhases(1)
}

const handleStateChange = () => {
  selectedCityId.value = ''
  selectedTownId.value = ''
  fetchPhases(1)
}

const handleCityChange = () => {
  selectedTownId.value = ''
  fetchPhases(1)
}

const handleTownChange = () => {
  fetchPhases(1)
}

const handleAddPhase = () => {
  if (!canCreate.value) {
    toast.error('You do not have permission to add phases')
    return
  }
  router.push('/admin/locations/phases/create')
}

const handleEditPhase = (phase: Phase) => {
  if (!canEdit.value) {
    toast.error('You do not have permission to edit phases')
    return
  }
  router.push(`/admin/locations/phases/${phase.id}/edit`)
}

const changePage = (page: number) => {
  fetchPhases(page)
}

const toggleActive = async (phase: Phase) => {
  if (!canToggle.value) {
    toast.error('You do not have permission to update phase status')
    return
  }

  const newStatus = !phase.is_active
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} phase...`)

  try {
    await api.put(`/phases/${phase.id}`, {
      ...phase,
      is_active: newStatus
    })
    toast.success(`Phase ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchPhases(pagination.value.current_page)
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating phase status')
  }
}

const deletePhase = (phase: Phase) => {
  if (!canDelete.value) {
    toast.error('You do not have permission to delete phases')
    return
  }
  phaseToDelete.value = phase
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!phaseToDelete.value) return

  isDeleting.value = true
  toast.info('Deleting phase...')

  try {
    await api.delete(`/phases/${phaseToDelete.value.id}`)
    toast.success('Phase deleted successfully')
    showDeleteModal.value = false
    phaseToDelete.value = null
    fetchPhases(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting phase')
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  await fetchStates()
  await fetchCities()
  await fetchTowns()
  fetchPhases()
})
</script>
