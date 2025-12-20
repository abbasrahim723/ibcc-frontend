<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-6">
        <!-- Header Skeleton -->
        <div class="mb-6">
          <div class="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Profile Photo Skeleton -->
        <div class="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div class="h-24 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex-1">
            <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
            <div class="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Basic Information Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <div class="sm:col-span-2">
              <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="sm:col-span-5">
              <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="sm:col-span-5">
              <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <!-- Contact Information Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
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

        <!-- Address Information Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
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
            <div>
              <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <!-- Documents Skeleton -->
        <div class="space-y-4">
          <div class="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div class="text-center">
                <div class="h-12 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mx-auto mb-4"></div>
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mx-auto mb-2"></div>
                <div class="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mx-auto"></div>
              </div>
            </div>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div class="text-center">
                <div class="h-12 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mx-auto mb-4"></div>
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mx-auto mb-2"></div>
                <div class="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button Skeleton -->
        <div class="flex justify-end pt-6 border-t dark:border-gray-700">
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Actual Form -->
      <div v-else>

      <form @submit.prevent="saveCustomer" class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Basic Information</h4>

          <!-- Profile Photo Upload -->
          <div class="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div class="relative">
              <div class="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                <img
                  v-if="photoPreview || customerForm.profile_photo_url"
                  :src="photoPreview || customerForm.profile_photo_url"
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

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <!-- Name Prefix -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prefix</label>
              <select
                v-model="customerForm.name_prefix"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">None</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
                <option value="Engr">Engr</option>
                <option value="Col">Col</option>
                <option value="Major">Major</option>
              </select>
            </div>

            <!-- Name -->
            <div class="sm:col-span-5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="customerForm.name"
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

            <!-- Email -->
            <div class="sm:col-span-5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                v-model="customerForm.email"
                type="email"
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
            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select
                v-model="customerForm.gender"
                :class="[
                  'w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-1',
                  validationErrors.gender
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700',
                  'dark:bg-gray-800 dark:text-white'
                ]"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <p v-if="validationErrors.gender" class="mt-1 text-xs text-red-600">{{ validationErrors.gender }}</p>
            </div>

            <!-- CNIC Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNIC Number</label>
              <CnicInput
                v-model="customerForm.cnic_number"
                :has-error="!!validationErrors.cnic_number"
                :error-message="validationErrors.cnic_number"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Address Information</h4>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Country hidden (always Pakistan) -->
            <input type="hidden" v-model="customerForm.country_id" />

            <!-- State -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
              <select
                v-model="customerForm.state_id"
                @change="handleStateChange"
                :disabled="!customerForm.country_id"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900"
              >
                <option value="">Select State</option>
                <option v-for="state in states" :key="state.id" :value="state.id">
                  {{ state.name }}
                </option>
              </select>
            </div>

            <!-- City -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <select
                v-model="customerForm.city_id"
                @change="handleCityChange"
                :disabled="!customerForm.state_id"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900"
              >
                <option value="">Select City</option>
                <option v-for="city in cities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
            </div>

            <!-- Town -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Town</label>
              <select
                v-model="customerForm.town_id"
                @change="handleTownChange"
                :disabled="!customerForm.city_id"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900"
              >
                <option value="">Select Town</option>
                <option v-for="town in towns" :key="town.id" :value="town.id">
                  {{ town.name }}
                </option>
              </select>
            </div>

            <!-- Phase / Sector -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phase / Sector</label>
              <div class="relative">
                <select
                  v-model="customerForm.phase_id"
                  :disabled="!customerForm.town_id || loadingPhases"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900"
                >
                  <option value="">Select Phase</option>
                  <option v-for="phase in phases" :key="phase.id" :value="phase.id">
                    {{ phase.name }}
                  </option>
                </select>
                <LoadingSpinner v-if="loadingPhases" size="sm" class="absolute right-8 top-2.5" />
              </div>
            </div>

            <!-- Street Address -->
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
              <input
                v-model="customerForm.street_address"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- House Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">House Number</label>
              <input
                v-model="customerForm.house_number"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Zip Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip Code</label>
              <input
                v-model="customerForm.zip_code"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Document Uploads -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Documents (Optional)</h4>

          <!-- CNIC Documents -->
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-4">CNIC Documents</h5>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DocumentUploader
                v-model="customerForm.cnic_front"
                title="CNIC Front Side"
                accept="image/*"
                accept-text="PNG, JPG up to 10MB"
                :multiple="false"
                :max-files="1"
                :allow-camera="true"
                :existing-documents="customerForm.existing_cnic_front"
                @unlink="handleUnlinkDocument"
              />
              <DocumentUploader
                v-model="customerForm.cnic_back"
                title="CNIC Back Side"
                accept="image/*"
                accept-text="PNG, JPG up to 10MB"
                :multiple="false"
                :max-files="1"
                :allow-camera="true"
                :existing-documents="customerForm.existing_cnic_back"
                @unlink="handleUnlinkDocument"
              />
            </div>
          </div>

          <!-- Other Documents -->
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <DocumentUploader
              v-model="customerForm.other_documents"
              title="Other Documents"
              accept="image/*,application/pdf,.doc,.docx"
              accept-text="PNG, JPG, PDF, DOC up to 10MB each"
              :multiple="true"
              :max-files="10"
              :allow-camera="true"
              :existing-documents="customerForm.existing_other_documents"
              @unlink="handleUnlinkDocument"
            />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Contact Information</h4>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Primary)</label>
              <PhoneInputPK
                v-model="customerForm.phone_primary"
                placeholder="3001234567"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Secondary)</label>
              <PhoneInputPK
                v-model="customerForm.phone_secondary"
                placeholder="3001234567"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Number</label>
              <PhoneInputPK
                v-model="customerForm.whatsapp_number"
                placeholder="3001234567"
              />
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="space-y-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Status</h4>

          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="customerForm.is_active"
              class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <label class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
              <span class="ml-1 text-xs text-gray-500">(Customer is active in the system)</span>
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
            {{ loading ? 'Saving...' : (isEditMode ? (type === 'labour' ? 'Update Labour' : (type === 'supplier' ? 'Update Supplier' : 'Update Customer')) : (type === 'labour' ? 'Create Labour' : (type === 'supplier' ? 'Create Supplier' : 'Create Customer'))) }}
          </button>
        </div>
      </form>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PhoneInputPK from '@/components/common/PhoneInputPK.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CnicInput from '@/components/common/CnicInput.vue'
