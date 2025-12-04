<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Prefixes</h3>

        <div class="flex items-center gap-4">
          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search prefixes..."
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <!-- Add Button -->
          <button
            @click="openModal()"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Prefix
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="sm:hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="prefix in prefixes" :key="prefix.id" :class="!prefix.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ prefix.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="prefix.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="toggleActive(prefix)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    prefix.is_active
                      ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                      : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :title="prefix.is_active ? 'Deactivate' : 'Activate'"
                  class="mr-2"
                >
                  <component :is="prefix.is_active ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ prefix.is_active ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <button
                  @click="openModal(prefix)"
                  class="inline-flex items-center justify-center rounded-md p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-white/5 dark:hover:text-brand-200 mr-2"
                  title="Edit"
                >
                  <SquarePen class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </button>
                <button
                  @click="deletePrefix(prefix)"
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

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-transparent" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit Prefix' : 'Add Prefix' }}
        </h3>

        <form @submit.prevent="savePrefix" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
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

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showDeleteModal"
      :title="`Delete ${prefixToDelete?.name}?`"
      message="Are you sure you want to delete this prefix? This action cannot be undone."
      confirmButtonText="Delete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SquarePen, RotateCcw, Trash2, ShieldAlert } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

interface Prefix {
  id: number
  name: string
  is_active: boolean
}

const toast = useToast()
const currentPageTitle = ref('Prefixes')
const prefixes = ref<Prefix[]>([])
const searchQuery = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const prefixToDelete = ref<Prefix | null>(null)
const isDeleting = ref(false)
const isEditMode = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  name: '',
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

const fetchPrefixes = async (page = 1) => {
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
    }
    const response = await api.get('/prefixes', { params })
    prefixes.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error('Error fetching prefixes')
  }
}

const handleSearch = () => {
  fetchPrefixes(1)
}

const changePage = (page: number) => {
  fetchPrefixes(page)
}

const openModal = (prefix?: Prefix) => {
  if (prefix) {
    isEditMode.value = true
    editingId.value = prefix.id
    form.value = { ...prefix }
  } else {
    isEditMode.value = false
    editingId.value = null
    form.value = {
      name: '',
      is_active: true
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const savePrefix = async () => {
  try {
    if (isEditMode.value && editingId.value) {
      await api.put(`/prefixes/${editingId.value}`, form.value)
      toast.success('Prefix updated successfully')
    } else {
      await api.post('/prefixes', form.value)
      toast.success('Prefix created successfully')
    }
    closeModal()
    fetchPrefixes(pagination.value.current_page)
  } catch (error: any) {
    // Display validation errors
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors
      // Display the first validation error
      const firstError = Object.values(errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        toast.error(firstError[0])
      } else {
        toast.error(error.response?.data?.message || 'Validation error')
      }
    } else {
      toast.error(error.response?.data?.message || 'Error saving prefix')
    }
  }
}

const toggleActive = async (prefix: Prefix) => {
  const newStatus = !prefix.is_active
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} prefix...`)

  try {
    await api.put(`/prefixes/${prefix.id}`, {
      ...prefix,
      is_active: newStatus
    })
    toast.success(`Prefix ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchPrefixes(pagination.value.current_page)
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating prefix status')
  }
}

const deletePrefix = (prefix: Prefix) => {
  prefixToDelete.value = prefix
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!prefixToDelete.value) return

  isDeleting.value = true
  toast.info('Deleting prefix...')

  try {
    await api.delete(`/prefixes/${prefixToDelete.value.id}`)
    toast.success('Prefix deleted successfully')
    showDeleteModal.value = false
    prefixToDelete.value = null
    fetchPrefixes(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting prefix')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchPrefixes()
})
</script>
