import { defineStore } from 'pinia';
import api from '@/utils/axios';

export const useActivityLogStore = defineStore('activityLog', {
    state: () => ({
        logs: [] as any[],
        currentLog: null as any,
        loading: false,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
        },
    }),
    actions: {
        async fetchLogs(filters: any = {}) {
            this.loading = true;
            try {
                const params = new URLSearchParams();

                if (filters.user_id) params.append('user_id', filters.user_id);
                if (filters.action) params.append('action', filters.action);
                if (filters.model_type) params.append('model_type', filters.model_type);
                if (filters.start_date) params.append('start_date', filters.start_date);
                if (filters.end_date) params.append('end_date', filters.end_date);
                if (filters.page) params.append('page', filters.page);
                if (filters.per_page) params.append('per_page', filters.per_page);

                const response = await api.get(`/activity-logs?${params.toString()}`);
                this.logs = response.data.data;
                this.pagination = {
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                };
                return response;
            } catch (error) {
                console.error('Error fetching activity logs', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchLog(id: number) {
            this.loading = true;
            try {
                const response = await api.get(`/activity-logs/${id}`);
                this.currentLog = response.data;
                return response;
            } catch (error) {
                console.error('Error fetching activity log', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchUserLogs(userId: number, page = 1) {
            this.loading = true;
            try {
                const response = await api.get(`/users/${userId}/activity-logs?page=${page}`);
                this.logs = response.data.data;
                this.pagination = {
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                };
                return response;
            } catch (error) {
                console.error('Error fetching user activity logs', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    }
});
