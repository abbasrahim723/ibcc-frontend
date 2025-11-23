import { defineStore } from 'pinia';
import api from '@/utils/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        preferences: null as any,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token')
    }),
    actions: {
        async login(credentials: any) {
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
            this.preferences = null;
            this.isAuthenticated = false;
            localStorage.removeItem('token');
            router.push('/signin');
        },
        async fetchUser() {
            try {
                const response = await api.get('/user');
                this.user = response.data;
                this.preferences = response.data.preferences;
            } catch (error) {
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
            }
        },
        async updateProfile(data: any) {
            const response = await api.put('/profile', data);
            this.user = response.data.user;
            return response;
        },
        async uploadProfilePhoto(file: File) {
            const formData = new FormData();
            formData.append('photo', file);
            const response = await api.post('/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await this.fetchUser();
            return response;
        },
        async deleteProfilePhoto() {
            const response = await api.delete('/profile/photo');
            await this.fetchUser();
            return response;
        },
        async updatePassword(data: any) {
            const response = await api.put('/profile/password', data);
            return response;
        },
        async fetchPreferences() {
            try {
                const response = await api.get('/preferences');
                this.preferences = response.data;
                return response;
            } catch (error) {
                console.error('Error fetching preferences', error);
            }
        },
        async updatePreferences(data: any) {
            const response = await api.put('/preferences', data);
            this.preferences = response.data.preferences;
            return response;
        },
        async updateSocialLinks(socialLinks: any) {
            const response = await api.put('/preferences/social-links', {
                social_links: socialLinks,
            });
            this.preferences = response.data;
            return response;
        },
    }
});
