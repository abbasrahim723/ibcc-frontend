<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="overflow-x-hidden">

      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 overflow-x-hidden">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Project Management</h3>

        <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center lg:flex-initial">
          <!-- View Toggle -->
          <div class="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              @click="viewMode = 'list'"
              :class="[
                'rounded-md p-1.5 transition-colors',
                viewMode === 'list' 
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
              title="List View"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'rounded-md p-1.5 transition-colors',
                viewMode === 'grid' 
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
              title="Grid View"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <!-- Filters -->
          <select v-model="filters.town_id" @change="handleSearch" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="">All Towns</option>
            <option v-for="town in towns" :key="town.id" :value="town.id">{{ town.name }}</option>
          </select>

          <select v-model="filters.customer_id" @change="handleSearch" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white max-w-[150px]">
            <option value="">All Customers</option>
            <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>

          <select v-model="filters.status" @change="handleSearch" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search projects..."
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <button
            @click="router.push('/projects/create')"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            <span class="flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="hidden md:inline">Add Project</span>
            </span>
          </button>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[200px]">Project</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[180px]">Owner</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[200px]">Location</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Payments</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[160px]">Added / Updated</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img 
                      v-if="getProjectThumbnail(project)" 
                      :src="getProjectThumbnail(project)" 
                      :alt="project.name"
                      class="h-full w-full object-cover" 
                      @error="handleImageError"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-lg font-bold text-gray-400 dark:text-gray-600">
                      {{ project.name?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      <router-link :to="`/projects/${project.id}`" class="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">
                        {{ project.name }}
                      </router-link>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ project.plot_number || '—' }}</div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <router-link 
                  v-if="project.customer" 
                  :to="`/customers/${project.customer?.id}`" 
                  class="flex items-center gap-2 group"
                >
                  <div class="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 group-hover:border-brand-400 transition-colors">
                    <img 
                      v-if="getCustomerPhoto(project.customer)" 
                      :src="getCustomerPhoto(project.customer)" 
                      :alt="project.customer?.name"
                      class="h-full w-full object-cover" 
                      @error="handleImageError"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-sm font-bold text-gray-400 dark:text-gray-600">
                      {{ project.customer?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="font-medium text-sm text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 truncate">
                      {{ getCustomerDisplayName(project.customer) || '—' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ truncate(project.customer?.address || '', 25) }}</div>
                  </div>
                </router-link>
                <div v-else class="text-sm text-gray-400">—</div>
              </td>

              <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                <div class="truncate max-w-[200px]" :title="fullAddress(project)">{{ fullAddress(project) || '—' }}</div>
              </td>

              <td class="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {{ formatCurrency(paymentsTotal(project)) }}
              </td>

              <td class="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                <div class="text-xs truncate">By: <span class="font-medium">{{ truncate(project.creator?.name || project.created_by_name || '—', 15) }}</span></div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate">Updated: <span class="font-medium">{{ truncate(project.updater?.name || project.updated_by_name || '—', 15) }}</span></div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="project.is_active ? 'inline-flex rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-800 dark:text-green-400' : 'inline-flex rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-800 dark:text-red-400'">
                  {{ project.status }}
                </span>
              </td>
              
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="router.push(`/projects/${project.id}/edit`)" class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3 transition-colors">Edit</button>
                <button @click="deleteProject(project.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">Delete</button>
              </td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No projects found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="project in projects" :key="project.id" class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <!-- Project Thumbnail/Header -->
          <router-link :to="`/projects/${project.id}`" class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img 
              v-if="getProjectThumbnail(project)" 
              :src="getProjectThumbnail(project)" 
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="handleImageError"
            />
            <div v-else class="h-full w-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
               <span class="text-4xl font-bold text-white opacity-30">{{ project.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span :class="[
                'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md',
                project.is_active 
                  ? 'bg-green-100/90 text-green-800 dark:bg-green-900/80 dark:text-green-200' 
                  : 'bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200'
              ]">
                {{ project.status }}
              </span>
            </div>
          </router-link>

          <!-- Content -->
          <div class="flex flex-1 flex-col p-4">
            <div class="mb-3">
              <router-link :to="`/projects/${project.id}`" class="block text-lg font-semibold text-gray-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
                {{ project.name }}
              </router-link>
              <div class="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="truncate">{{ fullAddress(project) || 'No address' }}</span>
              </div>
            </div>

            <!-- Owner -->
            <div class="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
              <div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <img 
                  v-if="getCustomerPhoto(project.customer)" 
                  :src="getCustomerPhoto(project.customer)" 
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                  {{ project.customer?.name?.charAt(0)?.toUpperCase() }}
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {{ getCustomerDisplayName(project.customer) || 'Unknown Owner' }}
                </div>
                <div class="truncate text-xs text-gray-500 dark:text-gray-400">Owner</div>
              </div>
            </div>

            <div class="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400">Contract Value</span>
                <span class="font-semibold text-brand-600 dark:text-brand-400">
                  {{ formatCurrency(project.contract_value) }}
                </span>
              </div>
              <div class="flex gap-2">
                <button @click="router.push(`/projects/${project.id}/edit`)" class="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State Grid -->
        <div v-if="projects.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results</div>
        <div class="flex gap-2">
          <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Previous</button>
          <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Next</button>
        </div>
      </div>
    </div>
    </div>

    <!-- Project Modal -->
    <Modal v-if="isProjectModalOpen" @close="isProjectModalOpen = false">
      <div class="relative w-full max-w-[760px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{{ editingProject ? 'Edit Project' : 'Create Project' }}</h3>
        <form @submit.prevent="saveProject" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Project Name</label>
            <input v-model="projectForm.name" type="text" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Owner (Customer)</label>
              <select v-model="projectForm.customer_id" class="h-11 w-full rounded-lg border border-gray-300 px-3">
                <option value="">Select owner</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Plot Number</label>
              <input v-model="projectForm.plot_number" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
            <input v-model="projectForm.address" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contract Type</label>
              <select v-model="projectForm.contract_type" class="h-11 w-full rounded-lg border border-gray-300 px-3">
                <option value="">Select contract type</option>
                <option value="material_based">Material Based</option>
                <option value="labour_rate">Labour Rate</option>
                <option value="fixed_price">Fixed Price</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contract Value</label>
              <input v-model="projectForm.contract_value" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Attach Documents</label>
            <input type="file" multiple @change="handleFileChange" />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="isProjectModalOpen = false" class="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" class="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white">Save</button>
          </div>
        </form>
      </div>
    </Modal>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Modal from '@/components/profile/Modal.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Projects')
const projects = ref<any[]>([])
const customers = ref<any[]>([])
const towns = ref<any[]>([])
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')
const filters = ref({
  town_id: '',
  customer_id: '',
  status: ''
})

const pagination = ref({ current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 })

const isProjectModalOpen = ref(false)
const editingProject = ref<any>(null)
const projectForm = ref({
  name: '',
  description: '',
  customer_id: null,
  plot_number: '',
  address: '',
  contract_type: '',
  contract_value: '',
  is_active: true,
})

const filesToUpload = ref<File[]>([])

const fetchProjects = async (page = 1) => {
  try {
    const params = { 
      page, 
      search: searchQuery.value || undefined,
      town_id: filters.value.town_id || undefined,
      customer_id: filters.value.customer_id || undefined,
      status: filters.value.status || undefined
    }
    const res = await api.get('/projects', { params })
    projects.value = res.data.data
    pagination.value = {
      current_page: res.data.current_page,
      last_page: res.data.last_page,
      per_page: res.data.per_page,
      total: res.data.total,
      from: res.data.from,
      to: res.data.to,
    }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching projects')
  }
}

const fetchCustomers = async () => {
  try {
    const res = await api.get('/customers')
    customers.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

const fetchTowns = async () => {
  try {
    const res = await api.get('/towns')
    towns.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

const handleSearch = () => fetchProjects(1)
const changePage = (page: number) => fetchProjects(page)

const openProjectModal = (project: any = null) => {
  editingProject.value = project
  if (project) {
    projectForm.value = { ...project }
  } else {
    projectForm.value = { name: '', description: '', customer_id: null, plot_number: '', address: '', contract_type: '', contract_value: '', is_active: true }
  }
  filesToUpload.value = []
  isProjectModalOpen.value = true
}

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  filesToUpload.value = Array.from(input.files)
}

const saveProject = async () => {
  try {
    const formData = new FormData()
    Object.entries(projectForm.value).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v as any)
    })
    filesToUpload.value.forEach((f) => formData.append('documents[]', f))

    if (editingProject.value) {
      const res = await api.put(`/projects/${editingProject.value.id}`, formData)
      toast.success('Project updated')
    } else {
      const res = await api.post('/projects', formData)
      toast.success('Project created')
    }

    isProjectModalOpen.value = false
    fetchProjects(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error saving project')
  }
}

const editProject = (p: any) => openProjectModal(p)

const deleteProject = async (id: number) => {
  if (!confirm('Are you sure?')) return
  try {
    const res = await api.delete(`/projects/${id}`)
    toast.success(res.data.message || 'Deleted')
    fetchProjects(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error deleting project')
  }
}

onMounted(() => {
  fetchProjects()
  fetchCustomers()
  fetchTowns()
})

const truncate = (s: string | undefined, n = 40) => {
  if (!s) return ''
  return s.length > n ? s.substring(0, n - 1) + '…' : s
}

const fullAddress = (p: any) => {
  if (!p) return ''
  const parts = [p.plot_number, p.address, p.town?.name, p.city?.name, p.state?.name, p.country?.name]
  return parts.filter(Boolean).join(', ')
}

const paymentsTotal = (p: any) => {
  if (!p) return 0
  // support different withSum output shapes
  return p.payments_sum_amount ?? (p.payments_sum?.amount ?? p.payments_sum ?? 0)
}

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return '—'
  const num = Number(value) || 0
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(num)
  return `₨ ${formatted}`
}

const getProjectThumbnail = (p: any) => {
  if (!p) return ''
  // direct url fields
  const direct = p.thumbnail_url || p.thumbnail?.file_path || p.thumbnail?.thumb_url
  if (direct) return makeAbsoluteUrl(direct)
  // look into documents for a thumbnail category
  const docThumb = (p.documents || []).find((d: any) => (d.document_category || d.category || '').toLowerCase() === 'thumbnail' || (d.document_category || d.category || '').toLowerCase() === 'thumb')
  if (docThumb) return makeAbsoluteUrl(docThumb.file_path || docThumb.url || docThumb.thumb_url)
  return ''
}

const getCustomerPhoto = (c: any) => {
  if (!c) return ''
  const path = c.profile_photo_url || c.photo || c.avatar || c.profile_photo
  return path ? makeAbsoluteUrl(path) : ''
}

const getCustomerDisplayName = (c: any) => {
  if (!c) return ''
  const prefix = c.name_prefix ? `${c.name_prefix} ` : ''
  return `${prefix}${c.name}`.trim()
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) {
    img.style.display = 'none'
  }
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  // Get base URL and remove /api suffix if present
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  
  // Remove /api from the end if it exists
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

</script>
