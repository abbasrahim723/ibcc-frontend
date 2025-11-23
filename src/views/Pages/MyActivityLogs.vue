<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          My Activity History
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          View a timeline of your actions and changes within the system.
        </p>
      </div>

      <ActivityTimeline :userId="authStore.user?.id" />
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ActivityTimeline from '@/components/activity/ActivityTimeline.vue'

const authStore = useAuthStore()
const pageTitle = ref('My Activity Logs')
</script>
