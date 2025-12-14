import { ref } from 'vue'
import api from '@/utils/axios'

export type NotificationItem = {
  id: number
  type: string
  title?: string
  message?: string
  notifiable_type?: string
  notifiable_id?: number
  data?: Record<string, any>
  read_at?: string | null
  created_at?: string
  actor?: any
}

export type NotificationPreferences = {
  channels: Record<string, boolean>
  types: Record<string, boolean>
}

export function useNotifications() {
  const notifications = ref<NotificationItem[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const preferences = ref<NotificationPreferences | null>(null)
  const meta = ref<any>(null)

  const fetchUnreadCount = async () => {
    const res = await api.get('/notifications/unread-count')
    unreadCount.value = res.data?.count ?? 0
  }

  const fetchNotifications = async (params: Record<string, any> = {}) => {
    loading.value = true
    try {
      const res = await api.get('/notifications', { params })
      const data = res.data
      notifications.value = data.data ?? data ?? []
      meta.value = data
    } finally {
      loading.value = false
    }
  }

  const markRead = async (id: number) => {
    await api.post(`/notifications/${id}/read`)
    notifications.value = notifications.value.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    fetchUnreadCount()
  }

  const markAllRead = async () => {
    await api.post('/notifications/mark-all-read')
    notifications.value = notifications.value.map((n) => ({ ...n, read_at: new Date().toISOString() }))
    unreadCount.value = 0
  }

  const fetchPreferences = async () => {
    const res = await api.get('/notifications/preferences')
    preferences.value = res.data
  }

  const updatePreferences = async (payload: Partial<NotificationPreferences>) => {
    const res = await api.put('/notifications/preferences', payload)
    preferences.value = res.data
  }

  return {
    notifications,
    unreadCount,
    loading,
    preferences,
    meta,
    fetchUnreadCount,
    fetchNotifications,
    markRead,
    markAllRead,
    fetchPreferences,
    updatePreferences,
  }
}
