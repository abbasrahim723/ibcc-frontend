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
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Manage Roles</h3>
          <button
            @click="openRoleModal()"
            class="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Add Role
          </button>
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
              <tr v-for="role in roles" :key="role.id" :class="{ 'opacity-60': !role.is_active }">
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
                  <button @click="openRoleModal(role)" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3">Edit</button>
                  <button
                    @click="deleteRole(role.id)"
                    :class="role.is_active
                      ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                  >
                    {{ role.is_active ? 'Delete' : 'Restore' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Permissions Tab -->
      <div v-if="activeTab === 'permissions'">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Manage Permissions</h3>
          <button
            @click="openPermissionModal()"
            class="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Add Permission
          </button>
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
              <tr v-for="permission in permissions" :key="permission.id" :class="{ 'opacity-60': !permission.is_active }">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ permission.name }}
                  <span v-if="!permission.is_active" class="ml-2 text-xs text-gray-500">(Inactive)</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ permission.roles ? permission.roles.length : 0 }} roles
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openPermissionModal(permission)" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3">Edit</button>
                  <button
                    @click="deletePermission(permission.id)"
                    :class="permission.is_active
                      ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'"
                  >
                    {{ permission.is_active ? 'Delete' : 'Restore' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Role Modal -->
    <Modal v-if="isRoleModalOpen" @close="isRoleModalOpen = false">
      <div class="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {{ editingRole ? 'Edit Role' : 'Create Role' }}
        </h3>

        <form @submit.prevent="saveRole" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Role Name</label>
            <input
              v-model="roleForm.name"
              type="text"
              required
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="roleForm.is_active"
              type="checkbox"
              id="is_active"
              class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Permissions</label>
            <div class="max-h-60 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div class="grid grid-cols-2 gap-2">
                <div v-for="perm in permissions" :key="perm.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="perm.name"
                    v-model="roleForm.permissions"
                    :id="'perm-' + perm.id"
                    class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label :for="'perm-' + perm.id" class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ perm.name }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="isRoleModalOpen = false"
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
import { ref, onMounted } from 'vue'
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

// Role State
const isRoleModalOpen = ref(false)
const editingRole = ref(null)
const roleForm = ref({
  name: '',
  is_active: true,
  permissions: []
})

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

// Fetch Data
const fetchRoles = async () => {
  try {
    const response = await api.get('/roles')
    roles.value = response.data
  } catch (error) {
    console.error('Error fetching roles', error)
  }
}

const fetchPermissions = async () => {
  try {
    const response = await api.get('/permissions')
    permissions.value = response.data
  } catch (error) {
    console.error('Error fetching permissions', error)
  }
}

// Role Actions
const openRoleModal = (role = null) => {
  editingRole.value = role
  if (role) {
    roleForm.value = {
      name: role.name,
      is_active: role.is_active !== undefined ? Boolean(role.is_active) : true,
      permissions: role.permissions.map(p => p.name)
    }
  } else {
    roleForm.value = {
      name: '',
      is_active: true,
      permissions: []
    }
  }
  isRoleModalOpen.value = true
}

const saveRole = async () => {
  try {
    if (editingRole.value) {
      await api.put(`/roles/${editingRole.value.id}`, roleForm.value)
      toast.success('Role updated successfully')
    } else {
      await api.post('/roles', roleForm.value)
      toast.success('Role created successfully')
    }
    isRoleModalOpen.value = false
    fetchRoles()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving role')
  }
}

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
