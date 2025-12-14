<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="toggleDropdown"
    >
      <span
        :class="{ hidden: !notifying, flex: notifying }"
        class="absolute right-0 top-0.5 z-1 h-2 w-2 rounded-full bg-orange-400"
      >
        <span
          class="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 -z-1 animate-ping"
        ></span>
      </span>
      <svg
        class="fill-current"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
          fill=""
        />
      </svg>
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
    >
      <div
        class="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800"
      >
        <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Notification</h5>
        <div class="flex items-center gap-2">
          <button
            class="text-xs rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click.stop="toggleUnreadFilter"
          >
            {{ showUnreadOnly ? 'Show all' : 'Show unread' }}
          </button>
          <button @click="closeDropdown" class="text-gray-500 dark:text-gray-400">
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="decoratedNotifications.length === 0" class="flex h-full flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
        <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 6a9 9 0 100 12 9 9 0 000-12z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">No notifications yet</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">You’re all caught up. Actions for your team will show here.</p>
        <button
          class="mt-3 text-xs rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="toggleUnreadFilter"
        >
          {{ showUnreadOnly ? 'Show all' : 'Show unread' }}
        </button>
      </div>

      <ul v-else class="flex flex-col h-auto overflow-y-auto custom-scrollbar">
        <li
          v-for="notification in decoratedNotifications"
          :key="notification.id"
          @click.prevent="handleItemClick(notification)"
        >
          <a
            class="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            href="#"
          >
            <span class="relative block w-full h-10 rounded-full z-1 max-w-10">
              <img :src="notification.userImage" alt="User" class="overflow-hidden rounded-full" />
              <span
                v-if="notification.isUnread"
                class="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-blue-500 dark:border-gray-900"
              ></span>
            </span>

            <span class="block">
              <span class="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-800 dark:text-white/90">
                  {{ notification.userName }}
                </span>
                {{ notification.action }}
              </span>

              <span class="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                <span>{{ notification.type }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{{ notification.time }}</span>
              </span>
            </span>
          </a>
        </li>
      </ul>

      <router-link
        :to="{ name: 'Notifications' }"
        class="mt-3 flex justify-center rounded-lg border border-gray-300 bg-white p-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        @click="handleViewAllClick"
      >
        View All Notification
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const route = useRoute()
const router = useRouter()
const { notifications, unreadCount, fetchUnreadCount, fetchNotifications, markRead } = useNotifications()
const showUnreadOnly = ref(true)

const notifying = computed(() => (unreadCount.value || 0) > 0)

const toggleDropdown = async () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    await fetchNotifications({ unread: showUnreadOnly.value ? true : undefined })
    await fetchUnreadCount()
  }
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

const handleItemClick = async (notification: any) => {
  closeDropdown()
  await markRead(notification.id)
  const target = resolveLink(notification)
  if (target) {
    router.push(target)
  }
}

const handleViewAllClick = async (event: Event) => {
  event.preventDefault()
  closeDropdown()
  await router.push({ name: 'Notifications' })
}

const toggleUnreadFilter = async () => {
  showUnreadOnly.value = !showUnreadOnly.value
  await fetchNotifications({ unread: showUnreadOnly.value ? true : undefined })
  await fetchUnreadCount()
}

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
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

const decoratedNotifications = computed(() =>
  (notifications.value || []).map((n) => ({
    ...n,
    userName: n.actor?.name || 'System',
    userImage: n.actor?.profile_photo_url || '/images/user/user-01.jpg',
    action: n.message || '',
    type: n.type?.split('.')[0] || 'General',
    time: formatRelativeTime(n.created_at),
    isUnread: !n.read_at,
  }))
)

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await fetchUnreadCount()
  await fetchNotifications({ unread: showUnreadOnly.value ? true : undefined })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Refresh unread on route change (page navigation)
watch(
  () => route.fullPath,
  async () => {
    await fetchUnreadCount()
  }
)
</script>
