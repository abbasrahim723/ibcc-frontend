import { defineStore } from 'pinia';
import api from '@/utils/axios';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        users: [] as any[],
        roles: [] as any[],
        permissions: [] as any[],
        loading: false,
    }),
    actions: {
        async fetchUsers(page = 1) {
            this.loading = true;
            try {
                const response = await api.get(`/users?page=${page}`);
                this.users = response.data.data;
                return response.data;
            } catch (error) {
                console.error('Error fetching users', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createUser(userData: any) {
            const response = await api.post('/users', userData);
            await this.fetchUsers();
            return response;
        },
        async updateUser(id: number, userData: any) {
            const response = await api.put(`/users/${id}`, userData);
            await this.fetchUsers();
            return response;
        },
        async deleteUser(id: number) {
            const response = await api.delete(`/users/${id}`);
            await this.fetchUsers();
            return response;
        },
        async fetchRoles() {
            try {
                const response = await api.get('/roles');
                this.roles = response.data;
                return response;
            } catch (error) {
                console.error('Error fetching roles', error);
                throw error;
            }
        },
        async createRole(roleData: any) {
            const response = await api.post('/roles', roleData);
            await this.fetchRoles();
            return response;
        },
        async updateRole(id: number, roleData: any) {
            const response = await api.put(`/roles/${id}`, roleData);
            await this.fetchRoles();
            return response;
        },
        async deleteRole(id: number) {
            const response = await api.delete(`/roles/${id}`);
            await this.fetchRoles();
            return response;
        },
        async fetchPermissions() {
            try {
                const response = await api.get('/permissions');
                this.permissions = response.data;
                return response;
            } catch (error) {
                console.error('Error fetching permissions', error);
                throw error;
            }
        },
        async assignRole(userId: number, role: string) {
            const response = await api.post(`/users/${userId}/roles`, { role });
            await this.fetchUsers();
            return response;
        },
        async revokeRole(userId: number, role: string) {
            const response = await api.delete(`/users/${userId}/roles/${role}`);
            await this.fetchUsers();
            return response;
        },
    }
});
