<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Loading Skeleton -->
    <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <!-- Header Skeleton -->
      <div class="mb-6">
        <div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div class="space-y-6">
        <!-- Form Fields Grid Skeleton -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- State Selector Skeleton -->
          <div>
            <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
            <div class="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <!-- City Selector Skeleton -->
          <div>
            <div class="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
            <div class="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <!-- Town Selector Skeleton -->
          <div>
            <div class="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
            <div class="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <!-- Phase Name Skeleton -->
          <div>
            <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
            <div class="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Active Checkbox Skeleton -->
        <div class="flex items-center">
          <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
          <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- Actual Form -->
    <div v-else class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit Phase / Sector' : 'Add Phase / Sector' }}
        </h3>
      </div>

      <form @submit.prevent="savePhase" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- State Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.state_id"
                @change="handleStateChange"
                required
                :disabled="loadingStates"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select State</option>
                <option v-for="state in states" :key="state.id" :value="state.id">
                  {{ state.name }}
                </option>
              </select>
              <LoadingSpinner v-if="loadingStates" size="sm" class="absolute right-8 top-2.5" />
            </div>
          </div>

          <!-- City Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.city_id"
                @change="handleCityChange"
                required
                :disabled="!form.state_id || loadingCities"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select City</option>
                <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
              <LoadingSpinner v-if="loadingCities" size="sm" class="absolute right-8 top-2.5" />
            </div>
          </div>

          <!-- Town Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Town <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.town_id"
                required
                :disabled="!form.city_id || loadingTowns"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select Town</option>
                <option v-for="town in filteredTowns" :key="town.id" :value="town.id">
                  {{ town.name }}
                </option>
              </select>
              <LoadingSpinner v-if="loadingTowns" size="sm" class="absolute right-8 top-2.5" />
            </div>
          </div>

          <!-- Phase Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phase / Sector Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Active Checkbox -->
        <div class="flex items-center">
          <input
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="goBack"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {{ isEditMode ? 'Update Phase' : 'Create Phase' }}
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

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

const route = useRoute()
const router = useRouter()
const toast = useToast()

const currentPageTitle = ref('Add Phase')
const isEditMode = ref(false)
const phaseId = ref<number | null>(null)

const states = ref<State[]>([])
const allCities = ref<City[]>([])
const allTowns = ref<Town[]>([])
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingTowns = ref(false)
const pageLoading = ref(true)

const form = ref({
  name: '',
  state_id: '' as number | '',
  city_id: '' as number | '',
  town_id: '' as number | '',
  is_active: true
})

const filteredCities = computed(() => {
  if (!form.value.state_id) return []
  return allCities.value.filter(c => c.state_id === Number(form.value.state_id))
})

const filteredTowns = computed(() => {
  if (!form.value.city_id) return []
  return allTowns.value.filter(t => t.city_id === Number(form.value.city_id))
})

const handleStateChange = () => {
  form.value.city_id = ''
  form.value.town_id = ''
}

const handleCityChange = () => {
  form.value.town_id = ''
}

const fetchStates = async () => {
  loadingStates.value = true
  try {
    const response = await api.get('/states', { params: { all: true } })
    states.value = response.data
  } catch (error) {
    console.error('Error fetching states', error)
  } finally {
    loadingStates.value = false
  }
}

const fetchCities = async () => {
  loadingCities.value = true
  try {
    const response = await api.get('/cities', { params: { all: true } })
    allCities.value = response.data
  } catch (error) {
    console.error('Error fetching cities', error)
  } finally {
    loadingCities.value = false
  }
}

const fetchTowns = async () => {
  loadingTowns.value = true
  try {
    const response = await api.get('/towns', { params: { all: true } })
    allTowns.value = response.data
  } catch (error) {
    console.error('Error fetching towns', error)
  } finally {
    loadingTowns.value = false
  }
}

const fetchPhase = async (id: number) => {
  try {
    const response = await api.get(`/phases/${id}`)
    const phase = response.data

    // Get town to find city_id, and city to find state_id
    const town = allTowns.value.find(t => t.id === phase.town_id)
    const city = town ? allCities.value.find(c => c.id === town.city_id) : null

    form.value = {
      name: phase.name,
      state_id: city ? city.state_id : '',
      city_id: town ? town.city_id : '',
      town_id: phase.town_id,
      is_active: phase.is_active
    }
  } catch (error: any) {
    toast.error('Error fetching phase details')
    goBack()
  }
}

const savePhase = async () => {
  try {
    const payload = {
      name: form.value.name,
      town_id: form.value.town_id,
      is_active: form.value.is_active
    }

    if (isEditMode.value && phaseId.value) {
      await api.put(`/phases/${phaseId.value}`, payload)
      toast.success('Phase updated successfully')
    } else {
      await api.post('/phases', payload)
      toast.success('Phase created successfully')
    }

    router.push('/admin/locations/phases')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving phase')
  }
}

const goBack = () => {
  router.push('/admin/locations/phases')
}

const loadData = async () => {
  try {
    await Promise.all([
      fetchStates(),
      fetchCities(),
      fetchTowns()
    ])

    // Check if editing
    if (route.params.id) {
      isEditMode.value = true
      phaseId.value = Number(route.params.id)
      currentPageTitle.value = 'Edit Phase'
      await fetchPhase(phaseId.value)
    }
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  loadData()
})
</script>
