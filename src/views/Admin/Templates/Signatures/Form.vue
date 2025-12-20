<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <!-- Loading Skeleton -->
    <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="space-y-6">
        <!-- Type Selection Tabs Skeleton -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <div class="-mb-px flex space-x-8">
            <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Content Area Skeleton -->
        <div class="mt-4 space-y-4">
          <!-- Label Skeleton -->
          <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

          <!-- Large Content Area (for signature pad, upload, or font selection) -->
          <div class="h-64 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>

          <!-- Additional Content (font grid or preview) -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="n in 9" :key="n" class="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <!-- Preview Section -->
          <div class="h-32 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Common Fields Skeleton -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
            <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="flex justify-end gap-4">
          <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- Actual Form -->
    <div v-else class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <form @submit.prevent="saveSignature" class="space-y-6">

        <!-- Type Selection Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="type in signatureTypes"
              :key="type.value"
              type="button"
              @click="currentType = type.value"
              :class="[
                currentType === type.value
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              ]"
            >
              {{ type.label }}
            </button>
          </nav>
        </div>

        <!-- Drawn Signature -->
        <div v-if="currentType === 'drawn'" class="mt-4">
          <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Draw your signature</label>
          <div class="border rounded-lg border-gray-300 dark:border-gray-600 p-2 bg-white">
            <VueSignaturePad
              ref="signaturePad"
              width="100%"
              height="300px"
              :options="{ penColor: '#000000', backgroundColor: '#ffffff' }"
              class="border border-dashed border-gray-200 rounded"
            />
          </div>
          <div class="mt-2 flex justify-end">
            <button type="button" @click="clearPad" class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Clear</button>
          </div>
        </div>

        <!-- Uploaded Signature -->
        <div v-if="currentType === 'uploaded'" class="mt-4">
          <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Upload signature image</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <p class="mt-1 text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB).</p>

          <div v-if="previewUrl" class="mt-4">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
            <img :src="previewUrl" class="max-h-40 rounded border border-gray-200 p-1" />
          </div>
        </div>

        <!-- Typed Signature -->
        <div v-if="currentType === 'typed'" class="mt-4 space-y-4">
          <div>
            <label for="typedName" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Type your name</label>
            <input
              v-model="typedName"
              type="text"
              id="typedName"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              :placeholder="userFullName"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select Style</label>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="font in fonts"
                :key="font.value"
                @click="selectedFont = font.value"
                class="cursor-pointer rounded-lg border p-6 text-center transition-all hover:border-brand-500"
                :class="selectedFont === font.value ? 'border-brand-500 ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700'"
              >
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ font.label }}</div>
                <div
                  class="text-2xl"
                  :style="{ fontFamily: font.family }"
                >
                  {{ typedName || userFullName }}
                </div>
              </div>
            </div>
          </div>

          <!-- Live Preview -->
          <div v-if="typedName || userFullName" class="mt-6">
            <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Preview</label>
            <div class="border rounded-lg border-gray-300 dark:border-gray-600 p-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              <div
                class="text-4xl"
                :style="{ fontFamily: fonts.find(f => f.value === selectedFont)?.family }"
              >
                {{ typedName || userFullName }}
              </div>
            </div>
          </div>
        </div>

        <!-- Common Fields -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <input
              v-model="form.is_default"
              id="is_default"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-brand-600 focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-brand-600"
            />
            <label for="is_default" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Set as default signature</label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <router-link
            to="/admin/templates/signatures"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="isSaving"
            class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : (isEditing ? 'Update Signature' : 'Save Signature') }}
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueSignaturePad } from 'vue-signature-pad'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const isEditing = computed(() => route.params.id !== undefined)
const pageTitle = computed(() => isEditing.value ? 'Edit Signature' : 'Create Signature')
const isSaving = ref(false)
const pageLoading = ref(true)

// Get user's full name
const userFullName = computed(() => {
  if (authStore.user) {
    return authStore.user.name || `${authStore.user.first_name || ''} ${authStore.user.last_name || ''}`.trim() || 'Your Name'
  }
  return 'Your Name'
})

const signatureTypes = [
  { label: 'Draw', value: 'drawn' },
  { label: 'Upload', value: 'uploaded' },
  { label: 'Type', value: 'typed' }
]
const currentType = ref('drawn')

