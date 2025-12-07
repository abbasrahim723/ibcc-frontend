import { ref } from 'vue';
import api from '@/utils/axios';

const permissions = ref<string[]>([]);
const roles = ref<string[]>([]);
const allowedResources = ref<Record<string, any>>({});
const resourceActions = ref<Record<string, string[]>>({});
const loaded = ref(false); // Make loaded reactive!

export async function loadPermissions() {
    try {
        const res = await api.get('/permissions/my-permissions');
        permissions.value = res.data.permissions || [];
        roles.value = res.data.roles || [];
        allowedResources.value = res.data.allowed_resources || {};
        resourceActions.value = res.data.resource_actions || {};
        loaded.value = true; // Use .value for ref
        return res.data;
    } catch (e) {
        permissions.value = [];
        roles.value = [];
        allowedResources.value = {};
        resourceActions.value = {};
        loaded.value = true; // Use .value for ref
        return null;
    }
}

export function usePermissions() {
    const hasPermission = (perm: string) => {
        if (!loaded) return false;
        return permissions.value.includes(perm) || roles.value.includes('super-admin');
    };

    const can = (resource: string, action = 'view') => {
        if (!loaded) return false;
        if (permissions.value.includes('super-admin') || roles.value.includes('super-admin')) {
            return true;
        }
        const key = `${resource}.${action}`;
        if (permissions.value.includes(key)) return true;
        // primary: check resource_actions (array of allowed actions per resource)
        const actions = resourceActions.value[resource];
        if (Array.isArray(actions)) {
            return actions.includes(action);
        }

        // fallback: allowed_resources may be a boolean map of accessible resources
        const allowed = allowedResources.value[resource];
        if (allowed === true) return action === 'view' || action === 'index';

        return false;
    };

    const hasAnyPermission = (perms: string[]) => {
        if (!loaded) return false;
        return perms.some(perm => hasPermission(perm));
    };

    const hasAllPermissions = (perms: string[]) => {
        if (!loaded) return false;
        return perms.every(perm => hasPermission(perm));
    };

    const refresh = async () => {
        return await loadPermissions();
    };

    return {
        permissions,
        roles,
        allowedResources,
        resourceActions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        can,
        loadPermissions: loadPermissions,
        refresh,
    };
}
