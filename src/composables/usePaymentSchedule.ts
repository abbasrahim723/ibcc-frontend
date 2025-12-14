import { ref } from 'vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

export interface PaymentSchedule {
    id: number
    project_id: number | null
    payer_id: number | null
    payer_type: string
    amount: number
    currency: string
    method: string | null
    direction: 'incoming' | 'outgoing'
    title: string | null
    notes: string | null
    schedule_type: 'one_time' | 'recurring'
    frequency: 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'yearly' | null
    interval: number
    day_of_week: string[] | null
    day_of_month: number | null
    start_date: string
    end_date: string | null
    max_occurrences: number | null
    is_active: boolean
    last_generated_at: string | null
    next_due_date: string | null
    occurrences_count: number
    notification_channels: string[]
    created_by: number | null
    updated_by: number | null
    created_at: string
    updated_at: string
    project?: any
    payer?: any
    payments?: any[]
}

export interface ScheduleFilters {
    project_id?: number | string
    payer_id?: number | string
    payer_type?: string
    direction?: string
    schedule_type?: string
    frequency?: string
    is_active?: boolean
    status?: 'upcoming' | 'due' | 'ended'
    search?: string
}

export function usePaymentSchedule() {
    const toast = useToast()
    const schedules = ref<PaymentSchedule[]>([])
    const loading = ref(false)
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
        from: 0,
        to: 0
    })

    /**
     * Fetch payment schedules with filters
     */
    const fetchSchedules = async (filters: ScheduleFilters = {}, page = 1, withPayments = true) => {
        loading.value = true
        try {
            const params: any = {
                page,
                per_page: pagination.value.per_page,
                with_payments: withPayments,
                ...filters
            }

            const response = await api.get('/payment-schedules', { params })

            schedules.value = response.data.data
            pagination.value = {
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
                from: response.data.from,
                to: response.data.to
            }

            return response.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch schedules')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Get a single schedule by ID
     */
    const getSchedule = async (id: number) => {
        loading.value = true
        try {
            const response = await api.get(`/payment-schedules/${id}`)
            return response.data.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch schedule')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Create a new payment schedule
     */
    const createSchedule = async (data: Partial<PaymentSchedule>) => {
        loading.value = true
        try {
            const response = await api.post('/payment-schedules', data)
            toast.success('Payment schedule created successfully')
            return response.data.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create schedule'
            const errors = error.response?.data?.errors

            if (errors) {
                Object.values(errors).forEach((err: any) => {
                    toast.error(Array.isArray(err) ? err[0] : err)
                })
            } else {
                toast.error(message)
            }
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Update an existing schedule
     */
    const updateSchedule = async (id: number, data: Partial<PaymentSchedule>) => {
        loading.value = true
        try {
            const response = await api.put(`/payment-schedules/${id}`, data)
            toast.success('Payment schedule updated successfully')
            return response.data.data
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update schedule'
            const errors = error.response?.data?.errors

            if (errors) {
                Object.values(errors).forEach((err: any) => {
                    toast.error(Array.isArray(err) ? err[0] : err)
                })
            } else {
                toast.error(message)
            }
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Delete a schedule
     */
    const deleteSchedule = async (id: number) => {
        loading.value = true
        try {
            await api.delete(`/payment-schedules/${id}`)
            toast.success('Payment schedule deleted successfully')

            // Remove from local array
            schedules.value = schedules.value.filter(s => s.id !== id)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete schedule')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Toggle schedule active status
     */
    const toggleActive = async (id: number, isActive: boolean) => {
        loading.value = true
        try {
            const response = await api.post(`/payment-schedules/${id}/activate`, {
                is_active: isActive
            })
            toast.success(isActive ? 'Schedule activated' : 'Schedule deactivated')

            // Update local array
            const index = schedules.value.findIndex(s => s.id === id)
            if (index !== -1) {
                schedules.value[index].is_active = isActive
            }

            return response.data.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update schedule status')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Preview upcoming payment dates for a schedule
     */
    const previewDates = async (id: number, count = 10) => {
        loading.value = true
        try {
            const response = await api.get(`/payment-schedules/${id}/preview`, {
                params: { count }
            })
            return response.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to preview dates')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Preview dates for schedule configuration (before saving)
     */
    const previewConfiguration = async (config: any, count = 10) => {
        loading.value = true
        try {
            const response = await api.post('/payment-schedules/preview-configuration', {
                ...config,
                count
            })
            return response.data.dates
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to preview configuration')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Approve a scheduled payment
     */
    const approvePayment = async (paymentId: number, edits: any = {}) => {
        loading.value = true
        try {
            const response = await api.post(`/payments/${paymentId}/approve-scheduled`, edits)
            toast.success('Payment approved successfully')
            return response.data.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve payment')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Quick approve a scheduled payment (no edits)
     */
    const quickApprovePayment = async (paymentId: number) => {
        loading.value = true
        try {
            const response = await api.post(`/payments/${paymentId}/quick-approve`)
            toast.success('Payment approved successfully')
            return response.data.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve payment')
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Reject a scheduled payment
     */
    const rejectPayment = async (paymentId: number, reason?: string) => {
        loading.value = true
        try {
            const response = await api.post(`/payments/${paymentId}/reject-scheduled`, {
                rejection_reason: reason
            })
            toast.success('Payment rejected')
            return response.data.data
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject payment')
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        schedules,
        loading,
        pagination,
        fetchSchedules,
        getSchedule,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        toggleActive,
        previewDates,
        previewConfiguration,
        approvePayment,
        quickApprovePayment,
        rejectPayment
    }
}
