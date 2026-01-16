<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Expense Categories" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div v-if="loading">
          <div class="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <h3 v-else class="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
        
        <div v-if="loading" class="flex flex-wrap gap-2">
          <div class="h-10 w-full sm:w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-14 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div v-else class="flex flex-wrap items-center gap-2">
          <input 
            v-model="newCategory.name" 
            type="text" 
            placeholder="Name" 
            class="w-full sm:w-auto flex-1 h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
          />
          <input 
            v-model="newCategory.color" 
            type="color" 
            class="h-10 w-14 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer" 
          />
          <button 
            @click="createCategory" 
            class="h-10 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors whitespace-nowrap"
          >
            Add Category
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Color</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Active</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              <tr v-if="loading" v-for="n in 5" :key="n" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3">
                  <div class="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-10 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="h-6 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
              </tr>
              <tr v-else-if="categories.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No categories yet.</td>
              </tr>
              <tr v-else v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white min-w-[200px]">
                  <input v-model="cat.name" @blur="updateCategory(cat)" class="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </td>
                <td class="px-4 py-3">
                  <input type="color" v-model="cat.color" @change="updateCategory(cat)" class="h-10 w-14 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" v-model="cat.is_active" @change="updateCategory(cat)" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <span>{{ cat.is_active ? 'Active' : 'Inactive' }}</span>
                  </label>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button @click="deleteCategory(cat.id)" class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const categories = ref<any[]>([])
const newCategory = ref({ name: '', color: '#3b82f6' })
const loading = ref(true)

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/expense-categories')
    categories.value = res.data?.data ?? res.data ?? []
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Failed to fetch categories')
  } finally {
    loading.value = false
  }
}

const createCategory = async () => {
  if (!newCategory.value.name) {
    toast.error('Please enter a category name')
    return
  }
  try {
    await api.post('/expense-categories', newCategory.value)
    newCategory.value = { name: '', color: '#3b82f6' }
    await fetchCategories()
    toast.success('Category added')
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Failed to add category')
  }
}

const updateCategory = async (cat: any) => {
  try {
    await api.put(`/expense-categories/${cat.id}`, {
      name: cat.name,
      color: cat.color,
      is_active: cat.is_active,
    })
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Failed to update category')
  }
}

const deleteCategory = async (id: number) => {
  try {
    await api.delete(`/expense-categories/${id}`)
    categories.value = categories.value.filter((c) => c.id !== id)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Failed to delete category')
  }
}

onMounted(fetchCategories)
</script>
