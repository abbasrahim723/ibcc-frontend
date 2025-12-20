<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center gap-3 text-gray-700 dark:text-gray-400 group"
      @click.prevent="toggleDropdown"
    >
      <span class="overflow-hidden rounded-full h-11 w-11 border border-gray-200 dark:border-gray-700">
        <div v-if="loading" class="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <img v-else :src="userPhoto" alt="User" class="h-full w-full object-cover" />
      </span>

      <div class="hidden flex-col items-start lg:flex text-left mr-1">
        <span v-if="loading" class="block h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></span>
        <span v-else class="block font-medium text-theme-sm text-gray-700 dark:text-gray-200 leading-tight group-hover:text-brand-600 transition-colors">{{ userName }}</span>
        <span v-if="loading" class="block h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></span>
        <span v-else-if="userRole" class="block text-xs text-gray-500 dark:text-gray-400 font-normal capitalize mt-0.5">{{ userRole }}</span>
      </div>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span v-if="loading" class="block h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></span>
        <span v-else class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ user?.name || 'User' }}
        </span>
        <span v-if="loading" class="block h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></span>
        <span v-else class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ user?.email || '' }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <button
        @click="handleLogout"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, PlugInIcon, ListIcon, DocsIcon } from '@/icons'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'


import { usePermissions } from '@/composables/usePermissions'

const authStore = useAuthStore()
const { roles } = usePermissions()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const user = computed(() => authStore.user)
const loading = computed(() => authStore.loading)
const userName = computed(() => {
  if (authStore.user?.first_name && authStore.user?.last_name) {
    return `${authStore.user.first_name} ${authStore.user.last_name}`
  }
  return authStore.user?.name || 'User'
})

const userPhoto = computed(() => {
  return authStore.user?.profile_photo_url || '/images/user/owner.jpg'
})

const userRole = computed(() => {
  if (roles.value && roles.value.length > 0) {
    return roles.value[0].replace(/-/g, ' ')
  }
  return ''
})

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'My Profile' },
  { href: '/admin/activity-logs?my_activity=true', icon: ListIcon, text: 'My Activity' },
  { href: '/admin/templates/signatures', icon: DocsIcon, text: 'My Signatures' },
  { href: '/settings', icon: SettingsIcon, text: 'Account Settings' },
  { href: '/security', icon: PlugInIcon, text: 'Security Settings' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeDropdown()
  } catch (error) {
    console.error('Error logging out', error)
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
