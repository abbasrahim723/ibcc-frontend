<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <!-- Tabs -->
      <div class="mb-6 flex border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'roles'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'roles'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
          ]"
        >
          Roles
        </button>
        <button
          @click="activeTab = 'permissions'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'permissions'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
          ]"
        >
          Permissions
        </button>
      </div>

      <!-- Roles Tab -->
      <div v-if="activeTab === 'roles'">
        <div class="mb-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Manage Roles</h3>
            <div class="flex flex-wrap items-center gap-3">
              <input
                v-model="roleSearch"
                type="text"
                placeholder="Search roles..."
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <select
                v-model="roleStatusFilter"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <router-link
                to="/admin/roles/create"
                class="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Add Role
              </router-link>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Permissions</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              <tr v-for="role in paginatedRoles" :key="role.id" :class="{ 'opacity-60': !role.is_active }">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ role.name }}
                  <span v-if="!role.is_active" class="ml-2 text-xs text-gray-500">(Inactive)</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      role.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                    ]"
                  >
                    {{ role.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="perm in role.permissions.slice(0, 3)" :key="perm.id" class="px-2 py-0.5 text-xs bg-gray-100 rounded dark:bg-gray-800">
                      {{ perm.name }}
                    </span>
                    <span v-if="role.permissions.length > 3" class="px-2 py-0.5 text-xs bg-gray-100 rounded dark:bg-gray-800">
                      +{{ role.permissions.length - 3 }} more
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <template v-if="!isProtectedRole(role)">
                    <router-link
                      :to="`/admin/roles/${role.id}/edit`"
                      class="inline-flex items-center justify-center rounded-md p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-white/5 dark:hover:text-brand-200 mr-2"
                      title="Edit"
                    >
                      <SquarePen class="h-4 w-4" />
                      <span class="sr-only">Edit</span>
                    </router-link>
                    <button
                      @click="deleteRole(role.id)"
                      :class="[
                        'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                        role.is_active
                          ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                          : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                      ]"
                      :title="role.is_active ? 'Delete' : 'Restore'"
                    >
                      <component :is="role.is_active ? Trash2 : RotateCcw" class="h-4 w-4" />
                      <span class="sr-only">{{ role.is_active ? 'Delete' : 'Restore' }}</span>
                    </button>
                  </template>
                  <span v-else class="text-xs text-gray-400">Protected</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="roleTotalPages > 1" class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Page {{ rolePage }} of {{ roleTotalPages }}</span>
          <div class="flex gap-2">
            <button
              @click="rolePage--"
              :disabled="rolePage === 1"
              class="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
            >
              Previous
            </button>
            <button
              @click="rolePage++"
              :disabled="rolePage === roleTotalPages"
              class="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Permissions Tab -->
      <div v-if="activeTab === 'permissions'">
        <div class="mb-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Manage Permissions</h3>
            <div class="flex flex-wrap items-center gap-3">
              <input
                v-model="permissionSearch"
                type="text"
                placeholder="Search permissions..."
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <select
                v-model="permissionStatusFilter"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                @click="openPermissionModal()"
                class="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Add Permission
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Assigned Roles</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              <tr v-for="permission in paginatedPermissions" :key="permission.id" :class="{ 'opacity-60': !permission.is_active }">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ permission.name }}
                  <span v-if="!permission.is_active" class="ml-2 text-xs text-gray-500">(Inactive)</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ permission.roles ? permission.roles.length : 0 }} roles
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openPermissionModal(permission)"
                    class="inline-flex items-center justify-center rounded-md p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-white/5 dark:hover:text-brand-200 mr-2"
                    title="Edit"
                  >
                    <SquarePen class="h-4 w-4" />
                    <span class="sr-only">Edit</span>
                  </button>
                  <button
                    @click="deletePermission(permission.id)"
                    :class="[
                      'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/5',
                      permission.is_active
                        ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                    ]"
                    :title="permission.is_active ? 'Delete' : 'Restore'"
                  >
                    <component :is="permission.is_active ? Trash2 : RotateCcw" class="h-4 w-4" />
                    <span class="sr-only">{{ permission.is_active ? 'Delete' : 'Restore' }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="permissionTotalPages > 1" class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Page {{ permissionPage }} of {{ permissionTotalPages }}</span>
          <div class="flex gap-2">
            <button
              @click="permissionPage--"
              :disabled="permissionPage === 1"
              class="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
            >
              Previous
            </button>
            <button
              @click="permissionPage++"
              :disabled="permissionPage === permissionTotalPages"
              class="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Permission Modal -->
    <Modal v-if="isPermissionModalOpen" @close="isPermissionModalOpen = false">
      <div class="relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {{ editingPermission ? 'Edit Permission' : 'Create Permission' }}
        </h3>

        <form @submit.prevent="savePermission" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Permission Name</label>
            <input
              v-model="permissionForm.name"
              type="text"
              required
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="isPermissionModalOpen = false"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showDeleteModal"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      :confirmButtonText="deleteModalButtonText"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { SquarePen, Trash2, RotateCcw } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Modal from '@/components/profile/Modal.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const currentPageTitle = ref('Roles & Permissions')
const activeTab = ref('roles')

const roles = ref([])
const permissions = ref([])
const roleSearch = ref('')
const roleStatusFilter = ref('')
const permissionSearch = ref('')
const permissionStatusFilter = ref('')
const rolePage = ref(1)
const permissionPage = ref(1)
const perPage = 10

// Permission State
const isPermissionModalOpen = ref(false)
const editingPermission = ref(null)
const permissionForm = ref({
  name: ''
})

// Delete Modal State
const showDeleteModal = ref(false)
const deleteModalTitle = ref('')
const deleteModalMessage = ref('')
const deleteModalButtonText = ref('Delete')
const itemToDelete = ref<{ type: 'role' | 'permission', id: number } | null>(null)

const isProtectedRole = (role: any) => role?.name?.toLowerCase() === 'super-admin'

const filteredRoles = computed(() => {
  return roles.value.filter((role: any) => {
    const matchesSearch = role.name.toLowerCase().includes(roleSearch.value.toLowerCase())
    const matchesStatus =
      roleStatusFilter.value === ''
        ? true
        : roleStatusFilter.value === 'active'
          ? role.is_active
          : !role.is_active
    return matchesSearch && matchesStatus
  })
})

const roleTotalPages = computed(() => Math.max(1, Math.ceil(filteredRoles.value.length / perPage)))
const paginatedRoles = computed(() => {
  const start = (rolePage.value - 1) * perPage
  return filteredRoles.value.slice(start, start + perPage)
})

const filteredPermissions = computed(() => {
  return permissions.value.filter((permission: any) => {
    const matchesSearch = permission.name.toLowerCase().includes(permissionSearch.value.toLowerCase())
    const matchesStatus =
      permissionStatusFilter.value === ''
        ? true
        : permissionStatusFilter.value === 'active'
          ? permission.is_active
          : !permission.is_active
    return matchesSearch && matchesStatus
  })
})

const permissionTotalPages = computed(() => Math.max(1, Math.ceil(filteredPermissions.value.length / perPage)))
const paginatedPermissions = computed(() => {
  const start = (permissionPage.value - 1) * perPage
  return filteredPermissions.value.slice(start, start + perPage)
})

// Fetch Data
const fetchRoles = async () => {
  try {
    const response = await api.get('/roles')
    roles.value = response.data
    rolePage.value = 1
  } catch (error) {
    console.error('Error fetching roles', error)
  }
}

const fetchPermissions = async () => {
  try {
    const response = await api.get('/permissions')
    permissions.value = response.data
    permissionPage.value = 1
  } catch (error) {
    console.error('Error fetching permissions', error)
  }
}

// Role Actions
const deleteRole = (id: number) => {
  const role = roles.value.find(r => r.id === id)
  if (!role) return

  itemToDelete.value = { type: 'role', id }
  if (role.is_active) {
    deleteModalTitle.value = 'Deactivate Role'
    deleteModalMessage.value = 'Are you sure you want to deactivate this role? It will be marked as inactive but can be restored later.'
    deleteModalButtonText.value = 'Delete'
  } else {
    deleteModalTitle.value = 'Restore Role'
    deleteModalMessage.value = 'Are you sure you want to restore this role? It will be marked as active again.'
    deleteModalButtonText.value = 'Restore'
  }
  showDeleteModal.value = true
}

// Permission Actions
const openPermissionModal = (permission = null) => {
  editingPermission.value = permission
  if (permission) {
    permissionForm.value = { name: permission.name }
  } else {
    permissionForm.value = { name: '' }
  }
  isPermissionModalOpen.value = true
}

const savePermission = async () => {
  try {
    if (editingPermission.value) {
      await api.put(`/permissions/${editingPermission.value.id}`, permissionForm.value)
      toast.success('Permission updated successfully')
    } else {
      await api.post('/permissions', permissionForm.value)
      toast.success('Permission created successfully')
    }
    isPermissionModalOpen.value = false
    fetchPermissions()
    fetchRoles() // Refresh roles as permissions might have changed
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving permission')
  }
}

const deletePermission = (id: number) => {
  const permission = permissions.value.find(p => p.id === id)
  if (!permission) return

  itemToDelete.value = { type: 'permission', id }
  if (permission.is_active) {
    deleteModalTitle.value = 'Deactivate Permission'
    deleteModalMessage.value = 'Are you sure you want to deactivate this permission? It will be marked as inactive but can be restored later.'
    deleteModalButtonText.value = 'Delete'
  } else {
    deleteModalTitle.value = 'Restore Permission'
    deleteModalMessage.value = 'Are you sure you want to restore this permission? It will be marked as active again.'
    deleteModalButtonText.value = 'Restore'
  }
  showDeleteModal.value = true
}

// Confirm Delete Handler
const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    if (itemToDelete.value.type === 'role') {
      const response = await api.delete(`/roles/${itemToDelete.value.id}`)
      toast.success(response.data.message)
      fetchRoles()
    } else {
      const response = await api.delete(`/permissions/${itemToDelete.value.id}`)
      toast.success(response.data.message)
      fetchPermissions()
      fetchRoles()
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error processing request')
  } finally {
    closeDeleteModal()
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>
