<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Search" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 items-center gap-3">
          <input
            v-model="query"
            @keyup.enter="runSearch"
            type="text"
            placeholder="Search customers, projects, payments, documents..."
            class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            @click="runSearch"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            Search
          </button>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Showing results for: <span class="font-medium text-gray-800 dark:text-white">{{ query || '—' }}</span>
        </div>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-medium">Filters:</span>
        <label v-if="canCustomers" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.customers" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Customers
        </label>
        <label v-if="canProjects" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.projects" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Projects
        </label>
        <label v-if="canPayments" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.payments" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Payments
        </label>
        <label v-if="canDocuments" class="flex items-center gap-2">
          <input type="checkbox" v-model="filters.documents" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Documents
        </label>
        <div class="flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400">From</span>
          <flat-pickr
            v-model="filters.start_date"
            :config="dateConfig"
            @on-close="runSearch"
            class="w-32 rounded border border-gray-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <span class="text-gray-500 dark:text-gray-400">To</span>
          <flat-pickr
            v-model="filters.end_date"
            :config="dateConfig"
            @on-close="runSearch"
            class="w-32 rounded border border-gray-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400">Highlight</span>
          <button
            @click="highlightEnabled = !highlightEnabled"
            class="rounded border border-gray-300 px-2 py-1 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5"
          >
            {{ highlightEnabled ? 'On' : 'Off' }}
          </button>
        </div>
      </div>

      <div v-if="!query" class="text-sm text-gray-500 dark:text-gray-400">
        Type a search term to see results.
      </div>

      <div v-else>
        <div v-if="loading" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Searching...</div>

        <div v-else class="space-y-8">
          <section v-if="canCustomers">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Customers</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.customers.length }} found</span>
            </header>
            <div v-if="results.customers.length" class="space-y-2">
              <div
                v-for="c in results.customers"
                :key="c.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
                  >
                    <img
                      v-if="avatarUrl(c)"
                      :src="avatarUrl(c)"
                      alt="avatar"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span v-else>{{ initials(c.name) }}</span>
                  </div>
                  <div>
                    <router-link :to="`/customers/${c.id}`" class="font-medium text-brand-600 hover:underline" v-html="highlightText(c.name)"></router-link>
                    <div class="text-xs text-gray-500 dark:text-gray-400" v-html="highlightText(c.city?.name || c.state?.name || c.country?.name || 'Location N/A')"></div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ c.email || 'No email' }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ c.phone || c.primary_phone || c.contact_number || 'No phone' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Created {{ formatDate(c.created_at) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No customers found.</div>
          </section>

          <section v-if="canProjects">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Projects</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.projects.length }} found</span>
            </header>
            <div v-if="results.projects.length" class="grid gap-3 md:grid-cols-2">
              <div
                v-for="p in results.projects"
                :key="p.id"
                class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div class="flex items-start gap-3">
                  <div class="h-16 w-24 overflow-hidden rounded-md bg-gray-100">
                    <img
                      v-if="projectThumb(p)"
                      :src="projectThumb(p)"
                      alt="project thumbnail"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center text-xs text-gray-500">No image</div>
                  </div>
                  <div class="flex-1">
                    <router-link :to="`/projects/${p.id}`" class="font-medium text-brand-600 hover:underline" v-html="highlightText(p.name)"></router-link>
                    <div class="mt-1 truncate text-xs text-gray-500 dark:text-gray-400" v-html="highlightText(p.address || p.plot_number || 'No address')"></div>
                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Owner: <span v-html="highlightText(p.owner?.name || p.customer?.name || 'N/A')"></span>
                    </div>
                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span v-html="highlightText(fullAddress(p) || 'Location N/A')"></span>
                    </div>
                    <div class="mt-2 flex items-center gap-2 text-xs">
                      <span :class="statusBadgeClass(p.status)" class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                        <component :is="statusIcon(p.status)" class="h-3.5 w-3.5" />
                        {{ prettyStatus(p.status) }}
                      </span>
                      <span class="text-gray-500 dark:text-gray-400">Created {{ formatDate(p.created_at) }}</span>
                      <span v-if="projectPaymentsTotal(p)" class="text-gray-500 dark:text-gray-400">
                        Paid {{ formatCurrency(projectPaymentsTotal(p)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No projects found.</div>
          </section>

          <section v-if="canPayments">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Payments</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.payments.length }} found</span>
            </header>
            <div v-if="results.payments.length" class="space-y-2">
              <div
                v-for="pay in results.payments"
                :key="pay.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div>
                  <div class="font-medium text-gray-900 dark:text-white" v-html="highlightText(`${formatCurrency(pay.amount)} — ${pay.description || 'Payment'}`)"></div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    From <span v-html="highlightText(pay.payer?.name || pay.customer?.name || pay.project?.name || '—')"></span>
                  </div>
                  <div class="mt-2 flex items-center gap-2 text-xs">
                    <span :class="statusBadgeClass(pay.status)" class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                      <component :is="statusIcon(pay.status)" class="h-3.5 w-3.5" />
                      {{ prettyStatus(pay.status) }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">Created {{ formatDate(pay.created_at) }}</span>
                  </div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Payment</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No payments found.</div>
          </section>

          <section v-if="canDocuments">
            <header class="mb-3 flex items-center justify-between">
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Documents</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ results.documents.length }} found</span>
            </header>
            <div v-if="results.documents.length" class="space-y-2">
              <div
                v-for="d in results.documents"
                :key="d.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div class="flex items-start gap-3">
                  <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                    <img
                      v-if="isImageDoc(d) && documentThumb(d)"
                      :src="documentThumb(d)"
                      alt="document preview"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <component v-else :is="documentIcon(d)" class="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white" v-html="highlightText(d.title || d.name || 'Document')"></div>
                    <div class="truncate text-xs text-gray-500 dark:text-gray-400" v-html="highlightText(d.description || d.file_name || '')"></div>
                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span v-html="highlightText(d.source || d.document_category || d.category || 'Document')"></span>
                    </div>
                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ humanSize(d.size || d.file_size) }}
                    </div>
                    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Created {{ formatDate(d.created_at) }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <button
                    v-if="canDocumentPreview && canPreviewDoc(d)"
                    @click="handlePreview(d)"
                    class="rounded-md p-1.5 text-purple-600 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
                    title="Preview"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <div class="relative">
                    <button
                      v-if="canDocumentShare"
                      @click.stop="toggleShareDropdown(d.id)"
                      class="rounded-md p-1.5 text-green-600 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                      title="Share"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>

                    <div
                      v-if="activeShareDropdown === d.id"
                      class="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 z-10"
                    >
                      <div class="py-1 text-sm">
                        <button
                          @click="shareViaWhatsApp(d)"
                          class="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <svg class="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </button>
                        <button
                          @click="shareViaEmail(d)"
                          class="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <svg class="mr-2 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </button>
                        <button
                          @click="copyLink(d)"
                          class="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <svg class="mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">No documents found.</div>
          </section>

          <div v-if="!hasAnyResults" class="text-sm text-gray-500 dark:text-gray-400">
            No results found for "{{ query }}".
          </div>
        </div>
      </div>
    </div>
    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-[9999] overflow-y-auto" @click.self="closePreviewModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closePreviewModal"></div>
        <div class="relative z-[10000] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800">
          <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ previewDoc?.name || previewDoc?.title }}</h3>
            <button @click="closePreviewModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="max-h-[calc(90vh-8rem)] overflow-auto p-4">
            <img
              v-if="previewDoc && getFileIcon(previewDoc) === 'image'"
              :src="previewUrl"
              :alt="previewDoc.name"
              class="mx-auto h-auto max-w-full"
            />
            <iframe
              v-else-if="previewDoc && getFileIcon(previewDoc) === 'pdf'"
              :src="previewUrl"
              class="h-[70vh] w-full"
              frameborder="0"
            ></iframe>
            <div v-else class="text-center text-sm text-gray-500 dark:text-gray-400">Preview not available</div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'
