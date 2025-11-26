<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h5 class="text-sm font-medium text-gray-900 dark:text-white">{{ title }}</h5>
      <span v-if="maxFiles" class="text-xs text-gray-500">
        {{ documents.length }} / {{ maxFiles }} files
      </span>
    </div>

    <!-- Drag and Drop Area -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="[
        'relative rounded-lg border-2 border-dashed p-6 text-center transition-colors',
        isDragging
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'border-gray-300 dark:border-gray-700',
        documents.length >= (maxFiles || Infinity)
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:border-brand-400'
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :capture="allowCamera ? 'environment' : undefined"
        class="hidden"
        @change="handleFileSelect"
        :disabled="documents.length >= (maxFiles || Infinity)"
      />

      <div class="space-y-2">
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
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium text-brand-600 dark:text-brand-400">Click to upload</span>
          or drag and drop
        </div>
        <p class="text-xs text-gray-500">{{ acceptText }}</p>
      </div>
    </div>

    <!-- Document List -->
    <div v-if="documents.length > 0" class="space-y-2">
      <div
        v-for="(doc, index) in documents"
        :key="index"
        class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <!-- File Icon -->
          <div class="flex-shrink-0">
            <svg
              v-if="isImage(doc)"
              class="h-8 w-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <svg
              v-else
              class="h-8 w-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>

          <!-- File Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ doc.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatFileSize(doc.size) }}
            </p>
          </div>

          <!-- Preview for images -->
          <img
            v-if="isImage(doc) && doc.preview"
            :src="doc.preview"
            alt="Preview"
            class="h-12 w-12 rounded object-cover"
          />
        </div>

        <!-- Remove Button -->
        <button
          type="button"
          @click="removeDocument(index)"
          class="ml-3 flex-shrink-0 rounded-full p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DocumentFile {
  file: File
  name: string
  size: number
  type: string
  preview?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    accept?: string
    acceptText?: string
    multiple?: boolean
    maxFiles?: number
    allowCamera?: boolean
    modelValue?: DocumentFile[]
  }>(),
  {
    title: 'Upload Documents',
    accept: 'image/*,application/pdf,.doc,.docx',
    acceptText: 'PNG, JPG, PDF, DOC up to 10MB',
    multiple: true,
    allowCamera: true,
    modelValue: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: DocumentFile[]): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const documents = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const triggerFileInput = () => {
  if (documents.value.length >= (props.maxFiles || Infinity)) return
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
  // Reset input
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = async (files: File[]) => {
  const maxFiles = props.maxFiles || Infinity
  const remainingSlots = maxFiles - documents.value.length
  const filesToAdd = files.slice(0, remainingSlots)

  const newDocuments: DocumentFile[] = await Promise.all(
    filesToAdd.map(async (file) => {
      const doc: DocumentFile = {
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        doc.preview = await createImagePreview(file)
      }

      return doc
    })
  )

  documents.value = [...documents.value, ...newDocuments]
}

const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

const removeDocument = (index: number) => {
  documents.value = documents.value.filter((_, i) => i !== index)
}

const isImage = (doc: DocumentFile) => {
  return doc.type.startsWith('image/')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
