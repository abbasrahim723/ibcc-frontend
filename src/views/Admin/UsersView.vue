<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>

        <div class="flex items-center gap-4 w-full sm:w-auto">
          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search users..."
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white flex-1 sm:flex-initial"
          />

          <!-- Add User Button -->
          <button
            @click="router.push('/users/create')"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            <span class="flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="hidden md:inline">Add User</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
              <th class="sm:hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
              <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Roles</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="user in users" :key="user.id" :class="!user.is_active ? 'opacity-60' : ''">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" class="h-10 w-10 rounded-full" />
                    <div v-else class="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                      <span v-if="isCurrentUser(user.id)" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">You</span>
                      <span v-if="!user.is_active" class="ml-2 text-xs text-gray-500">(Inactive)</span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.is_active" class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Inactive
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span v-for="role in user.roles" :key="role.id" class="inline-flex rounded-full bg-brand-100 px-2 text-xs font-semibold leading-5 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    {{ role.name }}
                  </span>
                  <span v-if="!user.roles || user.roles.length === 0" class="text-gray-400 italic">No roles</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="router.push(`/users/${user.id}/edit`)"
                  :disabled="isCurrentUser(user.id)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-white/5 dark:hover:text-brand-200 mr-2',
                    isCurrentUser(user.id) ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  :title="isCurrentUser(user.id) ? 'Use your profile page to edit your own account' : 'Edit'"
                >
                  <SquarePen class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </button>
                <button
                  @click="toggleUserStatus(user.id)"
                  :disabled="isCurrentUser(user.id)"
                  :class="[
                    'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                    user.is_active
                      ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
                    isCurrentUser(user.id) ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  :title="isCurrentUser(user.id) ? 'You cannot deactivate your own account' : (user.is_active ? 'Deactivate' : 'Activate')"
                >
                  <component :is="user.is_active ? ShieldAlert : RotateCcw" class="h-4 w-4" />
                  <span class="sr-only">{{ user.is_active ? 'Deactivate' : 'Activate' }}</span>
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

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmButtonText="confirmModalButtonText"
      @close="closeConfirmModal"
      @confirm="confirmAction"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SquarePen, ShieldAlert, RotateCcw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Users')
const currentUser = ref<any>(null)
const users = ref([])
const searchQuery = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

// Confirmation Modal State
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalButtonText = ref('Confirm')
const pendingAction = ref(null)

// Check if user is the currently logged-in user
const isCurrentUser = (userId: number) => {
  if (!currentUser.value) return false

  const currentUserId = Number(currentUser.value.id)
  const compareUserId = Number(userId)

  return currentUserId === compareUserId
}

const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/profile')
    // The profile endpoint might return { user: {...} } or just the user object
    currentUser.value = response.data.user || response.data
  } catch (error: any) {
    console.error('Error fetching current user:', error)
  }
}

const fetchUsers = async (page = 1) => {
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
    }
    const response = await api.get('/users', { params })
    users.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching users')
  }
}

const handleSearch = () => {
  fetchUsers(1)
}

const changePage = (page: number) => {
  fetchUsers(page)
}

const toggleUserStatus = (id: number) => {
  const user = users.value.find((u: any) => u.id === id)
  if (!user) return

  // Check if trying to deactivate self
  if (isCurrentUser(id)) {
    toast.error('You cannot deactivate your own account')
    return
  }

  pendingAction.value = { type: 'toggle', id }
  if (user.is_active) {
    confirmModalTitle.value = 'Deactivate User'
    confirmModalMessage.value = 'Are you sure you want to deactivate this user? They will be logged out from all devices and will not be able to log in.'
    confirmModalButtonText.value = 'Deactivate'
  } else {
    confirmModalTitle.value = 'Activate User'
    confirmModalMessage.value = 'Are you sure you want to activate this user? They will be able to log in again.'
    confirmModalButtonText.value = 'Activate'
  }
  showConfirmModal.value = true
}

const confirmAction = async () => {
  if (!pendingAction.value) return

  try {
    if (pendingAction.value.type === 'toggle') {
      const response = await api.delete(`/users/${pendingAction.value.id}`)
      toast.success(response.data.message)
      fetchUsers(pagination.value.current_page)
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error processing request')
  } finally {
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingAction.value = null
}

onMounted(() => {
  fetchCurrentUser()
  fetchUsers()
})
</script>