import { ClockIcon, CheckCircleIcon, PlayCircleIcon, PauseCircleIcon, XCircleIcon, FileTextIcon, ImageIcon } from 'lucide-vue-next'
import { formatAmount } from '@/utils/currency'

const route = useRoute()
const router = useRouter()
const { can } = usePermissions()
const toast = useToast()

const query = ref<string>((route.query.q as string) || '')
const loading = ref(false)
const highlightEnabled = ref(true)
const filters = ref({
  customers: true,
  projects: true,
  payments: true,
  documents: true,
  start_date: (route.query.start_date as string) || '',
  end_date: (route.query.end_date as string) || '',
})

const dateConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'M j, Y',
}

const results = ref({
  customers: [] as any[],
  projects: [] as any[],
  payments: [] as any[],
  documents: [] as any[],
})

const canCustomers = computed(() => can('customers', 'view'))
const canProjects = computed(() => can('projects', 'view'))
const canPayments = computed(() => can('payments', 'view'))
const canDocuments = computed(() => can('documents', 'view'))
const canDocumentPreview = computed(() => can('documents', 'view'))
const canDocumentShare = computed(() => can('documents', 'share') || can('documents', 'edit'))
const activeShareDropdown = ref<number | null>(null)
const showPreviewModal = ref(false)
const previewDoc = ref<any | null>(null)
const previewUrl = ref('')
const loadingDocumentId = ref<number | null>(null)

