<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="isEditMode ? 'Edit Contract Type' : 'Create Contract Type'" />

    <!-- Loading Skeleton -->
    <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

      <div class="space-y-4">
        <!-- Name Field Skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Code Field Skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="mt-1 h-3 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Description Field Skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Sort Order Field Skeleton -->
        <div>
          <div class="mb-1.5 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <!-- Active Checkbox Skeleton -->
        <div>
          <div class="flex items-center">
            <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
            <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="mt-1 h-3 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      <!-- Action Buttons Skeleton -->
      <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-10 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>

    <!-- Actual Form -->
    <form v-else @submit.prevent="saveContractType">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Contract Type Information</h3>

        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g., Fixed Price"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Code</label>
            <input
              v-model="form.code"
              type="text"
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g., fixed_price (auto-generated if empty)"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave empty to auto-generate from name</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Brief description of this contract type"
            ></textarea>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Sort Order</label>
            <input
              v-model.number="form.sort_order"
              type="number"
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="0"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Lower numbers appear first</p>
          </div>

          <div>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-400">Active</span>
            </label>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Inactive contract types won't appear in dropdowns</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$router.push('/contract-types')"
            class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300"
          >
            {{ isEditMode ? 'Update Contract Type' : 'Create Contract Type' }}
          </button>
        </div>
      </div>
    </form>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditMode = computed(() => !!route.params.id)

const pageLoading = ref(true)

const form = ref({
  name: '',
  code: '',
  description: '',
  is_active: true,
  sort_order: 0,
})

const fetchContractType = async () => {
  if (!route.params.id) return

  try {
    const res = await api.get(`/contract-types/${route.params.id}`)
    const contractType = res.data

    form.value = {
      name: contractType.name || '',
      code: contractType.code || '',
      description: contractType.description || '',
      is_active: contractType.is_active ?? true,
      sort_order: contractType.sort_order || 0,
    }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching contract type')
    router.push('/contract-types')
  }
}

const saveContractType = async () => {
  try {
    if (isEditMode.value) {
      await api.put(`/contract-types/${route.params.id}`, form.value)
      toast.success('Contract type updated successfully')
    } else {
      await api.post('/contract-types', form.value)
      toast.success('Contract type created successfully')
    }

    router.push('/contract-types')
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error saving contract type')
  }
}

const loadData = async () => {
  try {
    pageLoading.value = true
    if (isEditMode.value) {
      await fetchContractType()
    }
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
