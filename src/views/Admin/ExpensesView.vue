<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Expenses" />
    <PaymentsTable :expenses-only="true" />
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PaymentsTable from './PaymentsView.vue'
</script>