const hasAnyResults = computed(
  () =>
    results.value.customers.length ||
    results.value.projects.length ||
    results.value.payments.length ||
    results.value.documents.length
)

const runSearch = async () => {
  const term = query.value.trim()
  if (!term) return

  const queryParams: Record<string, string> = { q: term }
  if (filters.value.start_date) queryParams.start_date = filters.value.start_date
  if (filters.value.end_date) queryParams.end_date = filters.value.end_date

  router.replace({ path: '/search', query: queryParams })
  loading.value = true
  results.value = { customers: [], projects: [], payments: [], documents: [] }

  const tasks: Promise<void>[] = []

  if (canCustomers.value) {
    tasks.push(fetchResource('/customers', 'customers', filters.value.customers))
  }
  if (canProjects.value) {
    tasks.push(fetchResource('/projects', 'projects', filters.value.projects))
  }
  if (canPayments.value) {
    tasks.push(fetchResource('/payments', 'payments', filters.value.payments))
  }
  if (canDocuments.value) {
    tasks.push(fetchResource('/documents', 'documents', filters.value.documents))
  }

  try {
    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
}

const fetchResource = async (url: string, key: keyof typeof results.value, enabled = true) => {
  if (!enabled) {
    results.value[key] = []
    return
  }
  try {
    const params: Record<string, any> = { search: query.value, per_page: 5 }
    if (filters.value.start_date) params.start_date = filters.value.start_date
    if (filters.value.end_date) params.end_date = filters.value.end_date

    const res = await api.get(url, { params })
    const data = res.data?.data ?? res.data ?? []
    results.value[key] = Array.isArray(data) ? data.slice(0, 5) : []
  } catch (e) {
    results.value[key] = []
  }
}

const formatCurrency = (value: any) => formatAmount(value, 'PKR', { compact: true })

const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString()
}

