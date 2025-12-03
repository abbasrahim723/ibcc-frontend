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
                    <div class="text-sm font-medium text-gray-900 dark:text-white" :title="doc.name">{{ truncate(doc.name, 80) }}</div>
                    <div class="text-xs text-gray-500">{{ doc.category || doc.mime_type }}</div>
                  </div>
                </div>
                <div>
                  <a :href="getFullUrl(doc.url)" target="_blank" class="text-brand-600">Open</a>
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
                  <div class="text-xs text-gray-500">{{ p.created_at | date }}</div>
                </div>
                <div class="text-sm font-semibold">{{ formatCurrency(p.amount) }}</div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const toast = useToast()
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

const getFullUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || api.defaults.baseURL || window?.location?.origin || ''
  const base = fileBase.replace(/\/$/, '')
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}
</script>
