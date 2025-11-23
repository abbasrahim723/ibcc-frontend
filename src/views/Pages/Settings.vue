<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Account Settings
      </h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Manage your account preferences and settings
      </p>

      <!-- Preferences Form -->
      <form @submit.prevent="savePreferences" class="space-y-6">
        <!-- Theme Mode -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Theme Mode
          </h4>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
              <input
                v-model="form.theme_mode"
                type="radio"
                value="light"
                class="w-4 h-4 text-brand-500 focus:ring-brand-500"
              />
              <span class="ml-3 text-sm font-medium text-gray-800 dark:text-white/90">Light</span>
            </label>
            <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
              <input
                v-model="form.theme_mode"
                type="radio"
                value="dark"
                class="w-4 h-4 text-brand-500 focus:ring-brand-500"
              />
              <span class="ml-3 text-sm font-medium text-gray-800 dark:text-white/90">Dark</span>
            </label>
            <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
              <input
                v-model="form.theme_mode"
                type="radio"
                value="system"
                class="w-4 h-4 text-brand-500 focus:ring-brand-500"
              />
              <span class="ml-3 text-sm font-medium text-gray-800 dark:text-white/90">System</span>
            </label>
          </div>
        </div>

        <!-- Currency & Format Preferences -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Regional Settings
          </h4>
          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Currency
              </label>
              <select
                v-model="form.currency"
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="PKR">PKR - Pakistani Rupee</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Date Format
              </label>
              <select
                v-model="form.date_format"
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="Y-m-d">YYYY-MM-DD</option>
                <option value="d-m-Y">DD-MM-YYYY</option>
                <option value="m-d-Y">MM-DD-YYYY</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Time Format
              </label>
              <select
                v-model="form.time_format"
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="24h">24 Hour</option>
                <option value="12h">12 Hour</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Timezone
              </label>
              <select
                v-model="form.timezone"
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Asia/Karachi">Pakistan Time</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Notifications
          </h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  Enable Notifications
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Receive notifications about your account activity
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.notifications_enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  Email Notifications
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Receive email updates about your account
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.email_notifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                  Two-Factor Authentication
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.two_factor_enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"
                ></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="flex justify-center rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/components/layout/ThemeProvider.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const authStore = useAuthStore()
const toast = useToast()
const { theme } = useTheme()
const currentPageTitle = ref('Account Settings')

const form = ref({
  theme_mode: 'system',
  currency: 'USD',
  date_format: 'Y-m-d',
  time_format: '24h',
  timezone: 'UTC',
  notifications_enabled: true,
  email_notifications: true,
  two_factor_enabled: false,
})

onMounted(async () => {
  await authStore.fetchPreferences()
  if (authStore.preferences) {
    form.value = { ...form.value, ...authStore.preferences }
    // Sync local form with global theme
    if (authStore.preferences.theme_mode) {
      theme.value = authStore.preferences.theme_mode
    }
  }
})

// Watch for theme changes in the form and apply them immediately
watch(() => form.value.theme_mode, async (newTheme) => {
  if (newTheme) {
    theme.value = newTheme
    // Save to DB immediately
    try {
      await authStore.updatePreferences({ theme_mode: newTheme })
    } catch (error) {
      console.error('Failed to save theme preference', error)
    }
  }
})

const savePreferences = async () => {
  try {
    await authStore.updatePreferences(form.value)
    toast.success('Preferences saved successfully!')
  } catch (error) {
    console.error('Error saving preferences', error)
    toast.error('Error saving preferences. Please try again.')
  }
}
</script>
