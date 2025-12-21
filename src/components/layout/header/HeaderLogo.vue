<template>
  <router-link to="/" class="hidden">
    <img class="dark:hidden h-8 w-auto" src="/images/logo/logo.svg" alt="Logo" />
    <img class="hidden dark:block h-8 w-auto" src="/images/logo/logo-dark.svg" alt="Logo" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
