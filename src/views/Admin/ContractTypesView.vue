<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex items-center justify-between gap-4">
        <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Contract Types Management</h3>

        <div v-if="!loading" class="flex flex-1 lg:flex-initial items-center gap-4">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search contract types..."
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <button
            v-if="canCreate"
            @click="handleCreate"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            <span class="flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="hidden md:inline">Add Contract Type</span>
            </span>
          </button>
        </div>

        <!-- Skeleton Header -->
        <div v-else class="flex flex-1 lg:flex-initial items-center gap-4">
          <div class="h-10 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="type in contractTypes" :key="type.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ type.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{ type.code }}</code>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" :title="type.description || ''">
                  {{ type.description || '—' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="type.is_active ? 'inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200' : 'inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200'">
                  {{ type.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="handleEdit(type)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    canEdit
                      ? 'text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-200'
                      : 'cursor-not-allowed opacity-50 text-gray-400'
                  ]"
                  :disabled="!canEdit"
                  title="Edit"
                >
                  <SquarePen class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </button>
                <button
                  @click="toggleActive(type)"
                  :class="[
                    'ml-2 inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    !canToggle
                      ? 'cursor-not-allowed opacity-50 text-gray-400'
                      : type.is_active
                        ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                  :disabled="!canToggle"
                  :title="type.is_active ? 'Deactivate' : 'Activate'"
                >
                  <component :is="type.is_active ? Trash2 : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ type.is_active ? 'Deactivate' : 'Activate' }}</span>
                </button>
              </td>
            </tr>
            <tr v-if="contractTypes.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No contract types found</td>
            </tr>
          </tbody>

          <!-- Skeleton Table Rows -->
          <tbody v-else class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="n in 8" :key="n" class="animate-pulse">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-5 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex gap-2 justify-end">
                  <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SquarePen, RotateCcw, Trash2 } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

interface ContractType {
  id: number
  name: string
  code: string
  description: string | null
  is_active: boolean
  sort_order: number
}

const toast = useToast()
const router = useRouter()
const { can } = usePermissions()
const currentPageTitle = ref('Contract Types')
const contractTypes = ref<ContractType[]>([])
const searchQuery = ref('')
const loading = ref(true)
const canCreate = computed(() => can('contract_types', 'create'))
const canEdit = computed(() => can('contract_types', 'edit'))
const canToggle = computed(() => can('contract_types', 'change_status'))

const fetchContractTypes = async () => {
  loading.value = true
  try {
    const params = { search: searchQuery.value || undefined }
    const res = await api.get('/contract-types', { params })
    contractTypes.value = res.data
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching contract types')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => fetchContractTypes()

const handleCreate = () => {
  if (!canCreate.value) {
    toast.error('You do not have permission to add contract types')
    return
  }
  router.push('/contract-types/create')
}

const handleEdit = (type: ContractType) => {
  if (!canEdit.value) {
    toast.error('You do not have permission to edit contract types')
    return
  }
  router.push(`/contract-types/${type.id}/edit`)
}

const toggleActive = async (type: ContractType) => {
  if (!canToggle.value) {
    toast.error('You do not have permission to change contract type status')
    return
  }

  const action = type.is_active ? 'deactivate' : 'activate'

  try {
    const res = await api.put(`/contract-types/${type.id}`, {
      ...type,
      is_active: !type.is_active
    })
    toast.success(res.data.message || `Contract type ${action}d successfully`)
    fetchContractTypes()
  } catch (e: any) {
    toast.error(e.response?.data?.message || `Error ${action}ing contract type`)
  }
}

onMounted(() => {
  fetchContractTypes()
})
</script>