// Drawn
const signaturePad = ref<any>(null)
const clearPad = () => {
  signaturePad.value?.clearSignature()
}

// Uploaded
const uploadedFile = ref<File | null>(null)
const previewUrl = ref('')
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0]
    previewUrl.value = URL.createObjectURL(target.files[0])
  }
}

// Typed
const typedName = ref('')
const selectedFont = ref('dancing-script')
const fonts = [
  { value: 'dancing-script', label: 'Dancing Script', family: "'Dancing Script', cursive" },
  { value: 'pacifico', label: 'Pacifico', family: "'Pacifico', cursive" },
  { value: 'great-vibes', label: 'Great Vibes', family: "'Great Vibes', cursive" },
  { value: 'allura', label: 'Allura', family: "'Allura', cursive" },
  { value: 'sacramento', label: 'Sacramento', family: "'Sacramento', cursive" },
  { value: 'satisfy', label: 'Satisfy', family: "'Satisfy', cursive" },
  { value: 'cookie', label: 'Cookie', family: "'Cookie', cursive" },
  { value: 'alex-brush', label: 'Alex Brush', family: "'Alex Brush', cursive" },
  { value: 'pinyon-script', label: 'Pinyon Script', family: "'Pinyon Script', cursive" }
]

const form = ref({
  is_default: false,
  status: true
})

const fetchSignature = async (id: string) => {
  try {
    const response = await api.get(`/signatures/${id}`)
    const data = response.data
    form.value.is_default = data.is_default
    form.value.status = data.status
    currentType.value = data.signature_type

    if (data.signature_type === 'typed') {
      selectedFont.value = data.style || 'dancing-script'
    } else if (data.signature_type === 'uploaded') {
       previewUrl.value = data.signature_data.startsWith('data:')
        ? data.signature_data
        : `http://ibcc-both.test/ibcc-app/public/storage/${data.signature_data}`
    }
  } catch (error) {
    toast.error('Error fetching signature details')
    router.push('/admin/templates/signatures')
  }
}

const saveSignature = async () => {
  const formData = new FormData()
  formData.append('owner_type', 'App\\Models\\User')
  formData.append('owner_id', '1')

  formData.append('signature_type', currentType.value)
  formData.append('status', form.value.status ? '1' : '0')
  formData.append('is_default', form.value.is_default ? '1' : '0')

  if (currentType.value === 'drawn') {
    const { isEmpty, data } = signaturePad.value.saveSignature()
    if (isEmpty) {
      toast.error('Please draw your signature')
      return
    }
    formData.append('signature_data', data)
  } else if (currentType.value === 'uploaded') {
    if (uploadedFile.value) {
      formData.append('signature_data', uploadedFile.value)
    } else if (!isEditing.value) {
      toast.error('Please upload an image')
      return
    }
  } else if (currentType.value === 'typed') {
    const nameToUse = typedName.value || userFullName.value
    if (!nameToUse || nameToUse === 'Your Name') {
      toast.error('Please type your name')
      return
    }
    // Convert typed text to image (canvas)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
        canvas.width = 600
        canvas.height = 200
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const selectedFontFamily = fonts.find(f => f.value === selectedFont.value)?.family || 'cursive'
        ctx.font = `64px ${selectedFontFamily}`
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(nameToUse, 300, 100)
        formData.append('signature_data', canvas.toDataURL())
        formData.append('style', selectedFont.value)
    }
  }

  isSaving.value = true
  try {
    if (isEditing.value) {
      formData.append('_method', 'PUT')
      await api.post(`/signatures/${route.params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Signature updated successfully')
    } else {
      await api.post('/signatures', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Signature created successfully')
    }
    router.push('/admin/templates/signatures')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving signature')
  } finally {
    isSaving.value = false
  }
}

const loadData = async () => {
  try {
    pageLoading.value = true

    // Ensure user is loaded
    if (!authStore.user) {
      await authStore.fetchUser()
    }

    if (isEditing.value) {
      await fetchSignature(route.params.id as string)
    }
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Pacifico&family=Great+Vibes&family=Allura&family=Sacramento&family=Satisfy&family=Cookie&family=Alex+Brush&family=Pinyon+Script&display=swap');
</style>