import DocumentUploader from '@/components/common/DocumentUploader.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const customerId = computed(() => route.params.id as string)
const isEditMode = computed(() => !!customerId.value)
const type = computed(() => (route.meta.type as string) || 'customer')
const pageTitle = computed(() => isEditMode.value ? (type.value === 'labour' ? 'Edit Labour' : (type.value === 'supplier' ? 'Edit Supplier' : 'Edit Customer')) : (type.value === 'labour' ? 'Create Labour' : (type.value === 'supplier' ? 'Create Supplier' : 'Create Customer')))

const loading = ref(false)
const checkingEmail = ref(false)
const originalEmail = ref('')
const validationErrors = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)

// Location Data
const countries = ref<any[]>([])
const states = ref<any[]>([])
const cities = ref<any[]>([])
const towns = ref<any[]>([])
const phases = ref<any[]>([])
const prefixes = ref<any[]>([])

const loadingPrefixes = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingTowns = ref(false)
const loadingPhases = ref(false)

const customerForm = ref({
  type: 'customer',
  name_prefix: '',
  name: '',
  email: '',
  gender: '',
  phone_primary: '',
  phone_secondary: '',
  whatsapp_number: '',
  cnic_number: '',
  address: '', // Keeping for backward compatibility or full address string
  street_address: '',
  house_number: '',
  zip_code: '',
  country_id: 167 as number | '',
  state_id: '' as number | '',
  city_id: '' as number | '',
  town_id: '' as number | '',
  phase_id: '' as number | '',
  is_active: true,
  profile_photo: null as File | null,
  profile_photo_url: '',
  cnic_front: [] as any[],
  cnic_back: [] as any[],
  other_documents: [] as any[],
  existing_cnic_front: [] as any[],
  existing_cnic_back: [] as any[],
  existing_other_documents: [] as any[]
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

    customerForm.value.profile_photo = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Fetch Locations
const fetchCountries = async () => {
  try {
    const response = await api.get('/countries', { params: { active_only: true, all: true } })
    countries.value = response.data

    // Default country to Pakistan (id 167) if not set, and preload its states
    if (!customerForm.value.country_id) {
      customerForm.value.country_id = 167
    }
    fetchStates(Number(customerForm.value.country_id))
  } catch (error) {
    console.error('Error fetching countries', error)
  }
}

const fetchStates = async (countryId: number) => {
  try {
    const response = await api.get('/states', { params: { country_id: countryId, active_only: true, all: true } })
    states.value = response.data
  } catch (error) {
    console.error('Error fetching states', error)
  }
}

const fetchCities = async (stateId: number) => {
  try {
    const response = await api.get('/cities', { params: { state_id: stateId, active_only: true, all: true } })
    cities.value = response.data
  } catch (error) {
    console.error('Error fetching cities', error)
  }
}

const fetchTowns = async (cityId: number) => {
  loadingTowns.value = true
  try {
    const response = await api.get('/towns', { params: { city_id: cityId, active_only: true, all: true } })
    towns.value = response.data
  } catch (error) {
    console.error('Error fetching towns', error)
  } finally {
    loadingTowns.value = false
  }
}

const fetchPhases = async (townId: number) => {
  loadingPhases.value = true
  try {
    const response = await api.get('/phases', { params: { town_id: townId, active_only: true, all: true } })
    phases.value = response.data
  } catch (error) {
    console.error('Error fetching phases', error)
  } finally {
    loadingPhases.value = false
  }
}

// Handle Location Changes
const handleCountryChange = () => {
  customerForm.value.state_id = ''
  customerForm.value.city_id = ''
  customerForm.value.town_id = ''
  states.value = []
  cities.value = []
  towns.value = []

  if (customerForm.value.country_id) {
    fetchStates(Number(customerForm.value.country_id))
  }
}

const handleStateChange = () => {
  customerForm.value.city_id = ''
  customerForm.value.town_id = ''
  cities.value = []
  towns.value = []

  if (customerForm.value.state_id) {
    fetchCities(Number(customerForm.value.state_id))
  }
}

const handleCityChange = () => {
  customerForm.value.town_id = ''
  towns.value = []

  if (customerForm.value.city_id) {
    fetchTowns(Number(customerForm.value.city_id))
    // Auto-fill zip code if available in city
    const city = cities.value.find(c => c.id === Number(customerForm.value.city_id))
    if (city && city.zip_code) {
      customerForm.value.zip_code = city.zip_code
    }
  }
}

const handleTownChange = () => {
  customerForm.value.phase_id = ''
  phases.value = []

  if (customerForm.value.town_id) {
    fetchPhases(Number(customerForm.value.town_id))
    // Auto-fill zip code if available in town
    const town = towns.value.find(t => t.id === Number(customerForm.value.town_id))
    if (town && town.zip_code) {
      customerForm.value.zip_code = town.zip_code
    }
  }
}

// Email uniqueness check
const checkEmailUniqueness = async () => {
  const email = customerForm.value.email

  // Skip if email is empty or unchanged in edit mode
  if (!email || (isEditMode.value && email === originalEmail.value)) {
    validationErrors.value.email = ''
    return
  }

  try {
    checkingEmail.value = true
    validationErrors.value.email = ''

    // Check if email exists
    const response = await api.get('/customers', {
      params: { search: email }
    })

    // Check if any customer has this exact email (excluding current customer in edit mode)
    const existingCustomer = response.data.data?.find((customer: any) =>
      customer.email && customer.email.toLowerCase() === email.toLowerCase() &&
      (!isEditMode.value || customer.id !== parseInt(customerId.value))
    )

    if (existingCustomer) {
      validationErrors.value.email = 'This email is already registered'
    }
  } catch (error: any) {
    // Ignore errors during email check
    console.error('Email check error:', error)
  } finally {
    checkingEmail.value = false
  }
}

const mapDocument = (doc: any) => ({
  id: doc.id,
  name: doc.name,
  size: doc.file_size,
  type: doc.mime_type,
  url: `/storage/${doc.file_path}`
})

const handleUnlinkDocument = async (documentId: number) => {
  if (!confirm('Are you sure you want to unlink this document?')) return
  try {
    await api.delete(`/customers/${customerId.value}/documents/${documentId}`)
    toast.success('Document unlinked successfully')
    await fetchCustomer()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error unlinking document')
  }
}

const fetchCustomer = async () => {
  if (!isEditMode.value) return

  try {
    loading.value = true
    const response = await api.get(`/customers/${customerId.value}/details`)
    const customer = response.data.customer

    originalEmail.value = customer.email

    customerForm.value = {
      type: customer.type || 'customer',
      name_prefix: customer.name_prefix || '',
      name: customer.name,
      email: customer.email || '',
      gender: customer.gender || '',
      phone_primary: customer.phone_primary || '',
      phone_secondary: customer.phone_secondary || '',
      whatsapp_number: customer.whatsapp_number || '',
      cnic_number: customer.cnic_number || '',
      address: customer.address || '',
      street_address: customer.street_address || '',
      house_number: customer.house_number || '',
      zip_code: customer.zip_code || '',
      country_id: customer.country_id || '',
      state_id: customer.state_id || '',
      city_id: customer.city_id || '',
      town_id: customer.town_id || '',
      phase_id: customer.phase_id || '',
      is_active: customer.is_active !== undefined ? Boolean(customer.is_active) : true,
      profile_photo: null,
      profile_photo_url: customer.profile_photo_url || '',
      cnic_front: [],
      cnic_back: [],
      other_documents: [],
      existing_cnic_front: customer.documents?.filter((d: any) => d.document_category === 'CNIC Front').map(mapDocument) || [],
      existing_cnic_back: customer.documents?.filter((d: any) => d.document_category === 'CNIC Back').map(mapDocument) || [],
      existing_other_documents: customer.documents?.filter((d: any) => d.document_category === 'Other').map(mapDocument) || []
    }

    // Load cascading data
    if (customer.country_id) await fetchStates(customer.country_id)
    if (customer.state_id) await fetchCities(customer.state_id)
    if (customer.city_id) await fetchTowns(customer.city_id)
    if (customer.town_id) await fetchPhases(customer.town_id)

  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching customer')
    router.push(type.value === 'labour' ? '/labours' : (type.value === 'supplier' ? '/suppliers' : '/customers'))
  } finally {
    loading.value = false
  }
}

const saveCustomer = async () => {
  // Clear previous validation errors
  validationErrors.value = {}

  // Check for email validation errors
  if (validationErrors.value.email) {
    toast.error('Please fix validation errors before submitting')
    return
  }

  try {
    loading.value = true

    // Create FormData object for file upload
    const formData = new FormData()
    formData.append('type', isEditMode.value ? customerForm.value.type : type.value)
    formData.append('name', customerForm.value.name)
    if (customerForm.value.name_prefix) formData.append('name_prefix', customerForm.value.name_prefix)

    if (customerForm.value.email) formData.append('email', customerForm.value.email)
    if (customerForm.value.gender) formData.append('gender', customerForm.value.gender)
    if (customerForm.value.phone_primary) formData.append('phone_primary', customerForm.value.phone_primary)
    if (customerForm.value.phone_secondary) formData.append('phone_secondary', customerForm.value.phone_secondary)
    if (customerForm.value.whatsapp_number) formData.append('whatsapp_number', customerForm.value.whatsapp_number)
    if (customerForm.value.cnic_number) formData.append('cnic_number', customerForm.value.cnic_number)

    // Address fields
    if (customerForm.value.street_address) formData.append('street_address', customerForm.value.street_address)
    if (customerForm.value.house_number) formData.append('house_number', customerForm.value.house_number)
    if (customerForm.value.zip_code) formData.append('zip_code', customerForm.value.zip_code)
    if (customerForm.value.country_id) formData.append('country_id', String(customerForm.value.country_id))
    if (customerForm.value.state_id) formData.append('state_id', String(customerForm.value.state_id))
    if (customerForm.value.city_id) formData.append('city_id', String(customerForm.value.city_id))
    if (customerForm.value.town_id) formData.append('town_id', String(customerForm.value.town_id))
    if (customerForm.value.phase_id) formData.append('phase_id', String(customerForm.value.phase_id))

    // Construct full address for backward compatibility
    const fullAddress = [
      customerForm.value.house_number,
      customerForm.value.street_address,
      towns.value.find(t => t.id === customerForm.value.town_id)?.name,
      cities.value.find(c => c.id === customerForm.value.city_id)?.name,
      states.value.find(s => s.id === customerForm.value.state_id)?.name,
      countries.value.find(c => c.id === customerForm.value.country_id)?.name,
      customerForm.value.zip_code
    ].filter(Boolean).join(', ')

    formData.append('address', fullAddress)

    formData.append('is_active', customerForm.value.is_active ? '1' : '0')

    // Handle profile photo
    if (customerForm.value.profile_photo) {
      formData.append('profile_photo', customerForm.value.profile_photo)
    }

    // Handle Documents
    if (customerForm.value.cnic_front && customerForm.value.cnic_front.length > 0) {
      formData.append('cnic_front', customerForm.value.cnic_front[0].file)
    }
    if (customerForm.value.cnic_back && customerForm.value.cnic_back.length > 0) {
      formData.append('cnic_back', customerForm.value.cnic_back[0].file)
    }
    if (customerForm.value.other_documents && customerForm.value.other_documents.length > 0) {
      customerForm.value.other_documents.forEach((doc: any) => {
        formData.append('other_documents[]', doc.file)
      })
    }

    if (isEditMode.value) {
      // For PUT requests with files, we need to use POST with _method=PUT
      formData.append('_method', 'PUT')
      const response = await api.post(`/customers/${customerId.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(response.data.message)
    } else {
      const response = await api.post('/customers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success(response.data.message)
    }

    const targetRoute = type.value === 'labour' ? '/labours' : (type.value === 'supplier' ? '/suppliers' : '/customers')
    router.push(targetRoute)
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
      toast.error(error.response?.data?.message || 'Error saving customer')
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  const targetRoute = type.value === 'labour' ? '/labours' : (type.value === 'supplier' ? '/suppliers' : '/customers')
  router.push(targetRoute)
}

onMounted(async () => {
  await fetchCountries()
  await fetchCustomer()
})
</script>
