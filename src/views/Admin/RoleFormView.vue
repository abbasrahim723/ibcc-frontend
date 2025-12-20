<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <!-- Loading Skeleton -->
    <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <!-- Header Skeleton -->
      <div class="mb-6">
        <div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div class="space-y-6">
        <!-- Role Name Field Skeleton -->
        <div>
          <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1.5"></div>
          <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Active Checkbox Skeleton -->
        <div class="flex items-center">
          <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
          <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Permissions Section Skeleton -->
        <div>
          <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="n in 12" :key="n" class="flex items-center">
                <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
                <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="flex justify-end gap-3 pt-4">
          <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- Actual Form -->
    <div v-else class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ pageTitle }}
        </h3>
      </div>

      <form class="space-y-6" @submit.prevent="saveRole">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Role Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
          />
        </div>

        <div class="flex items-center">
          <input
            v-model="form.is_active"
            type="checkbox"
            id="is_active"
            class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <label for="is_active" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Permissions</label>
          <div class="max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="perm in permissions" :key="perm.id" class="flex items-center">
                <input
                  type="checkbox"
                  :value="perm.name"
                  v-model="form.permissions"
                  :id="'perm-' + perm.id"
                  class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label :for="'perm-' + perm.id" class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ perm.name }}</label>
              </div>
            </div>
            <div v-if="permissions.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
              No permissions available.
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <router-link
            to="/admin/roles"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 disabled:opacity-60"
          >
            {{ submitting ? 'Saving...' : (isEdit ? 'Update Role' : 'Create Role') }}
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

interface RoleResponse {
  id: number
  name: string
  is_active: boolean
  permissions: Array<{ id: number; name: string }>
}

interface Permission {
  id: number
  name: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const form = ref({
  name: '',
  is_active: true,
  permissions: [] as string[],
})

const permissions = ref<Permission[]>([])
const submitting = ref(false)
const pageLoading = ref(true)
const isEdit = computed(() => Boolean(route.params.id))
const pageTitle = computed(() => (isEdit.value ? 'Edit Role' : 'Create Role'))

const fetchPermissions = async () => {
  try {
    const response = await api.get('/permissions')
    permissions.value = response.data
  } catch (error) {
    toast.error('Error fetching permissions')
  }
}

const fetchRole = async (id: string) => {
  try {
    // API only exposes index; fetch all then pick the one we need
    const response = await api.get('/roles')
    const role: RoleResponse | undefined = response.data.find((r: RoleResponse) => String(r.id) === id)
    if (!role) {
      throw new Error('Role not found')
    }
    form.value = {
      name: role.name,
      is_active: role.is_active !== undefined ? Boolean(role.is_active) : true,
      permissions: role.permissions?.map((p) => p.name) || [],
    }
  } catch (error) {
    toast.error('Error loading role details')
    router.push('/admin/roles')
  }
}

const saveRole = async () => {
  submitting.value = true
  try {
    if (isEdit.value) {
      await api.put(`/roles/${route.params.id}`, form.value)
      toast.success('Role updated successfully')
    } else {
      await api.post('/roles', form.value)
      toast.success('Role created successfully')
    }
    router.push('/admin/roles')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving role')
  } finally {
    submitting.value = false
  }
}

const loadData = async () => {
  try {
    await fetchPermissions()
    if (isEdit.value && typeof route.params.id === 'string') {
      await fetchRole(route.params.id)
    }
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  loadData()
})
</script>
