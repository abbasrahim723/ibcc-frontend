<template>
  <div class="relative" ref="container">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 text-left text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      :class="{ 'border-brand-500 ring-1 ring-brand-500': isOpen }"
    >
      <span v-if="selectedProject" class="flex items-center gap-2 overflow-hidden">
        <div class="h-6 w-6 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <img
            v-if="getProjectThumbnail(selectedProject)"
            :src="getProjectThumbnail(selectedProject)"
            alt=""
            class="h-full w-full object-cover"
          />
          <div v-else class="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-600">
            {{ selectedProject.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="truncate">
          <div class="font-medium truncate">{{ selectedProject.name }}</div>
          <div v-if="showDetails && selectedProject.plot_number" class="text-xs text-gray-500 truncate">{{ selectedProject.plot_number }}</div>
        </div>
      </span>
      <span v-else class="text-gray-500">{{ placeholder }}</span>
      <svg class="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
        <input
          v-model="searchQuery"
          ref="searchInput"
          type="text"
          class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Search projects..."
          @click.stop
        />
      </div>
      
      <div v-if="loading" class="px-3 py-4 text-center text-sm text-gray-500">
        Loading...
      </div>
      
      <template v-else>
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          @click="selectProject(project)"
          class="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-brand-50 dark:bg-brand-900/20': modelValue === project.id }"
        >
          <div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <img
              v-if="getProjectThumbnail(project)"
              :src="getProjectThumbnail(project)"
              alt=""
              class="h-full w-full object-cover"
            />
            <div v-else class="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-600">
              {{ project.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-900 dark:text-white truncate">{{ project.name }}</div>
            <div class="text-xs text-gray-500 truncate">{{ project.plot_number || 'No plot number' }}</div>
          </div>
          <div v-if="modelValue === project.id" class="text-brand-600 dark:text-brand-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div v-if="filteredProjects.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
          No projects found
        </div>
      </template>
    </div>
    
    <!-- Overlay to close dropdown -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40 bg-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '@/utils/axios'

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select Project'
  },
  showDetails: {
    type: Boolean,
    default: true
  },
  projects: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const container = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const internalProjects = ref<any[]>([])
const loading = ref(false)

const projectsList = computed(() => {
  return props.projects.length > 0 ? props.projects : internalProjects.value
})

const selectedProject = computed(() => {
  if (!props.modelValue) return null
  return projectsList.value.find((p: any) => p.id === props.modelValue)
})

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projectsList.value
  const search = searchQuery.value.toLowerCase()
  return projectsList.value.filter((p: any) =>
    p.name.toLowerCase().includes(search) ||
    (p.plot_number && p.plot_number.toLowerCase().includes(search))
  )
})

const toggleDropdown = async () => {
  if (props.projects.length === 0 && internalProjects.value.length === 0) {
    await fetchProjects()
  }
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectProject = (project: any) => {
  if (props.modelValue === project.id) {
    emit('update:modelValue', null)
    emit('change', null)
  } else {
    emit('update:modelValue', project.id)
    emit('change', project)
  }
  isOpen.value = false
  searchQuery.value = ''
}

const fetchProjects = async () => {
  if (props.projects.length > 0) return
  
  loading.value = true
  try {
    const res = await api.get('/projects', { params: { per_page: 100 } })
    internalProjects.value = res.data.data || res.data
  } catch (e) {
    console.error('Error fetching projects', e)
  } finally {
    loading.value = false
  }
}

const getProjectThumbnail = (p: any) => {
  if (!p) return ''
  const direct = p.thumbnail_url || p.thumbnail?.file_path || p.thumbnail?.thumb_url
  if (direct) return makeAbsoluteUrl(direct)
  const docThumb = (p.documents || []).find((d: any) => (d.document_category || d.category || '').toLowerCase() === 'thumbnail' || (d.document_category || d.category || '').toLowerCase() === 'thumb')
  if (docThumb) return makeAbsoluteUrl(docThumb.file_path || docThumb.url || docThumb.thumb_url)
  return ''
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (container.value && !container.value.contains(e.target as Node) && isOpen.value) {
      // Logic handled by the fixed overlay, but keeping this as backup or if overlay is removed
      // isOpen.value = false
    }
  })
})
</script>
