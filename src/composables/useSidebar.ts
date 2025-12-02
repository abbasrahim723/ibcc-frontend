// import { ref } from 'vue'

// export function useSidebar() {
//   const isMobileOpen = ref(false)
//   const isDesktopOpen = ref(true)

//   const toggleSidebar = () => {
//     isDesktopOpen.value = !isDesktopOpen.value
//   }

//   const toggleMobileSidebar = () => {
//     isMobileOpen.value = !isMobileOpen.value
//   }

//   return {
//     isMobileOpen,
//     isDesktopOpen,
//     toggleSidebar,
//     toggleMobileSidebar,
//   }
// }

import { ref, computed, onMounted, onUnmounted, provide, inject, watch } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

interface SidebarContextType {
  isExpanded: Ref<boolean>
  isMobileOpen: Ref<boolean>
  isHovered: Ref<boolean>
  activeItem: Ref<string | null>
  openSubmenu: Ref<string | null>
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  setIsHovered: (isHovered: boolean) => void
  setActiveItem: (item: string | null) => void
  toggleSubmenu: (item: string) => void
}

const SidebarSymbol = Symbol()

export function useSidebarProvider() {
  const isExpanded = ref(true)
  const isMobileOpen = ref(false)
  const isMobile = ref(false)
  const isHovered = ref(false)
  const activeItem = ref<string | null>(null)
  const openSubmenu = ref<string | null>(null)
  const authStore = useAuthStore()
  const route = useRoute()

  const handleResize = () => {
    const mobile = window.innerWidth < 768
    isMobile.value = mobile
    if (!mobile) {
      isMobileOpen.value = false
    }
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  // Close mobile sidebar when route changes
  watch(() => route.path, () => {
    isMobileOpen.value = false
  })

  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value
    } else {
      isExpanded.value = !isExpanded.value
      // Persist state
      if (authStore.isAuthenticated) {
        authStore.updatePreferences({
          sidebar_collapsed: !isExpanded.value
        }).catch(err => console.error('Failed to save sidebar state', err))
      }
    }
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const setIsHovered = (value: boolean) => {
    isHovered.value = value
  }

  const setActiveItem = (item: string | null) => {
    activeItem.value = item
  }

  const toggleSubmenu = (item: string) => {
    openSubmenu.value = openSubmenu.value === item ? null : item
  }

  // Initialize from preferences
  if (authStore.preferences?.sidebar_collapsed !== undefined) {
    isExpanded.value = !authStore.preferences.sidebar_collapsed
  }

  // Watch for preference changes (e.g. initial load)
  watch(() => authStore.preferences, (newPrefs) => {
    if (newPrefs?.sidebar_collapsed !== undefined && !isMobile.value) {
      isExpanded.value = !newPrefs.sidebar_collapsed
    }
  }, { immediate: true })

  const context: SidebarContextType = {
    isExpanded: computed(() => (isMobile.value ? false : isExpanded.value)),
    isMobileOpen,
    isHovered,
    activeItem,
    openSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
    setActiveItem,
    toggleSubmenu,
  }

  provide(SidebarSymbol, context)

  return context
}

export function useSidebar(): SidebarContextType {
  const context = inject<SidebarContextType>(SidebarSymbol)
  if (!context) {
    throw new Error(
      'useSidebar must be used within a component that has SidebarProvider as an ancestor',
    )
  }
  return context
}
