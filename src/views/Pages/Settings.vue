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

      <!-- Skeleton Loading -->
      <div v-if="loading" class="space-y-6">
        <!-- Skeleton Theme Mode -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div class="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div v-for="n in 3" :key="n" class="p-4 border border-gray-300 rounded-lg dark:border-gray-700">
              <div class="flex items-center">
                <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-3"></div>
                <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Currency -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div class="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Skeleton Date & Time -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div class="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <!-- Skeleton Notifications -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div class="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                <div class="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="h-6 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                <div class="h-3 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="h-6 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                <div class="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="h-6 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <!-- Skeleton Save Button -->
        <div class="flex justify-end">
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Preferences Form -->
      <form v-if="!loading" @submit.prevent="savePreferences" class="space-y-6">
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

    <!-- Loading Modal (while sending OTP) -->
    <div v-if="isSendingOTP && !showOTPModal" class="modal-backdrop">
      <div class="modal-content text-center">
        <div class="mb-4">
          <svg
            class="animate-spin h-12 w-12 text-brand-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
          Sending OTP
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Please wait while we send the verification code to your email...
        </p>
      </div>
    </div>

    <!-- OTP Verification Modal -->
    <div v-if="showOTPModal" class="modal-backdrop" @click.self="closeOTPModal">
      <div class="modal-content">
        <div class="mb-5">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Verify 2FA Enable
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div class="space-y-4">
          <!-- OTP Input -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Verification Code<span class="text-error-500">*</span>
            </label>
            <input
              v-model="otpCode"
              type="text"
              maxlength="6"
              placeholder="000000"
              :class="[
                'h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 text-center text-2xl tracking-widest',
                otpError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
              ]"
              @keyup.enter="verify2FAEnable"
            />
            <p v-if="otpError" class="mt-1 text-xs text-red-600 dark:text-red-400">
              {{ otpError }}
            </p>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Code expires in {{ formatTime(timeRemaining) }}
            </p>
          </div>

          <!-- Verify Button -->
          <button
            @click="verify2FAEnable"
            :disabled="isVerifying || !otpCode || otpCode.length !== 6"
            class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isVerifying"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isVerifying ? 'Verifying...' : 'Verify & Enable 2FA' }}
          </button>

          <!-- Resend OTP -->
          <div class="text-center">
            <button
              type="button"
              @click="resendOTP"
              :disabled="!canResend || isSendingOTP"
              class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSendingOTP ? 'Sending...' : canResend ? 'Resend Code' : `Resend in ${formatTime(resendTimeRemaining)}` }}
            </button>
          </div>

          <!-- Cancel Button -->
          <button
            @click="closeOTPModal"
            type="button"
            class="w-full px-4 py-2.5 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for 2FA Enable -->
    <div v-if="showConfirmModal" class="modal-backdrop" @click.self="closeConfirmModal">
      <div class="modal-content">
        <div class="mb-5">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Enable Two-Factor Authentication
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            An OTP will be sent to your email address. You will need to enter this code to enable 2FA.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="closeConfirmModal"
            type="button"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            @click="confirmSendOTP"
            :disabled="isSendingOTP"
            class="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isSendingOTP"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSendingOTP ? 'Sending...' : 'Send OTP' }}
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>


<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/components/layout/ThemeProvider.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'

const authStore = useAuthStore()
const toast = useToast()
const { theme } = useTheme()
const currentPageTitle = ref('Account Settings')
const loading = computed(() => isLoadingPreferences.value)

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

// OTP Modal state
const showOTPModal = ref(false)
const showConfirmModal = ref(false)
const otpCode = ref('')
const isVerifying = ref(false)
const isSendingOTP = ref(false)
const otpError = ref('')
const timeRemaining = ref(300) // 5 minutes
const resendTimeRemaining = ref(60) // 1 minute
const canResend = ref(false)
const isTogglingProgrammatically = ref(false) // Flag to prevent infinite loop
const isLoadingPreferences = ref(true) // Flag to prevent watch trigger on initial load
let timer = null
let resendTimer = null

onMounted(async () => {
  isLoadingPreferences.value = true
  await authStore.fetchPreferences()
  if (authStore.preferences) {
    form.value = { ...form.value, ...authStore.preferences }
    // Sync local form with global theme
    if (authStore.preferences.theme_mode) {
      theme.value = authStore.preferences.theme_mode
    }
  }
  // Set flag to false after preferences are loaded
  await nextTick()
  isLoadingPreferences.value = false
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

// Watch for 2FA toggle changes
watch(() => form.value.two_factor_enabled, async (newValue, oldValue) => {
  // Skip if we're loading preferences initially
  if (isLoadingPreferences.value) {
    return
  }

  // Skip if we're toggling programmatically to prevent infinite loop
  if (isTogglingProgrammatically.value) {
    return
  }

  // Only trigger if value actually changed and not initial load
  if (oldValue !== undefined && newValue !== oldValue) {
    if (newValue) {
      // Enabling 2FA - show confirmation first
      showConfirmModal.value = true
    } else {
      // Disabling 2FA - no OTP required
      await disable2FA()
    }
  }
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timeRemaining.value = 300
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(timer)
      toast.error('OTP expired. Please request a new one.')
      closeOTPModal()
    }
  }, 1000)
}

