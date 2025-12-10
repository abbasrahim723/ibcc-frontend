<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="space-y-6">
      <!-- Email Change Section -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          Change Email Address
        </h3>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Update your email address. You'll need to verify with an OTP sent to your current email.
        </p>

        <form @submit.prevent="initiateEmailChange" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Current Email
            </label>
            <input
              type="email"
              :value="user?.email"
              disabled
              class="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
          </div>

          <div v-if="!emailOtpSent">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              New Email Address
            </label>
            <input
              v-model="newEmail"
              type="email"
              required
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div v-if="emailOtpSent">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Enter OTP sent to {{ user?.email }}
            </label>
            <OTPInput
              :countdown="emailOtp.countdown.value"
              :can-resend="emailOtp.canResend.value"
              :is-resending="emailOtp.isLoading.value"
              :error="emailOtpError"
              @update:error="emailOtpError = $event"
              @complete="verifyEmailOtp"
              @resend="resendEmailOtp"
            />
          </div>

          <div class="flex justify-end gap-3">
            <button
              v-if="emailOtpSent"
              @click="cancelEmailChange"
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </button>
            <button
              v-if="!emailOtpSent"
              type="submit"
              :disabled="emailOtp.isLoading.value || !newEmail"
              class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="emailOtp.isLoading.value" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ emailOtp.isLoading.value ? 'Sending OTP...' : 'Send Verification Code' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Password Change Section -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          Change Password
        </h3>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Update your password. You'll need to verify with an OTP sent to your email.
        </p>

        <form @submit.prevent="initiatePasswordChange" class="space-y-4">
          <div v-if="!passwordOtpSent">
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Current Password
                </label>
                <input
                  v-model="passwordForm.current_password"
                  type="password"
                  required
                  class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  New Password
                </label>
                <input
                  v-model="passwordForm.new_password"
                  type="password"
                  required
                  minlength="8"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Confirm New Password
                </label>
                <input
                  v-model="passwordForm.confirm_password"
                  type="password"
                  required
                  minlength="8"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
            </div>
          </div>

          <div v-if="passwordOtpSent">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Enter OTP sent to {{ user?.email }}
            </label>
            <OTPInput
              :countdown="passwordOtp.countdown.value"
              :can-resend="passwordOtp.canResend.value"
              :is-resending="passwordOtp.isLoading.value"
              :error="passwordOtpError"
              @update:error="passwordOtpError = $event"
              @complete="verifyPasswordOtp"
              @resend="resendPasswordOtp"
            />
          </div>

          <div class="flex justify-end gap-3">
            <button
              v-if="passwordOtpSent"
              @click="cancelPasswordChange"
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </button>
            <button
              v-if="!passwordOtpSent"
              type="submit"
              :disabled="passwordOtp.isLoading.value || !isPasswordFormValid"
              class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="passwordOtp.isLoading.value" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ passwordOtp.isLoading.value ? 'Sending OTP...' : 'Send Verification Code' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Biometric Authentication Section -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              Biometric Authentication
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Use fingerprint or face recognition to sign in
            </p>
            <p v-if="!isWebAuthnSupported" class="mt-1 text-xs text-amber-600">
              Biometrics not supported on this browser/device.
            </p>
          </div>
        </div>
        <button
          :disabled="bioLoading || !isWebAuthnSupported"
          @click="startPasskeyRegistration"
          class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          :class="{
            'opacity-60 cursor-not-allowed': bioLoading || !isWebAuthnSupported
          }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
          </svg>
          <span>{{ bioLoading ? 'Setting up…' : 'Setup Biometric Login' }}</span>
        </button>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useOTP } from '@/composables/useOTP'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import OTPInput from '@/components/ui/OTPInput.vue'
import api from '@/utils/axios'

const authStore = useAuthStore()
const toast = useToast()
const currentPageTitle = ref('Security Settings')

