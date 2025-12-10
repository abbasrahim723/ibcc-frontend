<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isSuperAdmin ? 'Signatures' : 'My Signatures' }}
          </h3>
          <div v-if="isSuperAdmin" class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Owner</label>
              <select
                v-model="filters.owner_id"
                @change="fetchSignatures"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Type</label>
              <select
                v-model="filters.signature_type"
                @change="fetchSignatures"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All</option>
                <option value="drawn">Drawn</option>
                <option value="typed">Typed</option>
                <option value="uploaded">Uploaded</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Status</label>
              <select
                v-model="filters.status"
                @change="fetchSignatures"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- Add Button -->
          <router-link
            to="/admin/templates/signatures/create"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Add Signature
          </router-link>
        </div>
      </div>

      <!-- Grid of Signatures -->
      <div v-if="signatures.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="signature in signatures"
          :key="signature.id"
          class="relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          :class="{ 'ring-2 ring-brand-500': signature.is_default }"
        >
          <!-- Default Badge -->
          <div v-if="signature.is_default" class="absolute right-2 top-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
            Default
          </div>

          <!-- Preview -->
          <div class="mb-4 flex h-32 items-center justify-center rounded-lg bg-gray-50 p-2 dark:bg-gray-900">
            <img
              v-if="signature.signature_data"
              :src="getSignatureUrl(signature)"
              alt="Signature Preview"
              class="max-h-full max-w-full object-contain"
            />
            <span v-else class="text-sm text-gray-400">No Preview</span>
          </div>

          <!-- Info -->
          <div class="mb-4 flex-1">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">{{ signature.signature_type }}</span>
              <span :class="signature.status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="rounded-full px-2 py-0.5 text-xs font-semibold">
                {{ signature.status ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Created: {{ formatDate(signature.created_at) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
            <button
              v-if="!signature.is_default && signature.status"
              @click="setAsDefault(signature)"
              class="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Set Default
            </button>
            <span v-else class="text-sm text-gray-400"></span>

            <div class="flex items-center gap-2">
              <button
                @click="toggleStatus(signature)"
                :class="[
                  'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
                  canToggle
                    ? (signature.status ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400')
                    : 'text-gray-400 cursor-not-allowed opacity-60'
                ]"
                :disabled="!canToggle"
                :title="signature.status ? 'Deactivate' : 'Activate'"
              >
                <component :is="signature.status ? ShieldAlert : RotateCcw" class="h-5 w-5" />
              </button>
              <router-link
                :to="`/admin/templates/signatures/${signature.id}/edit`"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </router-link>
              <button
                @click="deleteSignature(signature)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <div class="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">No signatures found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Create your first signature to get started.</p>
        <router-link
          to="/admin/templates/signatures/create"
          class="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
        >
          Add Signature
        </router-link>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showDeleteModal"
      title="Delete Signature?"
      message="Are you sure you want to delete this signature? This action cannot be undone."
      confirmButtonText="Delete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { format } from 'date-fns'
import { usePermissions } from '@/composables/usePermissions'
import { ShieldAlert, RotateCcw } from 'lucide-vue-next'

interface Signature {
  id: number
  owner_type: string
  owner_id: number
  signature_type: string
  signature_data: string
  style: string | null
  status: boolean
  is_default: boolean
  created_at: string
}

const toast = useToast()
const currentPageTitle = ref('Signatures')
const signatures = ref<Signature[]>([])
const showDeleteModal = ref(false)
const signatureToDelete = ref<Signature | null>(null)
const isDeleting = ref(false)
const users = ref<any[]>([])
const filters = ref({
  owner_id: '',
  signature_type: '',
  status: ''
})

const { roles, permissions } = usePermissions()
const isSuperAdmin = computed(() => {
  const hasRole = Array.isArray(roles.value) && roles.value.some((r: any) => r === 'super-admin' || r?.name === 'super-admin')
  const hasPerm = Array.isArray(permissions.value) && permissions.value.includes('super-admin')
  return hasRole || hasPerm
})
const canToggle = computed(() => permissions.value?.includes('signatures.change_status') || isSuperAdmin.value)

const fetchSignatures = async () => {
  try {
    const params: Record<string, any> = {}
    if (isSuperAdmin.value) {
      if (filters.value.owner_id) params.owner_id = filters.value.owner_id
      if (filters.value.signature_type) params.signature_type = filters.value.signature_type
      if (filters.value.status !== '') params.status = filters.value.status
    }

    const response = await api.get('/signatures', { params })
    signatures.value = response.data
  } catch (error: any) {
    toast.error('Error fetching signatures')
  }
}

const getSignatureUrl = (signature: Signature) => {
  // For base64 data (drawn/typed), use as is
  if (signature.signature_data.startsWith('data:image')) {
    return signature.signature_data
  }
  
  // For uploaded files, use the same pattern as project thumbnails
  if (signature.signature_type === 'uploaded') {
    return `http://ibcc-both.test/ibcc-app/public/storage/${signature.signature_data}`
  }
  
  return signature.signature_data
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

const setAsDefault = async (signature: Signature) => {
  toast.info('Updating default signature...')
  try {
    await api.put(`/signatures/${signature.id}`, {
      ...signature,
      is_default: true
    })
    toast.success('Default signature updated')
    fetchSignatures()
  } catch (error: any) {
    toast.error('Error updating default signature')
  }
}

const deleteSignature = (signature: Signature) => {
  signatureToDelete.value = signature
  showDeleteModal.value = true
}

const toggleStatus = async (signature: Signature) => {
  if (!canToggle.value) {
    toast.error('You do not have permission to change signature status')
    return
  }
  toast.info(signature.status ? 'Deactivating signature...' : 'Activating signature...')
  try {
    await api.put(`/signatures/${signature.id}`, {
      ...signature,
      status: !signature.status
    })
    toast.success('Signature status updated')
    fetchSignatures()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error updating signature status')
  }
}

const confirmDelete = async () => {
  if (!signatureToDelete.value) return

  isDeleting.value = true
  toast.info('Deleting signature...')

  try {
    await api.delete(`/signatures/${signatureToDelete.value.id}`)
    toast.success('Signature deleted successfully')
    showDeleteModal.value = false
    signatureToDelete.value = null
    fetchSignatures()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting signature')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  if (isSuperAdmin.value) {
    api.get('/users/list').then(res => {
      users.value = res.data || []
    }).catch(() => {})
  }
  fetchSignatures()
})
</script>
