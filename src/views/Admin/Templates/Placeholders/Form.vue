<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <!-- Loading Skeleton -->
    <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="space-y-6">
        <!-- Placeholder Key Field Skeleton -->
        <div>
          <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mt-1"></div>
        </div>

        <!-- Model Searchable Select Skeleton -->
        <div>
          <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Attribute Searchable Select Skeleton -->
        <div>
          <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Description Textarea Skeleton -->
        <div>
          <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
          <div class="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Status Checkbox Skeleton -->
        <div class="flex items-center">
          <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
          <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Action Buttons Skeleton -->
        <div class="flex justify-end gap-4">
          <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>

    <!-- Actual Form -->
    <div v-else class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <form @submit.prevent="savePlaceholder" class="space-y-6">
        <!-- Key -->
        <div>
          <label for="key" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Placeholder Key <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.key"
            @input="checkDuplicateKey"
            type="text"
            id="key"
            placeholder="%customer_name%"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
            :class="{ 'border-red-500 dark:border-red-500': keyExists }"
            required
          />
          <p v-if="keyExists" class="mt-1 text-xs text-red-600 dark:text-red-400">
            ⚠️ This placeholder key already exists
          </p>
          <p v-else class="mt-1 text-xs text-gray-500">Must start and end with % (e.g. %customer_name%)</p>
        </div>

        <!-- Model - Searchable -->
        <SearchableSelect
          v-model="form.model"
          :options="modelOptions"
          label="Model"
          placeholder="Search models..."
          required
          @update:modelValue="onModelChange"
        />

        <!-- Attribute - Searchable -->
        <SearchableSelect
          v-model="form.attribute"
          :options="attributeOptions"
          label="Attribute"
          :placeholder="loadingAttributes ? 'Loading attributes...' : (form.model ? 'Search attributes...' : 'Select a model first')"
          :disabled="!form.model || loadingAttributes"
          required
        />

        <!-- Description -->
        <div>
          <label for="description" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            v-model="form.description"
            id="description"
            rows="3"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
          ></textarea>
        </div>

        <!-- Status -->
        <div class="flex items-center">
          <input
            v-model="form.status"
            id="status"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-brand-600 focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-brand-600"
          />
          <label for="status" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <router-link
            to="/admin/templates/placeholders"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="isSaving || keyExists"
            class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving...' : (isEditing ? 'Update Placeholder' : 'Create Placeholder') }}
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SearchableSelect from '@/components/forms/SearchableSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => route.params.id !== undefined)
const pageTitle = computed(() => isEditing.value ? 'Edit Placeholder' : 'Create Placeholder')
const isSaving = ref(false)
const keyExists = ref(false)
const checkDuplicateTimeout = ref<any>(null)

const models = ref<any[]>([])
const attributes = ref<any[]>([])
const loadingAttributes = ref(false)
const pageLoading = ref(true)

const form = ref({
  key: '',
  model: '',
  table: '',
  attribute: '',
  description: '',
  status: true
})

// Convert models to options format
const modelOptions = computed(() => {
  return models.value.map(model => ({
    value: model.name,
    label: model.display_name
  }))
})

// Convert attributes to options format
const attributeOptions = computed(() => {
  return attributes.value.map(attr => ({
    value: attr.name,
    label: attr.display_name
  }))
})

const fetchModels = async () => {
  try {
    const response = await api.get('/models')
    models.value = response.data
  } catch (error) {
    toast.error('Error fetching models')
  }
}

const fetchAttributes = async (modelName: string) => {
  loadingAttributes.value = true
  try {
    const response = await api.get('/models/attributes', {
      params: { model: modelName }
    })
    attributes.value = response.data.attributes
    form.value.table = response.data.table
  } catch (error) {
    toast.error('Error fetching model attributes')
    attributes.value = []
  } finally {
    loadingAttributes.value = false
  }
}

const onModelChange = () => {
  form.value.attribute = ''
  form.value.table = ''
  attributes.value = []

  if (form.value.model) {
    fetchAttributes(form.value.model)
  }
}

const checkDuplicateKey = () => {
  if (checkDuplicateTimeout.value) {
    clearTimeout(checkDuplicateTimeout.value)
  }

  checkDuplicateTimeout.value = setTimeout(async () => {
    if (!form.value.key) {
      keyExists.value = false
      return
    }

    try {
      const response = await api.get('/placeholders/check-duplicate', {
        params: {
          key: form.value.key,
          exclude_id: isEditing.value ? route.params.id : null
        }
      })
      keyExists.value = response.data.exists
    } catch (error) {
      // Ignore errors in duplicate check
    }
  }, 500)
}

const fetchPlaceholder = async (id: string) => {
  try {
    const response = await api.get(`/placeholders/${id}`)
    const data = response.data
    form.value = {
      key: data.key,
      model: data.model,
      table: data.table || '',
      attribute: data.attribute,
      description: data.description || '',
      status: data.status
    }

    if (data.model) {
      await fetchAttributes(data.model)
    }
  } catch (error) {
    toast.error('Error fetching placeholder details')
    router.push('/admin/templates/placeholders')
  }
}

const savePlaceholder = async () => {
  console.log('Save placeholder called')

  if (!form.value.key.startsWith('%') || !form.value.key.endsWith('%')) {
    toast.error('Key must start and end with %')
    return
  }

  if (keyExists.value) {
    toast.error('This placeholder key already exists')
    return
  }

  isSaving.value = true
  console.log('Starting save...', form.value)

  try {
    let response
    if (isEditing.value) {
      response = await api.put(`/placeholders/${route.params.id}`, form.value)
      console.log('Update response:', response)
      toast.success('Placeholder updated successfully')
    } else {
      response = await api.post('/placeholders', form.value)
      console.log('Create response:', response)
      toast.success('Placeholder created successfully')
    }

    console.log('About to redirect...')
    await router.push('/admin/templates/placeholders')
    console.log('Redirected')
  } catch (error: any) {
    console.error('Save error:', error)
    if (error.response?.status === 422) {
      const errors = error.response.data.errors
      const firstError = Object.values(errors)[0] as string[]
      toast.error(firstError[0])
    } else {
      toast.error(error.response?.data?.message || 'Error saving placeholder')
    }
  } finally {
    isSaving.value = false
    console.log('Save complete, isSaving:', isSaving.value)
  }
}

const loadData = async () => {
  try {
    await fetchModels()

    if (isEditing.value) {
      await fetchPlaceholder(route.params.id as string)
    }
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  loadData()
})
</script>
