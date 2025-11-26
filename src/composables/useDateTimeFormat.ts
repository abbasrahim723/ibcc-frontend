import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useDateTimeFormat() {
    const authStore = useAuthStore()

    const userPreferences = computed(() => authStore.preferences || {})
    const timezone = computed(() => userPreferences.value.timezone || 'UTC')
    const dateFormat = computed(() => userPreferences.value.date_format || 'MMM DD, YYYY')
    const timeFormat = computed(() => userPreferences.value.time_format || '12')

    /**
     * Format a date string according to user preferences
     * @param dateString - ISO date string or Date object
     * @param includeTime - Whether to include time in the output (default: true)
     * @returns Formatted date/time string
     */
    const formatDateTime = (dateString: string | Date | null | undefined, includeTime: boolean = true): string => {
        if (!dateString) return ''

        const date = new Date(dateString)

        // Check if date is valid
        if (isNaN(date.getTime())) return ''

        // Format date based on user preference
        let formattedDate = ''
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const monthShort = date.toLocaleDateString('en-US', { month: 'short' })

        switch (dateFormat.value) {
            case 'DD/MM/YYYY':
                formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
                break
            case 'MM/DD/YYYY':
                formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`
                break
            case 'YYYY-MM-DD':
                formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                break
            case 'MMM DD, YYYY':
            default:
                formattedDate = `${monthShort} ${day}, ${year}`
                break
        }

        if (!includeTime) {
            return formattedDate
        }

        // Format time based on user preference
        let hours = date.getHours()
        const minutes = date.getMinutes()
        let formattedTime = ''

        if (timeFormat.value === '12') {
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12 || 12
            formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
        } else {
            // 24 hour format
            formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        }

        return `${formattedDate}, ${formattedTime}`
    }

    /**
     * Format only the date part (no time)
     */
    const formatDate = (dateString: string | Date | null | undefined): string => {
        return formatDateTime(dateString, false)
    }

    /**
     * Format only the time part
     */
    const formatTime = (dateString: string | Date | null | undefined): string => {
        if (!dateString) return ''

        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''

        let hours = date.getHours()
        const minutes = date.getMinutes()

        if (timeFormat.value === '12') {
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12 || 12
            return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
        } else {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        }
    }

    return {
        formatDateTime,
        formatDate,
        formatTime,
        dateFormat,
        timeFormat,
        timezone
    }
}