const user = computed(() => authStore.user)
const isWebAuthnSupported = computed(() => !!(window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function'))
const bioLoading = ref(false)

// Email Change
const emailOtp = useOTP()
const newEmail = ref('')
const emailOtpSent = ref(false)
const emailOtpError = ref(false)

const initiateEmailChange = async () => {
  if (!newEmail.value) return

  try {
    await emailOtp.sendOTP(user.value?.email || '', 'email_change')
    emailOtpSent.value = true
    emailOtpError.value = false
    toast.success('Verification code sent to your email')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to send verification code')
  }
}

const verifyEmailOtp = async (code: string) => {
  emailOtpError.value = false
  try {
    await emailOtp.verifyOTP(user.value?.email || '', code, 'email_change')
    
    // Update email
    await api.put('/profile/email', { email: newEmail.value })
    
    toast.success('Email updated successfully!')
    emailOtpSent.value = false
    newEmail.value = ''
    await authStore.fetchUser()
  } catch (error: any) {
    emailOtpError.value = true
    toast.error(error.response?.data?.message || 'Failed to verify OTP')
  }
}

const resendEmailOtp = async () => {
  emailOtpError.value = false
  await initiateEmailChange()
}

const cancelEmailChange = () => {
  emailOtpSent.value = false
  emailOtpError.value = false
  newEmail.value = ''
}

// Password Change
const passwordOtp = useOTP()
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
})
const passwordOtpSent = ref(false)
const passwordOtpError = ref(false)

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.current_password &&
    passwordForm.value.new_password &&
    passwordForm.value.confirm_password &&
    passwordForm.value.new_password === passwordForm.value.confirm_password &&
    passwordForm.value.new_password.length >= 8
  )
})

const initiatePasswordChange = async () => {
  if (!isPasswordFormValid.value) {
    toast.error('Please fill all fields correctly')
    return
  }

  try {
    await passwordOtp.sendOTP(user.value?.email || '', 'password_change')
    passwordOtpSent.value = true
    passwordOtpError.value = false
    toast.success('Verification code sent to your email')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to send verification code')
  }
}

const verifyPasswordOtp = async (code: string) => {
  passwordOtpError.value = false
  try {
    await passwordOtp.verifyOTP(user.value?.email || '', code, 'password_change')
    
    // Update password
    await api.put('/profile/password', {
      current_password: passwordForm.value.current_password,
      password: passwordForm.value.new_password,
      password_confirmation: passwordForm.value.confirm_password,
    })
    
    toast.success('Password updated successfully!')
    passwordOtpSent.value = false
    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    }
  } catch (error: any) {
    passwordOtpError.value = true
    toast.error(error.response?.data?.message || 'Failed to verify OTP')
  }
}

const resendPasswordOtp = async () => {
  passwordOtpError.value = false
  await initiatePasswordChange()
}

const cancelPasswordChange = () => {
  passwordOtpSent.value = false
  passwordOtpError.value = false
}

// WebAuthn helpers and setup
const strToBuffer = (str: string) => Uint8Array.from(window.atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
const bufferToBase64Url = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const startPasskeyRegistration = async () => {
  if (!isWebAuthnSupported.value) {
    toast.error('Biometric/Passkey not supported on this device.')
    return
  }
  bioLoading.value = true
  try {
    // 1) Get options from server
    const { data: options } = await api.post('/webauthn/register/options')
    const publicKey: any = {
      ...options,
      challenge: strToBuffer(options.challenge),
      user: {
        ...options.user,
        id: strToBuffer(options.user.id),
      },
      excludeCredentials: (options.excludeCredentials || []).map((cred: any) => ({
        ...cred,
        id: strToBuffer(cred.id),
      })),
    }

    // 2) Create credential
    const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential
    if (!credential) throw new Error('Credential creation was cancelled or failed')

    // 3) Send to server to verify/persist
    const attObj = credential.response as AuthenticatorAttestationResponse
    const payload = {
      id: credential.id,
      rawId: bufferToBase64Url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: bufferToBase64Url(attObj.clientDataJSON),
        attestationObject: bufferToBase64Url(attObj.attestationObject),
      },
    }

    await api.post('/webauthn/register/verify', payload)
    toast.success('Biometric login enabled on this device')
  } catch (err: any) {
    if (err?.response?.status === 404) {
      toast.error('Biometric API endpoints are not available on the server yet.')
    } else {
      const msg = err?.response?.data?.message || err?.message || 'Unable to setup biometric login'
      toast.error(msg)
    }
  } finally {
    bioLoading.value = false
  }
}

// 2FA
const twoFactorEnabled = ref(false)

const toggle2FA = async () => {
  // TODO: Implement 2FA toggle with OTP verification
  toast.info('Two-factor authentication coming soon!')
  twoFactorEnabled.value = !twoFactorEnabled.value
}
</script>
