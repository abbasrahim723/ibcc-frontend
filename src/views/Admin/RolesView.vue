<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Roles & Permissions</h3>
      
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="role in roles" :key="role.id" class="p-4 border rounded-lg dark:border-gray-700">
          <h4 class="text-lg font-bold mb-2">{{ role.name }}</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="permission in role.permissions" :key="permission.id" class="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">
              {{ permission.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'

const currentPageTitle = ref('Roles')
const roles = ref([])

const fetchRoles = async () => {
  try {
    const response = await api.get('/roles')
    roles.value = response.data
  } catch (error) {
    console.error('Error fetching roles', error)
  }
}

onMounted(() => {
  fetchRoles()
})
</script>
