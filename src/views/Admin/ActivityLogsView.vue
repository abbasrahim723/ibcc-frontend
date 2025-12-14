<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">System Activity Logs</h3>

        <div class="flex flex-wrap items-center gap-4">
          <!-- View Mode Toggle -->
          <div class="flex items-center rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              @click="viewMode = 'table'"
              :class="[
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'table'
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
            >
              Table
            </button>
            <button
              @click="viewMode = 'timeline'"
              :class="[
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'timeline'
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
            >
              Timeline
            </button>
          </div>          <!-- User Filter (super-admin only) -->
          <div v-if="isSuperAdmin" class="relative">
            <button
              type="button"
              @click="isUserDropdownOpen = !isUserDropdownOpen"
              class="flex h-11 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:px-4 text-left text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <span v-if="selectedUser" class="flex items-center gap-2 overflow-hidden">
                <img v-if="getUserPhoto(selectedUser)" :src="getUserPhoto(selectedUser)" class="h-6 w-6 rounded-full object-cover flex-shrink-0" />
                <span v-else class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700 flex-shrink-0">
                  {{ selectedUser.name?.charAt(0) || 'U' }}
                </span>
                <div class="truncate">
                  <div class="font-medium truncate">{{ getUserDisplay(selectedUser) }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ getUserRole(selectedUser) || 'Role' }}</div>
                </div>
              </span>
              <span v-else class="text-gray-500">All Users</span>
              <svg class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="isUserDropdownOpen"
              class="absolute z-30 mt-1 max-h-64 w-64 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <input
                  v-model="userSearch"
                  type="text"
                  class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Search users..."
                  @click.stop
                />
              </div>
              <div
                class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="selectUserFilter(null)"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">All</div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">All Users</div>
                  <div class="text-xs text-gray-500">Show every user</div>
                </div>
              </div>
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                @click="selectUserFilter(user)"
                class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <img v-if="getUserPhoto(user)" :src="getUserPhoto(user)" class="h-8 w-8 rounded-full object-cover" />
                <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                  {{ user.name?.charAt(0) || 'U' }}
                </span>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ getUserDisplay(user) }}</div>
                  <div class="text-xs text-gray-500">{{ getUserRole(user) || 'Role' }}</div>
                </div>
              </div>
              <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
                No users found
              </div>
            </div>
            <div v-if="isUserDropdownOpen" class="fixed inset-0 z-10" @click="isUserDropdownOpen = false"></div>
          </div>

          <!-- Date Range -->
          <div class="flex items-center gap-2">
            <flat-pickr
              v-model="filters.start_date"
              :config="dateConfig"
              @on-change="handleFilter"
              class="cursor-pointer rounded-lg border border-gray-300 bg-white px-2 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Start date"
            />
            <span class="text-gray-500 dark:text-gray-400">-</span>
            <flat-pickr
              v-model="filters.end_date"
              :config="dateConfig"
              @on-change="handleFilter"
              class="cursor-pointer rounded-lg border border-gray-300 bg-white px-2 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="End date"
            />
          </div>

          <!-- Action Filter -->
          <select
            v-model="filters.action"
            @change="handleFilter"
            class="rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Actions</option>
            <option v-for="action in actionOptions" :key="action" :value="action">
              {{ action.charAt(0).toUpperCase() + action.slice(1) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-3">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600 dark:border-gray-700 dark:border-t-brand-400"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Loading activity logs...</p>
        </div>
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="log in logs" :key="log.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    v-if="log.user?.profile_photo_url"
                    :src="log.user.profile_photo_url"
                    :alt="log.user?.name || 'System'"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div v-else class="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-xs dark:bg-brand-900/20 dark:text-brand-400">
                    {{ (log.user?.name || 'S').charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ log.user?.name || 'System' }}</div>
                    <div class="text-xs text-gray-500">{{ log.ip_address }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                  getActionColor(log.action)
                ]">
                  {{ log.action.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">{{ log.description }}</div>
                <div class="text-xs text-gray-500" v-if="log.model_type">
                  {{ log.model_type.split('\\').pop() }} #{{ log.model_id }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewDetails(log)"
                  class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  View
                </button>
              </td>
            </tr>
            <tr v-if="logs.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No activity logs found
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination for Table -->
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

      <!-- Timeline View -->
      <div v-else-if="!loading" class="relative">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div v-for="log in logs" :key="log.id">
            <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <!-- Header -->
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="log.user?.profile_photo_url"
                      :src="log.user.profile_photo_url"
                      :alt="log.user?.name || 'System'"
                      class="h-8 w-8 rounded-full object-cover"
                    />
                    <div v-else class="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-xs dark:bg-brand-900/20 dark:text-brand-400">
                      {{ (log.user?.name || 'S').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ log.user?.name || 'System' }}</div>
                      <div class="text-xs text-gray-500">{{ log.ip_address }}</div>
                    </div>
                  </div>
                  <span :class="[
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    getActionColor(log.action)
                  ]">
                    {{ log.action.toUpperCase() }}
                  </span>
                </div>

                <!-- Description -->
                <h4 class="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                  {{ log.description }}
                </h4>

                <!-- Metadata -->
                <div class="mb-3 flex items-center gap-3 text-xs text-gray-500">
                  <span>{{ formatDateTime(log.created_at) }}</span>
                  <span v-if="log.model_type">� {{ log.model_type.split('\\').pop() }} #{{ log.model_id }}</span>
                  <span v-if="log.model_type">{{ log.model_type.split('\\').pop() }} #{{ log.model_id }}</span>
                </div>

                <!-- Changes (if any) - Only show changed attributes -->
                <div v-if="hasChanges(log)" class="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-900/50">
                  <div class="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">Changes:</div>

                  <!-- Before/After Changes - Only show attributes that changed -->
                  <div v-if="log.changes?.before && log.changes?.after" class="space-y-2">
                    <div v-for="(newValue, key) in getChangedAttributes(log.changes)" :key="key" class="text-xs">
                      <div class="font-medium text-gray-600 dark:text-gray-400 mb-1">{{ formatAttributeName(key) }}:</div>
                      <div class="ml-3 flex items-start gap-2">
                        <div class="flex-1 break-words max-w-full overflow-hidden">
                          <span class="text-red-600 dark:text-red-400 line-through break-words">{{ formatValue(log.changes.before[key]) }}</span>
                        </div>
                        <span class="text-gray-400">-&gt;</span>
                        <div class="flex-1 break-words max-w-full overflow-hidden">
                          <span class="text-green-600 dark:text-green-400 font-medium break-words">{{ formatValue(newValue) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- General Changes (fallback) -->
                  <div v-else-if="log.changes" class="max-h-32 overflow-auto">
                    <pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ JSON.stringify(log.changes, null, 2) }}</pre>
                  </div>
                </div>

                <!-- User Agent (collapsed) -->
                <div v-if="log.user_agent" class="mt-3 text-xs text-gray-400 truncate" :title="log.user_agent">
                  {{ log.user_agent }}
                </div>
              </div>
          </div>
        </div>

        <!-- Loading More Indicator -->
        <div v-if="loadingMore" class="mt-12 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600 dark:border-gray-700 dark:border-t-brand-400"></div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Loading more...</p>
          </div>
        </div>

        <!-- Scroll Trigger Element (invisible) -->
        <div ref="scrollTrigger" class="h-1"></div>
      </div>
    </div>

    <!-- Details Modal (with transparent background) -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
      <div class="fixed inset-0 bg-transparent transition-opacity" @click="closeModal"></div>

      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-2xl border-2 border-gray-200 dark:border-gray-700">
          <div class="bg-white px-6 pb-6 pt-6 dark:bg-gray-800">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                Activity Details
              </h3>
              <button
                @click="closeModal"
                class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">User</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog?.user?.name || 'System' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Action</label>
                  <span :class="[
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    getActionColor(selectedLog?.action)
                  ]">
                    {{ selectedLog?.action?.toUpperCase() }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog?.description }}</p>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Date & Time</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(selectedLog?.created_at) }}</p>
              </div>

              <div v-if="selectedLog?.changes" class="max-h-64 overflow-auto">
                <label class="block text-xs font-medium text-gray-500 mb-2">Changes</label>
                <pre class="rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-900 dark:text-gray-300 overflow-x-auto">{{ JSON.stringify(selectedLog.changes, null, 2) }}</pre>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">IP Address</label>
                  <p class="text-sm text-gray-900 dark:text-white font-mono">{{ selectedLog?.ip_address }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">User Agent</label>
                  <p class="text-sm text-gray-900 dark:text-white truncate" :title="selectedLog?.user_agent">{{ selectedLog?.user_agent }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { useDateTimeFormat } from '@/composables/useDateTimeFormat'
import { usePermissions } from '@/composables/usePermissions'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const { permissions } = usePermissions()
const { formatDateTime } = useDateTimeFormat()

const currentPageTitle = ref('Activity Logs')
const logs = ref<any[]>([])
const users = ref<any[]>([])
const showModal = ref(false)
const selectedLog = ref<any>(null)
const viewMode = ref<'table' | 'timeline'>('timeline') // Default to timeline
const loading = ref(false)
const loadingMore = ref(false)
const scrollTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const availableActions = ref<string[]>(['created', 'updated', 'deleted', 'login', 'logout'])
const isSuperAdmin = computed(() => {
  const userRoles = authStore.user?.roles || []
  if (Array.isArray(userRoles)) {
    if (userRoles.some((r: any) => r === 'super-admin' || r?.name === 'super-admin')) return true
  }
  if (permissions.value?.includes?.('super-admin')) return true
  return false
})

const filters = ref({
  action: '',
  model_type: '',
  user_id: '',
  start_date: '',
  end_date: ''
})
const isUserDropdownOpen = ref(false)
const userSearch = ref('')

const selectedUser = computed(() => {
  if (!filters.value.user_id) return null
  return users.value.find((u: any) => String(u.id) === String(filters.value.user_id)) || null
})

const filteredUsers = computed(() => {
  const term = userSearch.value.trim().toLowerCase()
  if (!term) return users.value
  return users.value.filter((u: any) => {
    const hay = [u.name, u.name_prefix, u.first_name, u.last_name, u.email, u.role, u.roles?.[0]?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(term)
  })
})

const dateConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd/m/Y',
}

const actionOptions = computed(() =>
  Array.from(new Set(availableActions.value)).filter(Boolean).sort()
)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

const fetchUsers = async () => {
  // Only needed for super-admin filter
  if (!isSuperAdmin.value) return
  try {
    const response = await api.get('/users', { params: { per_page: 200 } })
    users.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Error fetching users', error)
  }
}

const fetchLogs = async (page = 1, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params: any = {
      page,
      per_page: 15,
      ...filters.value
    }

    // Force own logs for non super-admin
    if (!isSuperAdmin.value && authStore.user?.id) {
      params.user_id = authStore.user.id
    }

    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') delete params[key]
    })

    const response = await api.get('/activity-logs', { params })

    if (append) {
      logs.value = [...logs.value, ...response.data.data]
    } else {
      logs.value = response.data.data
    }

    const newActions = response.data.data.map((l: any) => l.action).filter(Boolean)
    availableActions.value = Array.from(new Set([...availableActions.value, ...newActions]))

    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error('Error fetching activity logs')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleFilter = () => {
  fetchLogs(1)
}

const changePage = (page: number) => {
  fetchLogs(page)
}

const loadMore = () => {
  if (pagination.value.current_page < pagination.value.last_page && !loadingMore.value) {
    fetchLogs(pagination.value.current_page + 1, true)
  }
}

const viewDetails = (log: any) => {
  selectedLog.value = log
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedLog.value = null
}

const getActionColor = (action: string): string => {
  switch (action) {
    case 'created': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'updated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'deleted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'login': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const getUserPhoto = (user: any) => {
  if (!user) return ''
  const path =
    user.profile_photo_url ||
    user.avatar_url ||
    user.photo_url ||
    user.profile_photo_path ||
    user.photo ||
    user.avatar ||
    user.profile_photo ||
    (Array.isArray(user.media) && user.media.length ? (user.media[0].original_url || user.media[0].url || user.media[0].preview_url) : '')
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = ((import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window.location.origin).replace(/\/api\/?$/, '').replace(/\/$/, '')
  const rel = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${rel}`
}

const getUserDisplay = (user: any) => {
  if (!user) return ''
  const prefix = user.name_prefix ? `${user.name_prefix} ` : ''
  const full = user.name || [user.first_name, user.last_name].filter(Boolean).join(' ')
  return (prefix + full).trim() || user.email || 'User'
}

const getUserRole = (user: any) => {
  if (!user) return ''
  if (Array.isArray(user.roles) && user.roles.length) return user.roles[0]?.name || ''
  return user.role || user.primary_role || ''
}

const selectUserFilter = (user: any | null) => {
  filters.value.user_id = user ? user.id.toString() : ''
  isUserDropdownOpen.value = false
  handleFilter()
}

// Check if a log has any changes
const hasChanges = (log: any): boolean => {
  if (!log.changes) return false
  if (log.changes.before && log.changes.after) {
    return Object.keys(getChangedAttributes(log.changes)).length > 0
  }
  return Object.keys(log.changes).length > 0
}

// Get only the attributes that actually changed
const getChangedAttributes = (changes: any): Record<string, any> => {
  if (!changes.before || !changes.after) return {}

  const changedAttrs: Record<string, any> = {}

  for (const key in changes.after) {
    const oldValue = changes.before[key]
    const newValue = changes.after[key]

    // Compare values (handle different types)
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changedAttrs[key] = newValue
    }
  }

  return changedAttrs
}

// Format attribute name for display (convert snake_case to Title Case)
const formatAttributeName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Setup infinite scroll observer
const setupInfiniteScroll = () => {
  if (!scrollTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && !loadingMore.value && pagination.value.current_page < pagination.value.last_page) {
        loadMore()
      }
    },
    {
      root: null,
      rootMargin: '0px 0px 200px 0px', // Trigger 200px before reaching the element (approximately 80% scroll)
      threshold: 0
    }
  )

  observer.observe(scrollTrigger.value)
}

onMounted(async () => {
  // Ensure preferences are loaded
  if (!authStore.preferences) {
    await authStore.fetchPreferences()
  }

  await fetchUsers()

  // Lock to own logs for non super-admins
  if (!isSuperAdmin.value && authStore.user?.id) {
    filters.value.user_id = authStore.user.id.toString()
  } else if (route.query.my_activity === 'true' && authStore.user) {
    filters.value.user_id = authStore.user.id.toString()
  }

  await fetchLogs()

  // Setup infinite scroll after initial load
  setTimeout(() => {
    setupInfiniteScroll()
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
