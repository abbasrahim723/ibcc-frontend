<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex items-center justify-between gap-4">
        <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Document Management</h3>
        
        <div class="flex flex-1 lg:flex-initial items-center gap-4">
          <!-- Search -->
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search documents..."
            class="rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Documents Table - Fixed Width Container -->
      <div class="overflow-x-auto -mx-5 px-5">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-64">File Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-48">Belongs To</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-32">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-24">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-32">Uploaded By</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-32">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-40">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              <tr v-for="document in documents" :key="document.id">
                <td class="px-4 py-4">
                  <div class="flex items-center">
                    <!-- File Icon -->
                    <div class="flex-shrink-0 mr-3">
                      <svg v-if="getFileIcon(document) === 'image'" class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <svg v-else-if="getFileIcon(document) === 'pdf'" class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <svg v-else class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="document.name">{{ document.name }}</div>
                      <div class="text-xs text-gray-500">{{ document.file_type?.toUpperCase() }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <router-link 
                    v-if="document.documentable && document.documentable_type.includes('Customer')"
                    :to="`/customers/${document.documentable_id}`"
                    class="text-sm text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 truncate block"
                    :title="getDocumentOwner(document)"
                  >
                    {{ getDocumentOwner(document) }}
                  </router-link>
                  <div v-else class="text-sm text-gray-900 dark:text-white truncate" :title="getDocumentOwner(document)">
                    {{ getDocumentOwner(document) }}
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span v-if="document.document_category" class="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ document.document_category }}
                  </span>
                  <span v-else class="text-xs text-gray-400">N/A</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatFileSize(document.file_size) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate" :title="document.uploader?.name || 'Unknown'">
                  {{ document.uploader?.name || 'Unknown' }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(document.created_at) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <!-- Preview Button -->
                    <button 
                      v-if="canPreview(document)"
                      @click="previewDocument(document)" 
                      class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      title="Preview"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <!-- Share Dropdown -->
                    <div class="relative">
                      <button 
                        @click.stop="toggleShareDropdown(document.id)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Share"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      
                      <!-- Share Dropdown Menu -->
                      <div 
                        v-if="activeShareDropdown === document.id"
                        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                      >
                        <div class="py-1">
                          <button
                            @click="shareViaWhatsApp(document)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <svg class="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </button>
                          <button
                            @click="shareViaEmail(document)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </button>
                          <button
                            @click="copyLink(document)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Download Button -->
                    <button 
                      @click="downloadDocument(document)" 
                      class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                      title="Download"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button 
                      @click="deleteDocument(document)" 
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="documents.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No documents found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div 
      v-if="showPreviewModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closePreviewModal"
    >
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-transparent transition-opacity" @click="closePreviewModal"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden z-50">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ previewDoc?.name }}</h3>
            <button @click="closePreviewModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
            <!-- Image Preview -->
            <img 
              v-if="previewDoc && getFileIcon(previewDoc) === 'image'" 
              :src="previewUrl" 
              :alt="previewDoc.name"
              class="max-w-full h-auto mx-auto"
            />
            
            <!-- PDF Preview -->
            <iframe 
              v-else-if="previewDoc && getFileIcon(previewDoc) === 'pdf'"
              :src="previewUrl"
              class="w-full h-[70vh]"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmButtonText="confirmModalButtonText"
      @close="closeConfirmModal"
      @confirm="confirmAction"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

interface Document {
  id: number
  name: string
  file_path: string
  file_type: string
  mime_type: string
  file_size: number
  document_category: string | null
  documentable_type: string
  documentable_id: number
  documentable?: any
  uploader?: { id: number; name: string }
  created_at: string
  updated_at: string
}

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Documents')
const documents = ref<Document[]>([])
const searchQuery = ref('')
const activeShareDropdown = ref<number | null>(null)
const showPreviewModal = ref(false)
const previewDoc = ref<Document | null>(null)
const previewUrl = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

// Confirmation Modal State
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalButtonText = ref('Confirm')
const pendingDocument = ref<Document | null>(null)

const fetchDocuments = async (page = 1) => {
  try {
    const params: any = {
      page,
      per_page: 15,
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const response = await api.get('/documents', { params })
    documents.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching documents')
  }
}

const handleSearch = () => {
  fetchDocuments(1)
}

const changePage = (page: number) => {
  fetchDocuments(page)
}

const getFileIcon = (document: Document): string => {
  if (document.mime_type?.startsWith('image/')) {
    return 'image'
  } else if (document.mime_type === 'application/pdf') {
    return 'pdf'
  }
  return 'file'
}

const canPreview = (document: Document): boolean => {
  return getFileIcon(document) === 'image' || getFileIcon(document) === 'pdf'
}

const getDocumentOwner = (document: Document): string => {
  if (!document.documentable) {
    return 'Unknown'
  }
  
  const type = document.documentable_type.split('\\').pop() || document.documentable_type
  const name = document.documentable.name || `ID: ${document.documentable_id}`
  
  return `${type}: ${name}`
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const previewDocument = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    previewUrl.value = response.data.url
    previewDoc.value = document
    showPreviewModal.value = true
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error loading preview')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDoc.value = null
  previewUrl.value = ''
}

const toggleShareDropdown = (docId: number) => {
  activeShareDropdown.value = activeShareDropdown.value === docId ? null : docId
}

const shareViaWhatsApp = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const text = `Check out this document: ${document.name}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    activeShareDropdown.value = null
    toast.success('Opening WhatsApp...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const shareViaEmail = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const subject = `Document: ${document.name}`
    const body = `I'm sharing this document with you:\n\n${document.name}\n\n${url}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    activeShareDropdown.value = null
    toast.success('Opening email client...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const copyLink = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    await navigator.clipboard.writeText(url)
    activeShareDropdown.value = null
    toast.success('Link copied to clipboard!')
  } catch (error: any) {
    toast.error('Error copying link')
  }
}

const downloadDocument = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/download`, {
      responseType: 'blob'
    })
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = window.document.createElement('a')
    link.href = url
    link.setAttribute('download', document.name)
    window.document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    toast.success('Document downloaded successfully')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error downloading document')
  }
}

const deleteDocument = (document: Document) => {
  pendingDocument.value = document
  confirmModalTitle.value = 'Delete Document'
  confirmModalMessage.value = `Are you sure you want to delete "${document.name}"? This action cannot be undone.`
  confirmModalButtonText.value = 'Delete'
  showConfirmModal.value = true
}

const confirmAction = async () => {
  if (!pendingDocument.value) return

  try {
    const response = await api.delete(`/documents/${pendingDocument.value.id}`)
    toast.success(response.data.message)
    fetchDocuments(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting document')
  } finally {
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingDocument.value = null
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeShareDropdown.value = null
  }
}

onMounted(() => {
  fetchDocuments()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
