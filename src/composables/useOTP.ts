import { ref } from 'vue'
import api from '@/utils/axios'

interface OTPResponse {
    message: string
    expires_in?: number
    verified?: boolean
}

export function useOTP() {
    const isLoading = ref(false)
    const countdown = ref(0)
    const canResend = ref(true)

    let countdownInterval: number | null = null

    const startCountdown = (seconds: number) => {
        countdown.value = seconds
        canResend.value = false

        if (countdownInterval) {
            clearInterval(countdownInterval)
        }

        countdownInterval = window.setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                canResend.value = true
                if (countdownInterval) {
                    clearInterval(countdownInterval)
                }
            }
        }, 1000)
    }

    const sendOTP = async (email: string, type: string): Promise<OTPResponse> => {
        isLoading.value = true
        try {
            const response = await api.post<OTPResponse>('/otp/send', { email, type })

            // Start countdown timer (5 minutes = 300 seconds)
            if (response.data.expires_in) {
                startCountdown(response.data.expires_in)
            }

            return response.data
        } catch (error: any) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const verifyOTP = async (email: string, otpCode: string, type: string): Promise<OTPResponse> => {
        isLoading.value = true
        try {
            const response = await api.post<OTPResponse>('/otp/verify', {
                email,
                otp_code: otpCode,
                type,
            })
            return response.data
        } catch (error: any) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const cleanup = () => {
        if (countdownInterval) {
            clearInterval(countdownInterval)
        }
    }

    return {
        isLoading,
        countdown,
        canResend,
        sendOTP,
        verifyOTP,
        cleanup,
    }
}
