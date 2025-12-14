<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex items-center justify-between">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Attach Documents</h3>
          <div class="flex items-center gap-3">
            <div v-if="targetVisual?.avatar" class="h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img :src="targetVisual.avatar" alt="" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-10 w-10 flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold uppercase">
              {{ targetVisual?.initials || '?' }}
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ targetVisual?.title || targetLabel }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ targetVisual?.subtitle || '' }}</div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
            <input
              v-model="form.documentable_type"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              readonly
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Record ID</label>
            <input
              v-model="form.documentable_id"
              type="number"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              readonly
            />
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <div class="relative">
              <select
                v-model="form.document_category"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select category</option>
                <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                  {{ opt.icon }} {{ opt.label }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
            <input
              v-model="form.description"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Short description"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Files</label>
          <div
            class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/30 p-6 text-center cursor-pointer"
            @click="selectFiles"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">Click to browse or drag and drop files</p>
            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="onFiles"
            />
          </div>

          <div v-if="files.length" class="mt-3 space-y-2">
            <div
              v-for="(file, idx) in files"
              :key="idx"
              class="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <img v-if="file.previewsAsImage" :src="file.previewUrl" alt="" class="h-full w-full object-cover" />
                <svg v-else class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7v10M17 7v10M3 7h18M3 17h18" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate font-medium text-gray-900 dark:text-white">{{ file.file.name }}</div>
                <div class="text-xs text-gray-500">{{ fileTypeLabel(file.file) }}</div>
              </div>
              <button type="button" class="text-red-500 hover:text-red-600 text-xs" @click="removeFile(idx)">Remove</button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="goBack"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting || !files.length"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
          >
            {{ submitting ? 'Uploading...' : 'Upload Documents' }}
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('Attach Documents')

const form = ref({
  documentable_type: '',
  documentable_id: '',
  document_category: '',
  description: ''
})

const target = ref<any>(null)

const files = ref<{ file: File; previewUrl?: string; previewsAsImage: boolean }[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)

const categoryOptions = [
  { value: 'thumbnail', label: 'Thumbnail', icon: '🖼️' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'document', label: 'Document', icon: '📄' },
  { value: 'contract', label: 'Contract', icon: '📑' },
  { value: 'invoice', label: 'Invoice', icon: '🧾' },
  { value: 'plan', label: 'Plan', icon: '📐' },
  { value: 'payment', label: 'Payment Attachment', icon: '💳' },
  { value: 'cnic_front', label: 'CNIC Front', icon: '🆔' },
  { value: 'cnic_back', label: 'CNIC Back', icon: '🆔' },
  { value: 'other', label: 'Other', icon: '📁' },
]

const targetLabel = computed(() => {
  if (!form.value.documentable_type || !form.value.documentable_id) return 'Select a record'
  const type = form.value.documentable_type.split('\\').pop() || form.value.documentable_type
  return `${type} #${form.value.documentable_id}`
})

const targetVisual = computed(() => {
  if (!target.value) return null
  const type = form.value.documentable_type.split('\\').pop() || ''
  const formatName = (obj: any) => {
    const prefix = obj?.name_prefix ? `${obj.name_prefix} ` : ''
    return `${prefix}${obj?.name || ''}`.trim() || obj?.email || ''
  }
  if (type.toLowerCase().includes('customer') || target.value.email) {
    return {
      avatar: target.value.profile_photo_url || target.value.photo || target.value.avatar || '',
      initials: (target.value.name || target.value.email || '').charAt(0).toUpperCase(),
      title: formatName(target.value) || 'Customer',
      subtitle: target.value.address || target.value.email || ''
    }
  }
  if (type.toLowerCase().includes('project')) {
    return {
      avatar: target.value.thumbnail_url || target.value.thumbnail?.file_path || '',
      initials: (target.value.name || 'P').charAt(0).toUpperCase(),
      title: target.value.name || 'Project',
      subtitle: formatName(target.value.customer) || target.value.address || ''
    }
  }
  if (type.toLowerCase().includes('payment')) {
    return {
      avatar: target.value.project?.thumbnail_url || target.value.project?.thumbnail?.file_path || '',
      initials: '₨',
      title: `Payment #${target.value.id || form.value.documentable_id}`,
      subtitle: `${target.value.amount ? `Amount: ${target.value.amount}` : ''} ${formatName(target.value.payer) ? `• Payer: ${formatName(target.value.payer)}` : ''}`.trim()
    }
  }
  return null
})

const selectFiles = () => {
  fileInput.value?.click()
}

const onFiles = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input?.files?.length) {
    files.value = Array.from(input.files).map(f => ({
      file: f,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      previewsAsImage: f.type.startsWith('image/')
    }))
  }
}

const removeFile = (idx: number) => {
  const file = files.value[idx]
  if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl)
  files.value.splice(idx, 1)
}

const submit = async () => {
  if (!form.value.documentable_type || !form.value.documentable_id) {
    toast.error('Missing model or ID')
    return
  }
  if (!files.value.length) {
    toast.error('Please select at least one file')
    return
  }
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('documentable_type', form.value.documentable_type)
    fd.append('documentable_id', String(form.value.documentable_id))
    if (form.value.document_category) fd.append('document_category', form.value.document_category)
    if (form.value.description) fd.append('description', form.value.description)
    files.value.forEach(f => fd.append('documents[]', f.file))

    await api.post('/documents/attach', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('Documents uploaded successfully')
    router.back()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error uploading documents')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  const model = route.query.model as string
  const id = route.query.id as string
  if (model) form.value.documentable_type = model
  if (id) form.value.documentable_id = id
  fetchTarget()
})

const fetchTarget = async () => {
  try {
    const type = form.value.documentable_type || ''
    const id = form.value.documentable_id
    if (!type || !id) return
    let url = ''
    if (type.toLowerCase().includes('customer')) url = `/customers/${id}`
    else if (type.toLowerCase().includes('project')) url = `/projects/${id}`
    else if (type.toLowerCase().includes('payment')) url = `/payments/${id}`
    if (!url) return
    const res = await api.get(url)
    target.value = res.data?.data || res.data
  } catch (e) {
    // ignore
  }
}

const fileTypeLabel = (file: File) => {
  if (!file.type) return 'File'
  if (file.type.startsWith('image/')) return 'Image'
  if (file.type.startsWith('application/pdf')) return 'PDF'
  if (file.type.includes('zip')) return 'Archive'
  return file.type
}
</script>

<style scoped>
</style>