const initials = (name: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  let base =
    (import.meta.env.VITE_FILE_BASE_URL as string) ||
    (import.meta.env.VITE_API_BASE_URL as string) ||
    window?.location?.origin ||
    ''
  base = base.replace(/\/api\/?$/, '')
  base = base.replace(/\/$/, '')
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

const avatarUrl = (customer: any) => {
  const candidate = customer?.avatar_url || customer?.photo || customer?.profile_photo_url || customer?.profile_photo
  return candidate ? makeAbsoluteUrl(candidate) : ''
}

const fullAddress = (p: any) => {
  if (!p) return ''
  const parts = [p.plot_number, p.address, p.town?.name, p.city?.name, p.state?.name, p.country?.name]
  return parts.filter(Boolean).join(', ')
}

const projectPaymentsTotal = (p: any) => {
  if (!p) return 0
  return p.payments_sum_amount ?? (p.payments_sum?.amount ?? p.payments_sum ?? 0)
}

const projectThumb = (project: any) => {
  if (!project) return ''
  const direct =
    project.thumbnail_url ||
    project.thumbnail?.file_path ||
    project.thumbnail?.thumb_url ||
    project.image ||
    project.cover ||
    project.thumbnail ||
    project.featured_image
  if (direct) return makeAbsoluteUrl(direct)
  const docThumb = (project.documents || []).find((d: any) => {
    const category = (d.document_category || d.category || '').toLowerCase()
    return category.includes('thumbnail') || category.includes('thumb') || category.includes('cover')
  })
  if (docThumb) return makeAbsoluteUrl(docThumb.file_path || docThumb.url || docThumb.thumb_url)
  return ''
}

const isImageDoc = (doc: any) => {
  const name = (doc?.file_name || doc?.name || '').toLowerCase()
  const mime = (doc?.mime_type || '').toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((ext) => name.endsWith(ext)) || mime.startsWith('image/')
}

const documentThumb = (doc: any) => makeAbsoluteUrl(doc?.thumb_url || doc?.url || doc?.file_url || doc?.file_path)

const documentIcon = (doc: any) => (isImageDoc(doc) ? ImageIcon : FileTextIcon)

const getFileIcon = (doc: any): string => {
  if (doc?.mime_type?.startsWith('image/')) return 'image'
  if (doc?.mime_type === 'application/pdf') return 'pdf'
  return 'file'
}

const canPreviewDoc = (doc: any) => ['image', 'pdf'].includes(getFileIcon(doc))

const previewDocument = async (doc: any) => {
  loadingDocumentId.value = doc.id
  try {
    const response = await api.get(`/documents/${doc.id}/url`)
    previewUrl.value = response.data.url
    previewDoc.value = doc
    showPreviewModal.value = true
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error loading preview')
  } finally {
    loadingDocumentId.value = null
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDoc.value = null
  previewUrl.value = ''
}

const handlePreview = (doc: any) => {
  if (!canDocumentPreview.value) {
    toast.error('You are not authorized to view documents')
    return
  }
  if (!canPreviewDoc(doc)) {
    toast.error('Preview not available for this file type')
    return
  }
  previewDocument(doc)
}

const toggleShareDropdown = (docId: number) => {
  activeShareDropdown.value = activeShareDropdown.value === docId ? null : docId
}

const shareViaWhatsApp = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const text = `Check out this document: ${document.name || document.title}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    activeShareDropdown.value = null
    toast.success('Opening WhatsApp...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const shareViaEmail = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const subject = `Document: ${document.name || document.title}`
    const body = `I'm sharing this document with you:\n\n${document.name || document.title}\n\n${url}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    activeShareDropdown.value = null
    toast.success('Opening email client...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const copyLink = async (document: any) => {
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

const humanSize = (bytes: number | undefined) => {
  if (!bytes) return '—'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const prettyStatus = (status: string) => {
  if (!status) return '—'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightText = (text: any) => {
  if (!text) return ''
  const term = query.value?.trim()
  if (!term || !highlightEnabled.value) return text
  try {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
    return String(text).replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>')
  } catch {
    return text
  }
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'active':
      return CheckCircleIcon
    case 'in_progress':
    case 'planning':
      return PlayCircleIcon
    case 'cancelled':
    case 'failed':
      return XCircleIcon
    case 'on_hold':
      return PauseCircleIcon
    default:
      return ClockIcon
  }
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'in_progress':
    case 'planning':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'on_hold':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
  }
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    activeShareDropdown.value = null
  }
}

watch(
  () => route.query,
  (val) => {
    if (!val) return
    if (typeof val.q === 'string') query.value = val.q
    filters.value.start_date = (val.start_date as string) || ''
    filters.value.end_date = (val.end_date as string) || ''
    if (query.value) runSearch()
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  if (query.value) runSearch()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
