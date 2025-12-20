<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Notifications" />

    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">Status</label>
          <select v-model="filters.unread" class="form-select">
            <option :value="null">All</option>
            <option :value="true">Unread</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">Type</label>
          <select v-model="filters.type" class="form-select">
            <option value="">All</option>
            <option value="payment">Payments</option>
            <option value="project">Projects</option>
            <option value="customer">Customers</option>
            <option value="supplier">Suppliers</option>
            <option value="labour">Labours</option>
            <option value="document">Documents</option>
            <option value="schedule">Schedules</option>
            <option value="security">Security</option>
          </select>
        </div>
        <button class="btn btn-outline" @click="refresh">Refresh</button>
        <button class="btn btn-primary" @click="markAllRead" :disabled="unreadCount === 0">Mark all as read</button>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <!-- Skeleton Loading State -->
        <ul v-if="loading" class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="n in 6"
            :key="'skeleton-' + n"
            class="flex items-center gap-4 px-4 py-3"
          >
            <!-- Avatar Skeleton -->
            <div class="relative">
              <div class="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div class="absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <!-- Content Skeleton -->
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2">
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div class="flex items-center gap-2">
                <div class="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </li>
        </ul>
        <!-- Empty State -->
        <div v-else-if="items.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          No notifications
        </div>
        <!-- Notification List -->
        <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="notification in items"
            :key="notification.id"
            class="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <span class="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800">
              <img
                v-if="notification.actor?.profile_photo_url"
                :src="notification.actor.profile_photo_url"
                class="h-12 w-12 rounded-full object-cover"
                alt="actor"
              />
              <span v-else class="text-sm font-semibold">
                {{ (notification.actor?.name || 'System').slice(0, 2).toUpperCase() }}
              </span>
              <span v-if="!notification.read_at" class="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900"></span>
            </span>
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-semibold text-gray-900 dark:text-white">{{ notification.title || 'Notification' }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatRelative(notification.created_at) }}</span>
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-300" v-text="notification.message"></div>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">{{ notification.type }}</span>
                <button class="text-blue-600 hover:underline" @click="openTarget(notification)">Open</button>
                <button
                  v-if="!notification.read_at"
                  class="text-gray-600 hover:underline dark:text-gray-300"
                  @click="markRead(notification.id)"
                >
                  Mark read
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notification preferences</h3>
          <button class="btn btn-outline" @click="savePreferences">Save</button>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <p class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Channels</p>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input type="checkbox" v-model="prefDraft.channels.in_app" />
                In-app
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input type="checkbox" v-model="prefDraft.channels.email" />
                Email
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input type="checkbox" v-model="prefDraft.channels.whatsapp" />
                WhatsApp
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input type="checkbox" v-model="prefDraft.channels.sms" />
                SMS
              </label>
            </div>
          </div>
          <div>
            <p class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Types</p>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.payment" /> Payments</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.project" /> Projects</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.customer" /> Customers</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.supplier" /> Suppliers</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.labour" /> Labours</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.document" /> Documents</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.schedule" /> Schedules</label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="prefDraft.types.security" /> Security</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useNotifications } from '@/composables/useNotifications'

const {
  notifications,
  unreadCount,
  fetchNotifications,
  fetchUnreadCount,
  markRead,
  markAllRead,
  fetchPreferences,
  updatePreferences,
  preferences,
} = useNotifications()
const router = useRouter()
const loading = ref(false)
const filters = reactive<{ unread: boolean | null; type: string }>({
  unread: null,
  type: '',
})
const prefDraft = reactive({
  channels: {
    in_app: true,
    email: false,
    sms: false,
    whatsapp: false,
  },
  types: {
    payment: true,
    project: true,
    customer: true,
    supplier: true,
    labour: true,
    document: true,
    schedule: true,
    security: true,
  },
})

const items = computed(() => notifications.value || [])

const formatRelative = (date?: string) => {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const openTarget = async (notification: any) => {
  await markRead(notification.id)
  const target = resolveLink(notification)
  if (target) {
    router.push(target)
  }
}

const resolveLink = (notification: any) => {
  const data = notification.data || {}
  const type = (notification.notifiable_type || '').toLowerCase()
  if (data.payment_id) return `/payments/${data.payment_id}/edit`
  if (type.includes('project') || data.project_id) return `/projects/${data.project_id || notification.notifiable_id}`
  if (type.includes('customer')) return `/customers/${notification.notifiable_id}`
  if (type.includes('supplier')) return `/suppliers/${notification.notifiable_id}`
  if (type.includes('labour')) return `/labours/${notification.notifiable_id}`
  if (type.includes('document')) return `/documents`
  if (type.includes('paymentschedule')) return `/scheduled-payments`
  return null
}

const refresh = async () => {
  loading.value = true
  try {
    await fetchNotifications({
      unread: filters.unread || undefined,
      type: filters.type || undefined,
    })
    await fetchUnreadCount()
  } finally {
    loading.value = false
  }
}

const loadPreferences = async () => {
  await fetchPreferences()
  if (preferences.value) {
    Object.assign(prefDraft.channels, preferences.value.channels || {})
    Object.assign(prefDraft.types, preferences.value.types || {})
  }
}

const savePreferences = async () => {
  await updatePreferences({
    channels: prefDraft.channels,
    types: prefDraft.types,
  })
}

onMounted(async () => {
  await Promise.all([refresh(), loadPreferences()])
})
</script>

<style scoped>
.form-select {
  border-radius: 0.5rem;
  border: 1px solid rgb(229 231 235);
  background: #fff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}
.form-select:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(191 219 254);
}
.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.15s ease;
}
.btn-outline {
  border: 1px solid rgb(229 231 235);
  color: #374151;
  background: #fff;
}
.btn-outline:hover {
  background: rgb(249 250 251);
}
.btn-primary {
  background: rgb(37 99 235);
  color: #fff;
}
.btn-primary:hover {
  background: rgb(29 78 216);
}
.btn-primary:disabled {
  opacity: 0.6;
}
</style>
