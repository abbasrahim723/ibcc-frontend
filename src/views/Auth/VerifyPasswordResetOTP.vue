<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/forgot-password"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                class="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Back
            </router-link>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Verify Reset Code
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter the 6-digit code sent to {{ maskedEmail }}
                </p>
              </div>

              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- OTP Code -->
                    <div>
                      <label
                        for="otp"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Verification Code<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="otpCode"
                        type="text"
                        id="otp"
                        name="otp"
                        placeholder="000000"
                        maxlength="6"
                        required
                        :class="[
                          'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 text-center text-2xl tracking-widest',
                          validationErrors.otp_code
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                        ]"
                      />
                      <p v-if="validationErrors.otp_code" class="mt-1 text-xs text-red-600 dark:text-red-400">
                        {{ validationErrors.otp_code[0] }}
                      </p>
                      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                        Code expires in {{ formatTime(timeRemaining) }}
                      </p>
                    </div>
                    <!-- Button -->
                    <div>
                      <button
                        type="submit"
                        :disabled="isLoading"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          v-if="isLoading"
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
                        {{ isLoading ? 'Verifying...' : 'Verify Code' }}
                      </button>
                    </div>
                    <!-- Resend -->
                    <div class="text-center">
                      <button
                        type="button"
                        @click="resendCode"
                        :disabled="canResend === false || isResending"
                        class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {{ isResending ? 'Sending...' : canResend ? 'Resend Code' : `Resend in ${formatTime(resendTimeRemaining)}` }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="{231}" height="{48}" src="/images/logo/auth-logo.svg" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">
                IBCC's CRM Developed by Abbas Rahim - Software Engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const email = ref(route.query.email as string || '')
const otpCode = ref('')
const isLoading = ref(false)
const isResending = ref(false)
const validationErrors = ref<any>({})
const timeRemaining = ref(300) // 5 minutes in seconds
const resendTimeRemaining = ref(60) // 1 minute cooldown
const canResend = ref(false)
let timer: any = null
let resendTimer: any = null

const maskedEmail = computed(() => {
  if (!email.value) return ''
  const [username, domain] = email.value.split('@')
  const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1)
  return `${maskedUsername}@${domain}`
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(timer)
      toast.error('Verification code has expired. Please request a new one.')
    }
  }, 1000)
}

const startResendTimer = () => {
  canResend.value = false
  resendTimeRemaining.value = 60
  resendTimer = setInterval(() => {
    if (resendTimeRemaining.value > 0) {
      resendTimeRemaining.value--
    } else {
      clearInterval(resendTimer)
      canResend.value = true
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (!email.value) {
    toast.error('Email is required')
    router.push('/forgot-password')
    return
  }

  // Reset errors
  validationErrors.value = {}
  isLoading.value = true

  try {
    await authStore.verifyPasswordResetOTP(email.value, otpCode.value)

    // Show success toast
    toast.success('Code verified successfully!')

    // Redirect to reset password page
    router.push({
      path: '/reset-password',
      query: { email: email.value, otp: otpCode.value }
    })
  } catch (error: any) {
    console.error('OTP verification failed', error)

    // Handle validation errors
    if (error.response?.status === 422 && error.response?.data?.errors) {
      validationErrors.value = error.response.data.errors
      toast.error('Please fix the validation errors below.')
    }
    // Handle invalid OTP
    else if (error.response?.status === 422 || error.response?.status === 400) {
      toast.error(error.response?.data?.message || 'Invalid or expired code. Please try again.')
    }
    // Handle network errors
    else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      toast.error('Unable to connect to the server. Please make sure the Laravel backend is running.')
    }
    // Generic error
    else {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (!email.value) {
    toast.error('Email is required')
    router.push('/forgot-password')
    return
  }

  isResending.value = true

  try {
    await authStore.initiateForgotPassword(email.value)
    toast.success('New code sent to your email!')

    // Reset timers
    timeRemaining.value = 300
    startResendTimer()
  } catch (error: any) {
    console.error('Resend failed', error)
    toast.error(error.response?.data?.message || 'Failed to resend code. Please try again.')
  } finally {
    isResending.value = false
  }
}

onMounted(() => {
  if (!email.value) {
    toast.error('Email is required')
    router.push('/forgot-password')
    return
  }
  startTimer()
  startResendTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (resendTimer) clearInterval(resendTimer)
})
</script>
