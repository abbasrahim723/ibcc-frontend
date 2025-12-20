<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <!-- Loading Skeleton -->
    <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <!-- Header Skeleton -->
      <div class="mb-6">
        <div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
        <div class="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div class="space-y-6">
        <!-- Basic Information Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

          <!-- Profile Photo Upload Skeleton -->
          <div class="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div class="relative">
              <div class="h-24 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div class="absolute bottom-0 right-0 h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex-1 text-center sm:text-left">
              <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <!-- Name and Email Fields -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <!-- First and Last Name Fields -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
            <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-3 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mt-1"></div>
            <!-- Password Strength Indicator -->
            <div class="mt-2">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <!-- Professional Information Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

          <div>
            <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
            <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <div>
            <div class="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
            <div class="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Roles & Permissions Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-3">
              <div v-for="n in 3" :key="n" class="flex items-start">
                <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mt-1 mr-3"></div>
                <div class="flex-1">
                  <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                  <div class="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

          <div class="flex items-center">
            <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
            <div class="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Form Actions Skeleton -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- Actual Form -->
    <div v-else class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit User' : 'Create New User' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ isEditMode ? 'Update user information and role assignments' : 'Add a new user to the system' }}
        </p>
      </div>

      <form @submit.prevent="saveUser" class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Basic Information</h4>

          <!-- Profile Photo Upload -->
          <div class="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div class="relative">
              <div class="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                <img
                  v-if="photoPreview || userForm.profile_photo_url"
                  :src="photoPreview || userForm.profile_photo_url"
                  alt="Profile preview"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                @click="triggerFileInput"
                class="absolute bottom-0 right-0 rounded-full bg-brand-600 p-1.5 text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
            </div>
            <div class="flex-1 text-center sm:text-left">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</h5>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.name"
                type="text"
                required
                :class="[
                  'w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1',
                  validationErrors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700',
                  'dark:bg-gray-800 dark:text-white'
                ]"
              />
              <p v-if="validationErrors.name" class="mt-1 text-xs text-red-600">{{ validationErrors.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.email"
                type="email"
                required
                @blur="checkEmailUniqueness"
                :class="[
                  'w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1',
                  validationErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700',
                  'dark:bg-gray-800 dark:text-white'
                ]"
              />
              <p v-if="validationErrors.email" class="mt-1 text-xs text-red-600">{{ validationErrors.email }}</p>
              <p v-if="checkingEmail" class="mt-1 text-xs text-gray-500">Checking email availability...</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                v-model="userForm.first_name"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                v-model="userForm.last_name"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password {{ isEditMode ? '' : '*' }}
            </label>
            <input
              v-model="userForm.password"
              type="password"
              :required="!isEditMode"
              minlength="8"
              @input="validatePassword"
              :class="[
                'w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1',
                validationErrors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700',
                'dark:bg-gray-800 dark:text-white'
              ]"
            />
            <p v-if="isEditMode && !userForm.password" class="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
            <p v-if="!isEditMode || userForm.password" class="mt-1 text-xs text-gray-500">
              Must be at least 8 characters long and include uppercase, lowercase, number, and special character
            </p>
            <p v-if="validationErrors.password" class="mt-1 text-xs text-red-600">{{ validationErrors.password }}</p>

            <!-- Password Strength Indicator -->
            <div v-if="userForm.password && passwordStrength" class="mt-2">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                  <div
                    :class="[
                      'h-full transition-all duration-300',
                      passwordStrength.score === 1 ? 'w-1/4 bg-red-500' : '',
                      passwordStrength.score === 2 ? 'w-2/4 bg-orange-500' : '',
                      passwordStrength.score === 3 ? 'w-3/4 bg-yellow-500' : '',
                      passwordStrength.score === 4 ? 'w-full bg-green-500' : ''
                    ]"
                  ></div>
                </div>
                <span
                  :class="[
                    'text-xs font-medium',
                    passwordStrength.score === 1 ? 'text-red-600' : '',
                    passwordStrength.score === 2 ? 'text-orange-600' : '',
                    passwordStrength.score === 3 ? 'text-yellow-600' : '',
                    passwordStrength.score === 4 ? 'text-green-600' : ''
                  ]"
                >
                  {{ passwordStrength.label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Contact Information</h4>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                v-model="userForm.phone"
                type="tel"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                v-model="userForm.location"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Professional Information -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Professional Information</h4>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
            <input
              v-model="userForm.job_title"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              v-model="userForm.bio"
              rows="4"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>
        </div>

        <!-- Roles & Permissions -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Roles & Permissions</h4>

          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div class="space-y-3">
              <label v-for="role in availableRoles" :key="role.id" class="flex items-start">
                <input
                  type="checkbox"
                  :value="role.name"
                  v-model="userForm.roles"
                  class="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <div class="ml-3">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ role.name }}</span>
                  <p v-if="role.permissions && role.permissions.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ role.permissions.length }} permission(s)
                  </p>
                </div>
              </label>
              <p v-if="!availableRoles || availableRoles.length === 0" class="text-sm text-gray-500 italic">
                No roles available
              </p>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Status</h4>

          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="userForm.is_active"
              class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <label class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
              <span class="ml-1 text-xs text-gray-500">(User can log in and access the system)</span>
            </label>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="goBack"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:opacity-50 dark:focus:ring-brand-800"
          >
            {{ loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User') }}
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

const route = useRoute()
const router = useRouter()
const toast = useToast()

const userId = computed(() => route.params.id as string)
const isEditMode = computed(() => !!userId.value)
const pageTitle = computed(() => isEditMode.value ? 'Edit User' : 'Create User')

const loading = ref(false)
const checkingEmail = ref(false)
const availableRoles = ref<any[]>([])
const originalEmail = ref('')
const validationErrors = ref<Record<string, string>>({})
const passwordStrength = ref<{score: number, label: string} | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)
const pageLoading = ref(true)

const userForm = ref({
  name: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  job_title: '',
  location: '',
  bio: '',
  is_active: true,
  roles: [],
  profile_photo: null as File | null,
  profile_photo_url: ''
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB')
      return
    }

    userForm.value.profile_photo = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Password strength validation
const validatePassword = () => {
  const password = userForm.value.password

  if (!password) {
    passwordStrength.value = null
    validationErrors.value.password = ''
    return
  }

  // Check password requirements
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const isLongEnough = password.length >= 8

  let score = 0
  if (isLongEnough) score++
  if (hasUpperCase) score++
  if (hasLowerCase) score++
  if (hasNumber) score++
  if (hasSpecialChar) score++

  // Map score to strength
  if (score <= 2) {
    passwordStrength.value = { score: 1, label: 'Weak' }
  } else if (score === 3) {
    passwordStrength.value = { score: 2, label: 'Fair' }
  } else if (score === 4) {
    passwordStrength.value = { score: 3, label: 'Good' }
  } else {
    passwordStrength.value = { score: 4, label: 'Strong' }
  }

  // Validate requirements
  if (!isLongEnough) {
    validationErrors.value.password = 'Password must be at least 8 characters long'
  } else if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    validationErrors.value.password = 'Password must include uppercase, lowercase, number, and special character'
  } else {
    validationErrors.value.password = ''
  }
}

// Email uniqueness check
const checkEmailUniqueness = async () => {
  const email = userForm.value.email

  // Skip if email is empty or unchanged in edit mode
  if (!email || (isEditMode.value && email === originalEmail.value)) {
    validationErrors.value.email = ''
    return
  }

  try {
    checkingEmail.value = true
    validationErrors.value.email = ''

    // Check if email exists
    const response = await api.get('/users', {
      params: { search: email }
    })

    // Check if any user has this exact email (excluding current user in edit mode)
    const existingUser = response.data.data?.find((user: any) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      (!isEditMode.value || user.id !== parseInt(userId.value))
    )

    if (existingUser) {
      validationErrors.value.email = 'This email is already registered'
    }
  } catch (error: any) {
    // Ignore errors during email check
    console.error('Email check error:', error)
  } finally {
    checkingEmail.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await api.get('/roles')
    availableRoles.value = response.data.filter((role: any) => role.is_active)
  } catch (error: any) {
    toast.error('Error fetching roles')
  }
}

const fetchUser = async () => {
  if (!isEditMode.value) return

  try {
    loading.value = true
    const response = await api.get(`/users/${userId.value}`)
    const user = response.data

    originalEmail.value = user.email

    userForm.value = {
      name: user.name,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email,
      password: '',
      phone: user.phone || '',
      job_title: user.job_title || '',
      location: user.location || '',
      bio: user.bio || '',
      is_active: user.is_active !== undefined ? Boolean(user.is_active) : true,
      roles: user.roles?.map((r: any) => r.name) || [],
      profile_photo: null,
      profile_photo_url: user.profile_photo_url || ''
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching user')
    router.push('/users')
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  // Clear previous validation errors
  validationErrors.value = {}

  // Validate password if provided
  if (userForm.value.password) {
    validatePassword()
    if (validationErrors.value.password) {
      toast.error('Please fix validation errors before submitting')
      return
    }
  }

  // Check for email validation errors
  if (validationErrors.value.email) {
    toast.error('Please fix validation errors before submitting')
    return
  }

  try {
    loading.value = true

    // Create FormData object for file upload
    const formData = new FormData()
    formData.append('name', userForm.value.name)
    formData.append('email', userForm.value.email)

    if (userForm.value.first_name) formData.append('first_name', userForm.value.first_name)
    if (userForm.value.last_name) formData.append('last_name', userForm.value.last_name)
    if (userForm.value.phone) formData.append('phone', userForm.value.phone)
    if (userForm.value.job_title) formData.append('job_title', userForm.value.job_title)
    if (userForm.value.location) formData.append('location', userForm.value.location)
    if (userForm.value.bio) formData.append('bio', userForm.value.bio)
    formData.append('is_active', userForm.value.is_active ? '1' : '0')

    // Handle roles array
    if (userForm.value.roles && userForm.value.roles.length > 0) {
      userForm.value.roles.forEach(role => {
        formData.append('roles[]', role)
      })
    }

    // Handle password
    if (userForm.value.password) {
      formData.append('password', userForm.value.password)
    }

    // Handle profile photo
    if (userForm.value.profile_photo) {
      formData.append('profile_photo', userForm.value.profile_photo)
    }

    if (isEditMode.value) {
      // For PUT requests with files, we need to use POST with _method=PUT
      formData.append('_method', 'PUT')
      const response = await api.post(`/users/${userId.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(response.data.message)
    } else {
      const response = await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(response.data.message)
    }

    router.push('/users')
  } catch (error: any) {
    // Handle validation errors from backend
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        validationErrors.value[key] = Array.isArray(backendErrors[key])
          ? backendErrors[key][0]
          : backendErrors[key]
      })
      toast.error('Please fix validation errors')
    } else {
      toast.error(error.response?.data?.message || 'Error saving user')
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/users')
}

const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/profile')
    const currentUser = response.data.user || response.data

    if (isEditMode.value && Number(currentUser.id) === Number(userId.value)) {
      toast.error('Please use the Profile page to edit your own account')
      router.push('/users')
    }
  } catch (error) {
    console.error('Error checking current user', error)
  }
}

const loadData = async () => {
  try {
    await Promise.all([
      fetchRoles(),
      fetchUser(),
      fetchCurrentUser()
    ])
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
