<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/"
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
              Back to dashboard
            </router-link>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in! (v1.0.9)
                </p>
              </div>

              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <!-- Email -->
                    <div>
                      <label
                        for="email"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Email<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="info@gmail.com"
                        required
                        :class="[
                          'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                          validationErrors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                        ]"
                      />
                      <p v-if="validationErrors.email" class="mt-1 text-xs text-red-600 dark:text-red-400">
                        {{ validationErrors.email[0] }}
                      </p>
                    </div>
                    <!-- Password -->
                    <div>
                      <label
                        for="password"
                        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Password<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          id="password"
                          placeholder="Enter your password"
                          required
                          :class="[
                            'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
                            validationErrors.password
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                              : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                          ]"
                        />
                        <span
                          @click="togglePasswordVisibility"
                          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                        >
                          <svg
                            v-if="!showPassword"
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
                              d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                              fill="#98A2B3"
                            />
                          </svg>
                          <svg
                            v-else
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
                              d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                              fill="#98A2B3"
                            />
                          </svg>
                        </span>
                      </div>
                      <p v-if="validationErrors.password" class="mt-1 text-xs text-red-600 dark:text-red-400">
                        {{ validationErrors.password[0] }}
                      </p>
                    </div>
                    <!-- Checkbox -->
                    <div class="flex items-center justify-between">
                      <div>
                        <label
                          for="keepLoggedIn"
                          class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                        >
                          <div class="relative">
                            <input
                              v-model="keepLoggedIn"
                              type="checkbox"
                              id="keepLoggedIn"
                              class="sr-only"
                            />
                            <div
                              :class="
                                keepLoggedIn
                                  ? 'border-brand-500 bg-brand-500'
                                  : 'bg-transparent border-gray-300 dark:border-gray-700'
                              "
                              class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
                            >
                              <span :class="keepLoggedIn ? '' : 'opacity-0'">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                    stroke="white"
                                    stroke-width="1.94437"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                          Keep me logged in
                        </label>
                      </div>
                      <router-link
                        to="/forgot-password"
                        class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >Forgot password?</router-link
                      >
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
                        {{ isLoading ? 'Signing In...' : 'Sign In' }}
                      </button>
                    </div>
                    <div class="pt-2">
                      <button
                        type="button"
                        :disabled="bioLoading || !isWebAuthnSupported"
                        @click="handleBiometricLogin"
                        class="flex items-center justify-center w-full gap-2 rounded-lg border border-brand-500 px-4 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-brand-400 dark:text-brand-300 dark:hover:bg-brand-900/30"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                        <span>
                          {{ bioLoading ? 'Authenticating…' : 'Use Biometric Login' }}
                          <span v-if="!isWebAuthnSupported" class="text-xs text-amber-600 block">Not supported on this browser</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
                <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Don't have an account?
                    <router-link
                      to="/signup"
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >Sign Up</router-link
                    >
                  </p>
                </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import api from '@/utils/axios'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)
const isLoading = ref(false)
const validationErrors = ref<any>({})
const isWebAuthnSupported = computed(() => !!(window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function'))
const bioLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const strToBuffer = (str: string) =>
  Uint8Array.from(window.atob(str.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
const bufferToBase64Url = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const handleBiometricLogin = async () => {
  if (!email.value) {
    toast.error('Enter your email to use biometric login.')
    return
  }
  if (!isWebAuthnSupported.value) {
    toast.error('Biometric/Passkey not supported in this browser.')
    return
  }
  bioLoading.value = true
  validationErrors.value = {}
  try {
    const { data: options } = await api.post('/webauthn/auth/options', { email: email.value })
    const publicKey: any = {
      ...options,
      challenge: strToBuffer(options.challenge),
      allowCredentials: (options.allowCredentials || []).map((cred: any) => ({
        ...cred,
        id: strToBuffer(cred.id),
      })),
    }

    const assertion = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential
    if (!assertion) throw new Error('Biometric authentication cancelled')

    const authRes = assertion.response as AuthenticatorAssertionResponse
    const payload = {
      email: email.value,
      id: assertion.id,
      rawId: bufferToBase64Url(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: bufferToBase64Url(authRes.clientDataJSON),
        authenticatorData: bufferToBase64Url(authRes.authenticatorData),
        signature: bufferToBase64Url(authRes.signature),
        userHandle: authRes.userHandle ? bufferToBase64Url(authRes.userHandle) : null,
      },
    }

    const verifyRes = await api.post('/webauthn/auth/verify', payload)
    const token = verifyRes.data.access_token || verifyRes.data.token
    if (!token) throw new Error('No token returned from server')

    authStore.token = token
    authStore.user = verifyRes.data.user
    authStore.isAuthenticated = true
    localStorage.setItem('token', token)
    toast.success('Logged in with biometrics')
    router.push('/crm')
    authStore.fetchUser().catch(() => {})
  } catch (error: any) {
    if (error?.response?.status === 404) {
      toast.error(error?.response?.data?.message || 'No biometric credential found. Please sign in with password and register.')
    } else {
      toast.error(error?.response?.data?.message || error?.message || 'Biometric login failed')
    }
  } finally {
    bioLoading.value = false
  }
}

const handleSubmit = async () => {
  validationErrors.value = {}
  isLoading.value = true

  try {
    const response = await authStore.login({
      email: email.value,
      password: password.value,
      remember: keepLoggedIn.value,
    })

    if (response.data.requires_2fa) {
      localStorage.setItem('pending_2fa_email', email.value)
      toast.info('Please verify your 2FA code')
      router.push('/verify-2fa')
      return
    }

    toast.success('Login successful! Redirecting...')

    setTimeout(() => {
      router.push('/crm')
      authStore.fetchUser().catch((err) => {
        console.error('Error fetching user data:', err)
      })
    }, 500)
  } catch (error: any) {
    console.error('Login failed', error)

    if (error.response?.status === 422 && error.response?.data?.errors) {
      validationErrors.value = error.response.data.errors
      toast.error('Please fix the validation errors below.')
    } else if (error.response?.status === 401) {
      toast.error('Invalid email or password. Please try again.')
    } else if (error.response?.status === 403 && error.response?.data?.message?.includes('pending')) {
      toast.error('Your account is pending approval. Please contact the administrator.')
    } else if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'Your account is not active. Please contact the administrator.')
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      toast.error('Unable to connect to the server. Please make sure the Laravel backend is running.')
    } else if (error.code === 'ERR_CONNECTION_REFUSED') {
      toast.error('Connection refused. Please start the Laravel backend server.')
    } else {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
