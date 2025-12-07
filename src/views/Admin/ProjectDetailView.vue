<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="col-span-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
            <img v-if="getFullUrl(project?.thumbnail_url)" :src="getFullUrl(project.thumbnail_url)" class="h-full w-full object-cover" />
            <div v-else class="h-full w-full flex items-center justify-center text-lg font-bold text-gray-500">{{ project?.name?.charAt(0)?.toUpperCase() }}</div>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ project?.name }}</h2>
            <div class="text-sm text-gray-500">{{ project?.customer?.name }}</div>
          </div>
        </div>

        <div class="mt-6 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Plot:</strong> {{ project?.plot_number || '—' }}</p>
          <p class="mt-2"><strong>Address:</strong> {{ fullAddress(project) || '—' }}</p>
          <p class="mt-2"><strong>Contract Value:</strong> {{ formatCurrency(project?.contract_value) }}</p>
          <p class="mt-2"><strong>Status:</strong> <span :class="project?.is_active ? 'text-green-600' : 'text-red-600'">{{ project?.status }}</span></p>
        </div>
      </div>

      <div class="col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>
        </div>

        <div>
          <div class="mb-4">
            <button v-for="t in tabs" :key="t" @click="activeTab = t" class="mr-2 rounded-md px-3 py-1" :class="activeTab === t ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">{{ t }}</button>
          </div>

          <div v-if="activeTab === 'Overview'">
            <div class="prose max-w-none text-sm text-gray-700 dark:text-gray-300">
              <p v-html="project?.description || 'No description provided.'"></p>
            </div>
          </div>

          <div v-if="activeTab === 'Documents'">
            <div v-if="documents.length === 0" class="text-sm text-gray-500">No documents</div>
            <ul class="space-y-2">
              <li v-for="doc in documents" :key="doc.id" class="flex items-center justify-between rounded-md border px-3 py-2">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 overflow-hidden rounded-md bg-gray-100">
                    <img v-if="getFullUrl(doc.thumb_url)" :src="getFullUrl(doc.thumb_url)" class="h-full w-full object-cover" />
                    <div v-else class="h-full w-full flex items-center justify-center text-sm text-gray-500">DOC</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white" :title="doc.name">{{ truncate(doc.name, 20) }}</div>
                    <div class="text-xs text-gray-500">{{ doc.category || doc.mime_type }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                   <button
                        @click="handlePreview(doc)"
                        :class="[
                          'p-1.5 rounded-md transition-colors',
                          can('documents', 'view')
                            ? 'text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/30'
                            : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                        ]"
                        title="Preview"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button
                        @click="handleDownload(doc)"
                         :class="[
                          'p-1.5 rounded-md transition-colors',
                          can('documents', 'download')
                            ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                        ]"
                        title="Download"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                     <button
                        @click="handleShare(doc)"
                         :class="[
                          'p-1.5 rounded-md transition-colors',
                          can('documents', 'share')
                            ? 'text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/30'
                            : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                        ]"
                        title="Share"
                      >
                         <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                    </button>
                </div>
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'Payments'">
            <div v-if="payments.length === 0" class="text-sm text-gray-500">No payments recorded</div>
            <ul class="space-y-2">
              <li v-for="p in payments" :key="p.id" class="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ p.title || p.id }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(p.created_at) }}</div>
                </div>
                <div class="text-sm font-semibold">{{ formatCurrency(p.amount) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closePreviewModal"
    >
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closePreviewModal"></div>

        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden z-50">
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ previewDoc?.name }}</h3>
            <button @click="closePreviewModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
            <img
              v-if="previewDoc && isImageFile(previewDoc)"
              :src="previewUrl"
              :alt="previewDoc.name"
              class="max-w-full h-auto mx-auto"
            />
            <iframe
              v-else-if="previewDoc && (isPdfFile(previewDoc) || true)"
              :src="previewUrl"
              class="w-full h-[70vh]"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { can } = usePermissions()
const id = Number(route.params.id)
const pageTitle = ref('Project Detail')
const project = ref<any>(null)
const documents = ref<any[]>([])
const payments = ref<any[]>([])
const tabs = ['Overview', 'Documents', 'Payments']
const activeTab = ref('Overview')

const fetchProject = async () => {
  try {
    const res = await api.get(`/projects/${id}`)
    project.value = res.data.data || res.data
    // if response returns resources directly
    documents.value = project.value.documents || []
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching project')
  }
}

const fetchPayments = async () => {
  try {
    const res = await api.get('/payments', { params: { project_id: id } })
    payments.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

onMounted(() => {
  if (!can('projects', 'view_details')) {
    toast.error('You are not authorized to view project details')
    router.push('/projects')
    return
  }

  fetchProject()
  fetchPayments()
})

const fullAddress = (p: any) => {
  if (!p) return ''
  const parts = [p.plot_number, p.address, p.town?.name, p.city?.name, p.state?.name, p.country?.name]
  return parts.filter(Boolean).join(', ')
}

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return '—'
  const num = Number(value) || 0
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(num)
  return `₨ ${formatted}`
}

const truncate = (s: string | undefined, n = 80) => {
  if (!s) return ''
  return s.length > n ? s.substring(0, n - 1) + '…' : s
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getFullUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || api.defaults.baseURL || window?.location?.origin || ''
  const base = fileBase.replace(/\/$/, '')
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

// Permission Handlers
const handlePreview = async (doc: any) => {
  if (!can('documents', 'view')) {
    toast.error('You are not authorized to view documents')
    return
  }
  
  try {
     const url = getFullUrl(doc.url || doc.path)
     previewUrl.value = url // Simple preview for now, or fetch signed url
     // If we want signed URL:
     // const response = await api.get(`/documents/${doc.id}/url`)
     // previewUrl.value = response.data.url
     
     // For now using directly public url logic as simplified
     previewDoc.value = doc
     showPreviewModal.value = true
  } catch (e) {
      toast.error('Error opening preview')
  }
}

const handleDownload = async (doc: any) => {
  if (!can('documents', 'download')) {
    toast.error('You are not authorized to download documents')
    return
  }
  
  try {
     // Trigger download via API or direct link
     const url = getFullUrl(doc.url || doc.path)
     const link = document.createElement('a')
     link.href = url
     link.download = doc.name
     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
  } catch(e) {
      toast.error('Error downloading')
  }
}

const handleShare = async (doc: any) => {
    if (!can('documents', 'share')) {
        toast.error('You are not authorized to share documents')
        return
    }
    
    try {
        const url = getFullUrl(doc.url || doc.path)
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
    } catch(e) {
        toast.error('Error sharing')
    }
}

// Modal State
const showPreviewModal = ref(false)
const previewDoc = ref<any>(null)
const previewUrl = ref('')

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDoc.value = null
  previewUrl.value = ''
}

const isImageFile = (doc: any) => {
    return (doc.mime_type || '').startsWith('image/') || (doc.name || '').match(/\.(jpg|jpeg|png|gif|webp)$/i)
}

const isPdfFile = (doc: any) => {
    return (doc.mime_type || '') === 'application/pdf' || (doc.name || '').match(/\.pdf$/i)
}
</script>
