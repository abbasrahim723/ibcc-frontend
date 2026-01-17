<template>
  <GenericSelect
    :modelValue="modelValue"
    :options="userOptions"
    :placeholder="placeholder"
    :loading="loading"
    searchable
    @update:modelValue="onUpdate"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import GenericSelect from './GenericSelect.vue'
import api from '@/utils/axios'

interface User {
  id: number
  name: string
  name_prefix?: string
  email: string
  profile_photo_url?: string
  role?: {
    name: string
    label?: string
  }
}

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select User'
  },
  users: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const internalUsers = ref<User[]>([])
const loading = ref(false)

const usersList = computed(() => {
  return props.users.length > 0 ? (props.users as User[]) : internalUsers.value
})

const userOptions = computed(() => {
  return usersList.value.map(user => {
    const prefix = user.name_prefix ? `${user.name_prefix} ` : ''
    const roleLabel = user.role?.label || user.role?.name || ''
    
    return {
      value: user.id,
      label: `${prefix}${user.name}`,
      subtitle: roleLabel,
      image: getPhotoUrl(user) || '' 
    }
  })
})

const onUpdate = (val: any) => {
  emit('update:modelValue', val)
}

const onChange = (val: any) => {
  const user = usersList.value.find(u => u.id === val)
  emit('change', user)
}

const fetchUsers = async () => {
  if (props.users.length > 0) return
  
  loading.value = true
  try {
    const res = await api.get('/admin/users', { params: { per_page: 100 } })
    internalUsers.value = res.data.data || res.data
  } catch (e) {
    console.error('Error fetching users', e)
  } finally {
    loading.value = false
  }
}

const getPhotoUrl = (user: User) => {
  const path = user.profile_photo_url
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

onMounted(() => {
  fetchUsers()
})
</script>