const startResendTimer = () => {
  canResend.value = false
  resendTimeRemaining.value = 60
  if (resendTimer) clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    if (resendTimeRemaining.value > 0) {
      resendTimeRemaining.value--
    } else {
      clearInterval(resendTimer)
      canResend.value = true
    }
  }, 1000)
}

const confirmSendOTP = async () => {
  showConfirmModal.value = false
  await initiate2FAEnable()
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  // Revert toggle if user cancels
  isTogglingProgrammatically.value = true
  form.value.two_factor_enabled = false
  nextTick(() => {
    isTogglingProgrammatically.value = false
  })
}

const initiate2FAEnable = async () => {
  isSendingOTP.value = true
  try {
    await api.post('/auth/2fa/enable')
    toast.success('OTP sent to your email')
    showOTPModal.value = true
    otpCode.value = ''
    otpError.value = ''
    startTimer()
    startResendTimer()
  } catch (error) {
    console.error('Failed to send OTP', error)
    toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    // Revert toggle
    isTogglingProgrammatically.value = true
    form.value.two_factor_enabled = false
    nextTick(() => {
      isTogglingProgrammatically.value = false
    })
  } finally {
    isSendingOTP.value = false
  }
}

const verify2FAEnable = async () => {
  if (!otpCode.value || otpCode.value.length !== 6) {
    otpError.value = 'Please enter a valid 6-digit code'
    return
  }

  isVerifying.value = true
  otpError.value = ''

  try {
    await api.post('/auth/2fa/verify-enable', {
      otp_code: otpCode.value
    })

    toast.success('2FA enabled successfully!')
    closeOTPModal()

    // Update preferences
    await authStore.fetchPreferences()
    if (authStore.preferences) {
      isTogglingProgrammatically.value = true
      form.value.two_factor_enabled = authStore.preferences.two_factor_enabled
      nextTick(() => {
        isTogglingProgrammatically.value = false
      })
    }
  } catch (error) {
    console.error('OTP verification failed', error)
    otpError.value = error.response?.data?.message || 'Invalid OTP code'
    toast.error(otpError.value)
  } finally {
    isVerifying.value = false
  }
}

const disable2FA = async () => {
  try {
    await api.post('/auth/2fa/disable')
    toast.success('2FA disabled successfully')

    // Update preferences
    await authStore.fetchPreferences()
    if (authStore.preferences) {
      isTogglingProgrammatically.value = true
      form.value.two_factor_enabled = authStore.preferences.two_factor_enabled
      nextTick(() => {
        isTogglingProgrammatically.value = false
      })
    }
  } catch (error) {
    console.error('Failed to disable 2FA', error)
    toast.error(error.response?.data?.message || 'Failed to disable 2FA')
    // Revert toggle
    isTogglingProgrammatically.value = true
    form.value.two_factor_enabled = true
    nextTick(() => {
      isTogglingProgrammatically.value = false
    })
  }
}

const resendOTP = async () => {
  isSendingOTP.value = true
  try {
    await api.post('/auth/2fa/enable')
    toast.success('New OTP sent to your email')
    otpCode.value = ''
    otpError.value = ''
    startTimer()
    startResendTimer()
  } catch (error) {
    console.error('Failed to resend OTP', error)
    toast.error(error.response?.data?.message || 'Failed to resend OTP')
  } finally {
    isSendingOTP.value = false
  }
}

const closeOTPModal = () => {
  showOTPModal.value = false
  otpCode.value = ''
  otpError.value = ''
  if (timer) clearInterval(timer)
  if (resendTimer) clearInterval(resendTimer)
  // Revert toggle if modal closed without verification
  isTogglingProgrammatically.value = true
  form.value.two_factor_enabled = false
  nextTick(() => {
    isTogglingProgrammatically.value = false
  })
}

const savePreferences = async () => {
  try {
    // Don't include two_factor_enabled in regular save as it's handled separately
    const { two_factor_enabled, ...prefsToSave } = form.value
    await authStore.updatePreferences(prefsToSave)
    toast.success('Preferences saved successfully!')
  } catch (error) {
    console.error('Error saving preferences', error)
    toast.error('Error saving preferences. Please try again.')
  }
}
</script>

<style scoped>
/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

/* Modal content */
.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 28rem;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .modal-content {
  background: rgb(17 24 39);
}
</style>
