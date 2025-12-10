<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Templates</h3>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search templates..."
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <!-- Add Button -->
          <router-link
            v-if="canCreate"
            to="/admin/templates/templates/create"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Template
          </router-link>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="template in filteredTemplates" :key="template.id" :class="!template.status ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ template.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                {{ template.type.replace('_', ' ') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="template.status" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="toggleActive(template)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    !canToggle
                      ? 'cursor-not-allowed opacity-50 text-gray-400'
                      : template.status
                        ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :disabled="!canToggle"
                  :title="template.status ? 'Deactivate' : 'Activate'"
                  class="mr-2"
                >
                  <component :is="template.status ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ template.status ? 'Deactivate' : 'Activate' }}</span>
                </button>
                <router-link
                  :to="`/admin/templates/templates/${template.id}/edit`"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 mr-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    canEdit
                      ? 'text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-200'
                      : 'cursor-not-allowed opacity-50 text-gray-400'
                  ]"
                  :aria-disabled="!canEdit"
                  :tabindex="canEdit ? 0 : -1"
                  title="Edit"
                >
                  <SquarePen class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </router-link>
                <button
                  @click="deleteTemplate(template)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-red-50 dark:hover:bg-white/5',
                    canDelete
                      ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                      : 'cursor-not-allowed opacity-50 text-gray-400'
                  ]"
                  :disabled="!canDelete"
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
      :title="`Delete ${templateToDelete?.title}?`"
      message="Are you sure you want to delete this template? This action cannot be undone."
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
import { usePermissions } from '@/composables/usePermissions'

interface Template {
  id: number
  title: string
  type: string
  content: string
  status: boolean
}

const toast = useToast()
const { can } = usePermissions()
const currentPageTitle = ref('Templates')
const templates = ref<Template[]>([])
const searchQuery = ref('')
const showDeleteModal = ref(false)
const templateToDelete = ref<Template | null>(null)
const isDeleting = ref(false)
const canCreate = computed(() => can('templates', 'create'))
const canEdit = computed(() => can('templates', 'edit'))
const canDelete = computed(() => can('templates', 'delete'))
const canToggle = computed(() => can('templates', 'change_status'))

const fetchTemplates = async () => {
  try {
    const response = await api.get('/templates')
    templates.value = response.data
  } catch (error: any) {
    toast.error('Error fetching templates')
  }
}

const handleSearch = () => {
  // Client-side search
}

// Computed for filtering
const filteredTemplates = computed(() => {
  if (!searchQuery.value) return templates.value
  const query = searchQuery.value.toLowerCase()
  return templates.value.filter(t => 
    t.title.toLowerCase().includes(query) ||
    t.type.toLowerCase().includes(query)
  )
})

const toggleActive = async (template: Template) => {
  if (!canToggle.value) {
    toast.error('You do not have permission to change template status')
    return
  }

  const newStatus = !template.status
  const actionText = newStatus ? 'Activating' : 'Deactivating'

  toast.info(`${actionText} template...`)

  try {
    await api.put(`/templates/${template.id}`, {
      ...template,
      status: newStatus
    })
    toast.success(`Template ${newStatus ? 'activated' : 'deactivated'} successfully`)
    fetchTemplates()
  } catch (error: any) {
    console.error('Toggle error:', error)
    toast.error(error.response?.data?.message || 'Error updating template status')
  }
}

const deleteTemplate = (template: Template) => {
  if (!canDelete.value) {
    toast.error('You do not have permission to delete templates')
    return
  }

  templateToDelete.value = template
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!templateToDelete.value) return

  isDeleting.value = true
  toast.info('Deleting template...')

  try {
    await api.delete(`/templates/${templateToDelete.value.id}`)
    toast.success('Template deleted successfully')
    showDeleteModal.value = false
    templateToDelete.value = null
    fetchTemplates()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting template')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>
