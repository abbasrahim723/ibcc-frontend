<template>
  <div>
    <div class="relative group">
      <div class="h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
        <img
          :src="currentPhotoUrl"
          alt="User Profile"
          class="h-full w-full object-cover"
        />
      </div>
      <button
        @click="isOpen = true"
        class="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600 focus:outline-none shadow-md transition-transform hover:scale-110"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>

    <Modal v-if="isOpen" @close="closeModal">
      <template #body>
        <div class="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
          <button
            @click="closeModal"
            class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Update Profile Photo
          </h3>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Upload a custom photo or choose from our default avatars.
          </p>

          <div class="mb-6 flex justify-center">
            <div class="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-inner">
              <img
                :src="previewUrl || currentPhotoUrl"
                class="h-full w-full object-cover"
                alt="Preview"
              />
            </div>
          </div>

          <!-- Tabs -->
          <div class="mb-6 flex border-b border-gray-200 dark:border-gray-700">
            <button
              @click="activeTab = 'upload'"
              :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'upload'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Upload Photo
            </button>
            <button
              @click="activeTab = 'default'"
              :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'default'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Default Avatars
            </button>
          </div>

          <!-- Upload Tab -->
          <div v-if="activeTab === 'upload'" class="space-y-4">
            <div
              class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 dark:border-gray-700 dark:bg-gray-800/50"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div class="text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer rounded-md font-medium text-brand-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:text-brand-500 dark:text-brand-400"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleFileSelect"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 2MB
                </p>
              </div>
            </div>
          </div>

          <!-- Default Avatars Tab -->
          <div v-else class="grid grid-cols-4 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
            <button
              v-for="avatar in defaultAvatars"
              :key="avatar"
              @click="selectDefaultAvatar(avatar)"
              :class="[
                'relative rounded-full overflow-hidden border-2 transition-all hover:scale-105',
                selectedAvatar === avatar
                  ? 'border-brand-500 ring-2 ring-brand-500/30'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <img
                :src="`/images/avatars/${avatar}`"
                :alt="avatar"
                class="h-full w-full object-cover"
              />
              <div
                v-if="selectedAvatar === avatar"
                class="absolute inset-0 flex items-center justify-center bg-black/20"
              >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex justify-end gap-3">
            <button
              @click="removePhoto"
              type="button"
              class="mr-auto text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove Photo
            </button>
            <button
              @click="closeModal"
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Cancel
            </button>
            <button
              @click="savePhoto"
              :disabled="isLoading || (!selectedFile && !selectedAvatar)"
              class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Saving...' : 'Save Photo' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Modal from '@/components/profile/Modal.vue'
import api from '@/utils/axios'

const authStore = useAuthStore()
const toast = useToast()

const isOpen = ref(false)
const isLoading = ref(false)
const activeTab = ref('upload')
const defaultAvatars = ref<string[]>([])
const selectedAvatar = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')

const currentPhotoUrl = computed(() => authStore.user?.profile_photo_url || '/images/user/owner.jpg')

onMounted(async () => {
  try {
    const response = await api.get('/avatars/defaults')
    defaultAvatars.value = response.data.avatars
  } catch (error) {
    console.error('Failed to fetch default avatars', error)
  }
})

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  selectedFile.value = null
  selectedAvatar.value = ''
  previewUrl.value = ''
  activeTab.value = 'upload'
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Please upload an image file')
    return
  }
  
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image size should be less than 2MB')
    return
  }

  selectedFile.value = file
  selectedAvatar.value = ''
  previewUrl.value = URL.createObjectURL(file)
}

const selectDefaultAvatar = (avatar: string) => {
  selectedAvatar.value = avatar
  selectedFile.value = null
  previewUrl.value = `/images/avatars/${avatar}`
}

const savePhoto = async () => {
  isLoading.value = true
  try {
    if (activeTab.value === 'upload' && selectedFile.value) {
      const formData = new FormData()
      formData.append('photo', selectedFile.value)
      await api.post('/profile/avatar/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else if (activeTab.value === 'default' && selectedAvatar.value) {
      await api.post('/profile/avatar/default', { avatar: selectedAvatar.value })
    }

    await authStore.fetchUser()
    toast.success('Profile photo updated successfully')
    closeModal()
  } catch (error: any) {
    console.error('Error updating photo', error)
    toast.error(error.response?.data?.message || 'Failed to update profile photo')
  } finally {
    isLoading.value = false
  }
}

const removePhoto = async () => {
  if (!confirm('Are you sure you want to remove your profile photo?')) return

  isLoading.value = true
  try {
    await api.delete('/profile/avatar')
    await authStore.fetchUser()
    toast.success('Profile photo removed')
    closeModal()
  } catch (error: any) {
    toast.error('Failed to remove photo')
  } finally {
    isLoading.value = false
  }
}
</script>
