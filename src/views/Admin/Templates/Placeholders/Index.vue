<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Placeholders</h3>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- Model Filter -->
          <select
            v-model="modelFilter"
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Models</option>
            <option v-for="model in uniqueModels" :key="model" :value="model">
              {{ model }}
            </option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search placeholders..."
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <!-- Add Button -->
          <router-link
            to="/admin/templates/placeholders/create"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Placeholder
          </router-link>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Key</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Model</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Attribute</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="placeholder in filteredPlaceholders" :key="placeholder.id" :class="!placeholder.status ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ placeholder.key }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ placeholder.model }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ placeholder.attribute }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {{ placeholder.description || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="placeholder.status" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="toggleActive(placeholder)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    placeholder.status
                      ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                      : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :title="placeholder.status ? 'Deactivate' : 'Activate'"
                  class="mr-2"
                >
                  <component :is="placeholder.status ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ placeholder.status ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <router-link
                  :to="`/admin/templates/placeholders/${placeholder.id}/edit`"
                  class="inline-flex items-center justify-center rounded-md p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-white/5 dark:hover:text-brand-200 mr-2"
                  title="Edit"
                >
                  <SquarePen class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </router-link>
                <button
                  @click="deletePlaceholder(placeholder)"
                  class="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-white/5 dark:hover:text-red-200"
                  title="Delete"
                >
                  <Trash2 class="h-4 w-4" />
                  <span class="sr-only">Delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showDeleteModal"
      :title="`Delete ${placeholderToDelete?.key}?`"
      message="Are you sure you want to delete this placeholder? This action cannot be undone."
      confirmButtonText="Delete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { SquarePen, RotateCcw, Trash2, ShieldAlert } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

interface Placeholder {
  id: number
  key: string
  model: string
  attribute: string
  description: string | null
  status: boolean
}

const toast = useToast()
const currentPageTitle = ref('Placeholders')
const placeholders = ref<Placeholder[]>([])
const searchQuery = ref('')
const modelFilter = ref('')
const showDeleteModal = ref(false)
const placeholderToDelete = ref<Placeholder | null>(null)
const isDeleting = ref(false)

const fetchPlaceholders = async () => {
  try {
    const response = await api.get('/placeholders')
    placeholders.value = response.data
  } catch (error: any) {
    toast.error('Error fetching placeholders')
  }
}

const handleSearch = () => {
  // Client-side search since API returns all
}

// Get unique models for filter
const uniqueModels = computed(() => {
  const models = placeholders.value.map(p => p.model)
  return [...new Set(models)].sort()
})

// Computed for filtering
const filteredPlaceholders = computed(() => {
  let filtered = placeholders.value

  // Filter by model
  if (modelFilter.value) {
    filtered = filtered.filter(p => p.model === modelFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.key.toLowerCase().includes(query) ||
      p.model.toLowerCase().includes(query) ||
      p.attribute.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    )
  }

  return filtered
})

const toggleActive = async (placeholder: Placeholder) => {
  const newStatus = !placeholder.status
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} placeholder...`)

  try {
    await api.put(`/placeholders/${placeholder.id}`, {
      ...placeholder,
      status: newStatus
    })
    toast.success(`Placeholder ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchPlaceholders()
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating placeholder status')
  }
}

const deletePlaceholder = (placeholder: Placeholder) => {
  placeholderToDelete.value = placeholder
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!placeholderToDelete.value) return

  isDeleting.value = true
  toast.info('Deleting placeholder...')

  try {
    await api.delete(`/placeholders/${placeholderToDelete.value.id}`)
    toast.success('Placeholder deleted successfully')
    showDeleteModal.value = false
    placeholderToDelete.value = null
    fetchPlaceholders()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting placeholder')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchPlaceholders()
})
</script>
