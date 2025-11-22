import { defineStore } from 'pinia';
import api from '@/utils/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token')
    }),
    actions: {
        async login(credentials: any) {
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post('/login', credentials);
            this.token = response.data.access_token || response.data.token;
            this.user = response.data.user;
            this.isAuthenticated = true;
            if (this.token) {
                localStorage.setItem('token', this.token);
            }
            return response;
        },
        async register(userData: any) {
            const response = await api.post('/register', userData);
            return response;
        },
        async logout() {
            try {
                await api.post('/logout');
            } catch (e) {
                console.error(e);
            }
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        async fetchUser() {
            try {
                const response = await api.get('/user');
                this.user = response.data;
            } catch (error) {
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
            }
        },
        async updateProfile(data: any) {
            const response = await api.put('/profile', data)
            this.user = response.data
            return response
        },
    }
});
