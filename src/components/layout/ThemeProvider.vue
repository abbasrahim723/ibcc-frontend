<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

type Theme = 'light' | 'dark' | 'system'

const authStore = useAuthStore()
const theme = ref<Theme>('system')
const isInitialized = ref(false)

const getSystemTheme = (): 'light' | 'dark' => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const getEffectiveTheme = (): 'light' | 'dark' => {
  if (theme.value === 'system') {
    return getSystemTheme()
  }
  return theme.value as 'light' | 'dark'
}

const isDarkMode = computed(() => getEffectiveTheme() === 'dark')

const toggleTheme = async () => {
  // Cycle through: light -> dark -> system
  if (theme.value === 'light') {
    theme.value = 'dark'
  } else if (theme.value === 'dark') {
    theme.value = 'system'
  } else {
    theme.value = 'light'
  }
  
  // Save to database
  try {
    await authStore.updatePreferences({ theme_mode: theme.value })
  } catch (error) {
    console.error('Failed to save theme preference:', error)
  }
}

const applyTheme = () => {
  const effectiveTheme = getEffectiveTheme()
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(async () => {
  // First, check if user has preferences in the store
  if (authStore.preferences?.theme_mode) {
    theme.value = authStore.preferences.theme_mode as Theme
  } else {
    // Check localStorage as fallback
    const savedTheme = localStorage.getItem('theme') as Theme | null
    theme.value = savedTheme || 'system'
  }
  
  isInitialized.value = true
  applyTheme()
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme()
    }
  })
})

watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
  if (newIsInitialized) {
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }
})

provide('theme', {
  isDarkMode,
  toggleTheme,
  theme,
})
</script>

<script lang="ts">
import { inject } from 'vue'

export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
