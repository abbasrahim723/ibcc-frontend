<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div v-if="loading">
          <div class="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="mt-1 h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div v-else>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">View all your events and activities</p>
        </div>

        <!-- Event Type Filters -->
        <div v-if="loading" class="flex flex-wrap gap-2">
          <div v-for="n in 4" :key="n" class="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="filter in eventFilters"
            :key="filter.type"
            @click="toggleFilter(filter.type)"
            :class="[
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              filter.active
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
          >
            <span :style="{ color: filter.active ? '#ffffff' : filter.color }">{{ filter.icon }}</span>
            <span>{{ filter.label }}</span>
          </button>
        </div>
      </div>

      <!-- Calendar -->
      <div v-if="loading" class="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <FullCalendar v-else ref="calendar" :options="calendarOptions" />
    </div>

    <!-- Event Detail Modal -->
    <div
      v-if="selectedEvent"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click="selectedEvent = null"
    >
      <div
        class="relative w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-gray-900"
        @click.stop
      >
        <button
          @click="selectedEvent = null"
          class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="mb-4 flex items-start gap-3">
          <div
            :style="{ backgroundColor: selectedEvent.backgroundColor }"
            class="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          >
            {{ getEventIcon(selectedEvent.extendedProps.type) }}
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ selectedEvent.title.replace(/^[^\s]+\s/, '') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatEventDate(selectedEvent.start) }}
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="selectedEvent.extendedProps.type === 'payment'">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.amount }} {{ selectedEvent.extendedProps.currency }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <span
                  :class="[
                    'inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize',
                    selectedEvent.extendedProps.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  ]"
                >
                  {{ selectedEvent.extendedProps.status }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Method</p>
                <p class="font-semibold text-gray-900 dark:text-white capitalize">
                  {{ selectedEvent.extendedProps.method || 'N/A' }}
                </p>
              </div>
              <div v-if="selectedEvent.extendedProps.project">
                <p class="text-xs text-gray-500 dark:text-gray-400">Project</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.project }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedEvent.extendedProps.type === 'project'">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <span
                  :class="[
                    'inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  ]"
                >
                  {{ selectedEvent.extendedProps.status }}
                </span>
              </div>
              <div v-if="selectedEvent.extendedProps.customer">
                <p class="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.customer }}
                </p>
              </div>
              <div v-if="selectedEvent.extendedProps.location" class="col-span-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Location</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.location }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedEvent.extendedProps.type === 'customer'">
            <div class="space-y-2">
              <div v-if="selectedEvent.extendedProps.email">
                <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.email }}
                </p>
              </div>
              <div v-if="selectedEvent.extendedProps.phone">
                <p class="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.phone }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedEvent.extendedProps.type === 'milestone'">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <span
                  :class="[
                    'inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  ]"
                >
                  {{ selectedEvent.extendedProps.status }}
                </span>
              </div>
              <div v-if="selectedEvent.extendedProps.customer">
                <p class="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ selectedEvent.extendedProps.customer }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            @click="selectedEvent = null"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button
            @click="viewDetails"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Calendar')
const calendar = ref<any>(null)
const selectedEvent = ref<any>(null)
const allEvents = ref<any[]>([])
const loading = ref(true)

const eventFilters = ref([
  { type: 'payment', label: 'Payments', icon: '💰', color: '#10B981', active: true },
  { type: 'project', label: 'Projects', icon: '📋', color: '#3B82F6', active: true },
  { type: 'customer', label: 'Customers', icon: '👤', color: '#8B5CF6', active: true },
  { type: 'milestone', label: 'Milestones', icon: '🎯', color: '#F59E0B', active: true },
])

const filteredEvents = computed(() => {
  const activeTypes = eventFilters.value.filter(f => f.active).map(f => f.type)
  return allEvents.value.filter(event => activeTypes.includes(event.extendedProps.type))
})

const handleEventClick = (info: any) => {
  selectedEvent.value = info.event
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: filteredEvents.value,
  eventClick: handleEventClick,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  height: 'auto',
  eventTimeFormat: {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    meridiem: false
  }
}))

const fetchEvents = async () => {
  loading.value = true
  try {
    const response = await api.get('/calendar/events')
    allEvents.value = response.data
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching calendar events')
  } finally {
    loading.value = false
  }
}

const toggleFilter = (type: string) => {
  const filter = eventFilters.value.find(f => f.type === type)
  if (filter) {
    filter.active = !filter.active
  }
}

const getEventIcon = (type: string) => {
  const filter = eventFilters.value.find(f => f.type === type)
  return filter ? filter.icon : '📅'
}

const formatEventDate = (date: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const viewDetails = () => {
  if (!selectedEvent.value) return

  const type = selectedEvent.value.extendedProps.type
  const id = selectedEvent.value.extendedProps.id

  selectedEvent.value = null

  if (type === 'payment') {
    router.push(`/payments/${id}/edit`)
  } else if (type === 'project' || type === 'milestone') {
    router.push(`/projects/${id}`)
  } else if (type === 'customer') {
    router.push(`/customers/${id}`)
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<style>
/* FullCalendar Dark Mode Styles */
.dark .fc {
  --fc-border-color: #374151;
  --fc-button-bg-color: #4B5563;
  --fc-button-border-color: #4B5563;
  --fc-button-hover-bg-color: #6B7280;
  --fc-button-hover-border-color: #6B7280;
  --fc-button-active-bg-color: #2563EB;
  --fc-button-active-border-color: #2563EB;
  --fc-today-bg-color: rgba(37, 99, 235, 0.1);
}

.dark .fc .fc-col-header-cell {
  background-color: #1F2937;
  color: #D1D5DB;
}

.dark .fc .fc-daygrid-day {
  background-color: #111827;
  color: #F3F4F6;
}

.dark .fc .fc-daygrid-day-number {
  color: #D1D5DB;
}

.dark .fc .fc-toolbar-title {
  color: #F3F4F6;
}

.dark .fc .fc-button {
  color: #F3F4F6;
}

.fc-event {
  cursor: pointer;
}
</style>
