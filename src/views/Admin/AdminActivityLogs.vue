<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          System Activity Logs
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          View all user activities and system changes.
        </p>
      </div>

      <ActivityTimeline endpoint="/activity-logs" />
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ActivityTimeline from '@/components/activity/ActivityTimeline.vue'

const pageTitle = ref('Activity Logs')
</script>
