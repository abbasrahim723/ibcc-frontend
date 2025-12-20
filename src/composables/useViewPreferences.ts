import { ref } from 'vue'
import api from '@/utils/axios'

export type ViewKey = 'payments' | 'expenses' | 'projects' | 'activities' | 'documents'
export type ViewMode = 'list' | 'kanban' | 'table' | 'timeline' | 'grid'

interface ViewPreferences {
    [key: string]: ViewMode
}

const viewPreferences = ref<ViewPreferences>({})
const isLoaded = ref(false)
const isLoading = ref(false)

/**
 * Composable for managing user view preferences (list/kanban/table/timeline)
 * Persists to database and uses localStorage as fallback/cache
 */
export function useViewPreferences() {
    /**
     * Load preferences from API (called once on app init)
     */
    const loadPreferences = async (): Promise<void> => {
        if (isLoaded.value || isLoading.value) return

        isLoading.value = true
        try {
            const response = await api.get('/preferences')
            viewPreferences.value = response.data?.view_preferences || {}
            isLoaded.value = true

            // Sync to localStorage as cache
            localStorage.setItem('view_preferences', JSON.stringify(viewPreferences.value))
        } catch (error) {
            console.warn('Failed to load view preferences from API, using localStorage fallback')
            // Fallback to localStorage
            const cached = localStorage.getItem('view_preferences')
            if (cached) {
                try {
                    viewPreferences.value = JSON.parse(cached)
                } catch {
                    viewPreferences.value = {}
                }
            }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Get the view mode for a specific view
     */
    const getViewMode = (viewKey: ViewKey, defaultMode: ViewMode = 'list'): ViewMode => {
        // Try memory first
        if (viewPreferences.value[viewKey]) {
            return viewPreferences.value[viewKey]
        }

        // Fallback to localStorage
        const cached = localStorage.getItem('view_preferences')
        if (cached) {
            try {
                const parsed = JSON.parse(cached)
                if (parsed[viewKey]) {
                    return parsed[viewKey]
                }
            } catch {
                // ignore
            }
        }

        return defaultMode
    }

    /**
     * Set the view mode for a specific view and persist to API
     */
    const setViewMode = async (viewKey: ViewKey, mode: ViewMode): Promise<void> => {
        // Update local state immediately
        viewPreferences.value[viewKey] = mode

        // Persist to localStorage for cache
        localStorage.setItem('view_preferences', JSON.stringify(viewPreferences.value))

        // Persist to API (fire and forget for better UX)
        try {
            await api.patch(`/preferences/view/${viewKey}`, { mode })
        } catch (error) {
            console.warn(`Failed to save view preference for ${viewKey}:`, error)
            // Don't throw - we already have localStorage backup
        }
    }

    /**
     * Initialize preferences on first use
     */
    const initPreferences = async (): Promise<void> => {
        if (!isLoaded.value) {
            await loadPreferences()
        }
    }

    return {
        viewPreferences,
        getViewMode,
        setViewMode,
        loadPreferences,
        initPreferences,
        isLoaded,
        isLoading
    }
}
