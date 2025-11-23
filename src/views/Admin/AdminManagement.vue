<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Admin Management</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Manage admin users and assign roles
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        Add New Admin
      </button>
    </div>

    <!-- Users Table -->
    <div class="border border-gray-200 rounded-2xl dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Roles
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" :src="user.profile_photo_url || '/images/user/owner.jpg'" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 mr-1"
                >
                  {{ role.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editUser(user)"
                  class="text-brand-600 hover:text-brand-900 dark:text-brand-400 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          {{ showEditModal ? 'Edit Admin' : 'Add New Admin' }}
        </h3>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Name
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div v-if="!showEditModal">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!showEditModal"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Role
            </label>
            <select
              v-model="form.role"
              required
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">Select a role</option>
              <option v-for="role in roles" :key="role.id" :value="role.name">
                {{ role.name }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              {{ showEditModal ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const users = ref([])
const roles = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const form = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: '',
})

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    const response = await adminStore.fetchUsers()
    users.value = response.data
    await adminStore.fetchRoles()
    roles.value = adminStore.roles
  } catch (error) {
    console.error('Error loading data', error)
  }
}

const editUser = (user: any) => {
  form.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role: user.roles[0]?.name || '',
  }
  showEditModal.value = true
}

const saveUser = async () => {
  try {
    if (showEditModal.value) {
      await adminStore.updateUser(form.value.id, form.value)
    } else {
      await adminStore.createUser(form.value)
    }
    await loadData()
    closeModal()
    alert('User saved successfully!')
  } catch (error: any) {
    console.error('Error saving user', error)
    alert(error.response?.data?.message || 'Error saving user')
  }
}

const deleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await adminStore.deleteUser(id)
      await loadData()
      alert('User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user', error)
      alert('Error deleting user')
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role: '',
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
