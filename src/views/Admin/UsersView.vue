<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">User Management</h3>
        <button @click="openCreateModal" class="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600">
          Add User
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span v-for="role in user.roles" :key="role.id" class="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-200 dark:text-blue-800">
                  {{ role.name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="editUser(user)" class="mr-2 text-blue-600 hover:underline">Edit</button>
                <button @click="deleteUser(user.id)" class="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'

const currentPageTitle = ref('Users')
const users = ref([])

const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data.data
  } catch (error) {
    console.error('Error fetching users', error)
  }
}

const openCreateModal = () => {
  // Implement create modal logic
  alert('Create User Modal - To be implemented')
}

const editUser = (user: any) => {
  // Implement edit modal logic
  alert(`Edit User ${user.name} - To be implemented`)
}

const deleteUser = async (id: number) => {
  if (confirm('Are you sure?')) {
    try {
      await api.delete(`/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user', error)
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
