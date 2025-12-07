<template>
  <admin-layout>
    <PageBreadcrumb
      :pageTitle="getFullName(customer) || 'Customer Details'"
      :breadcrumbs="[
        { label: 'Home', to: '/' },
        { label: 'Customers', to: '/customers' },
        { label: getFullName(customer) || 'Customer Details' }
      ]"
    />

    <div v-if="loading" class="flex justify-center py-10">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
    </div>

    <div v-else-if="customer" class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- Left Column: Profile Card -->
      <div class="xl:col-span-1">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex flex-col items-center">
            <!-- Profile Photo -->
            <div class="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-700">
              <img
                v-if="customer.profile_photo_url"
                :src="getProfilePhotoUrl(customer.profile_photo_url)"
                alt="Profile Photo"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-gray-100 text-4xl font-bold text-gray-400 dark:bg-gray-800">
                {{ customer.name.charAt(0).toUpperCase() }}
              </div>
              <!-- Upload Icon -->
              <button
                @click="triggerPhotoUpload"
                class="absolute bottom-0 right-0 rounded-full bg-brand-600 p-2.5 text-white shadow-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 z-10"
                title="Upload Photo"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handlePhotoUpload"
              />
            </div>

            <h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">{{ getFullName(customer) }}</h3>
            <a
              v-if="customer.email"
              :href="`mailto:${customer.email}`"
              class="mb-6 flex items-center justify-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ customer.email }}
            </a>
            <p v-else class="mb-6 text-sm text-gray-500 dark:text-gray-400">No email provided</p>

            <!-- Contact Info -->
            <div class="w-full space-y-4">
              <a
                v-if="customer.phone_primary"
                :href="`tel:${customer.phone_primary}`"
                class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Primary Phone</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.phone_primary }}</p>
                </div>
              </a>
              <div v-else class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Primary Phone</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">N/A</p>
                </div>
              </div>

              <a
                v-if="customer.whatsapp_number"
                :href="`https://wa.me/${customer.whatsapp_number.replace(/[^0-9]/g, '')}`"
                target="_blank"
                class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.whatsapp_number }}</p>
                </div>
              </a>
              <div v-else class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">N/A</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">CNIC</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.cnic_number || 'N/A' }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.address || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Tabs and Content -->
      <div class="xl:col-span-2">
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Tabs -->
          <div class="border-b border-gray-200 px-6 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.name"
                @click="handleTabClick(tab.name)"
                :class="[
                  currentTab === tab.name
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Documents Tab -->
            <div v-if="currentTab === 'documents'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">All Documents</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ allDocuments.length }} total</p>
              </div>

              <div v-if="allDocuments.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="doc in allDocuments"
                  :key="doc.id"
                  class="group relative flex flex-col rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <!-- Preview/Icon -->
                  <div class="flex h-32 items-center justify-center overflow-hidden rounded-t-lg bg-gray-50 dark:bg-gray-900">
                    <img
                      v-if="isImageFile(doc)"
                      :src="getDocumentUrl(doc)"
                      class="h-full w-full object-cover"
                      alt="Document Preview"
                    />
                    <div v-else-if="isPdfFile(doc)" class="flex flex-col items-center justify-center">
                      <svg class="h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M9 13h6M9 17h6M9 9h1" fill="none" stroke="white" stroke-width="1"/>
                      </svg>
                      <p class="mt-2 text-xs text-gray-500">PDF</p>
                    </div>
                    <svg v-else class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <!-- Info -->
                  <div class="flex flex-1 flex-col p-4">
                    <h5 class="mb-1 text-sm font-medium text-gray-900 dark:text-white" :title="doc.name">{{ truncate(doc.name, 20) }}</h5>
                    <div class="mb-2 flex items-center justify-between">
                      <span class="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ doc.document_category || 'Other' }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatFileSize(doc.file_size) }}</span>
                    </div>
                    <div v-if="doc.source" class="mb-3 text-xs text-gray-500 dark:text-gray-400">
                      <span class="font-medium">Source:</span> {{ doc.source }}
                    </div>

                    <div class="mt-auto flex gap-2">
                      <button
                        @click="handlePreview(doc)"
                        :class="[
                          'flex-1 flex items-center justify-center rounded-md p-2.5',
                          can('documents', 'view')
                            ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 dark:bg-gray-800 dark:text-gray-600'
                        ]"
                        title="Preview"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDownload(doc)"
                        :class="[
                          'flex-1 flex items-center justify-center rounded-md p-2.5',
                          can('documents', 'download')
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 dark:bg-gray-800 dark:text-gray-600'
                        ]"
                        title="Download"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <div class="relative">
                        <button
                          @click="handleShare(doc.id)"
                          :class="[
                            'flex items-center justify-center rounded-md p-2.5',
                            can('documents', 'share')
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 dark:bg-gray-800 dark:text-gray-600'
                          ]"
                          title="Share"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <!-- Share Dropdown -->
                        <div
                          v-if="activeShareDropdown === doc.id"
                          class="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                        >
                          <div class="py-1">
                            <button
                              @click="shareViaWhatsApp(doc)"
                              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg class="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                              WhatsApp
                            </button>
                            <button
                              @click="shareViaEmail(doc)"
                              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Email
                            </button>
                            <button
                              @click="copyLink(doc)"
                              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">No documents</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No documents found for this customer or their projects.</p>
              </div>
            </div>

            <!-- Activity Log Tab -->
            <div v-else-if="currentTab === 'activity'" class="space-y-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Activity History</h4>

              <div v-if="activities.length > 0" class="flow-root">
                <ul role="list" class="-mb-8">
                  <li v-for="(activity, activityIdx) in activities" :key="activity.id">
                    <div class="relative pb-8">
                      <span v-if="activityIdx !== activities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      <div class="relative flex space-x-3">
                        <div>
                          <span :class="[
                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                            getActivityColor(activity.action)
                          ]">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIcon(activity.action)" />
                            </svg>
                          </span>
                        </div>
                        <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ activity.description }} <span class="font-medium text-gray-900 dark:text-white">by {{ activity.user?.name || 'System' }}</span>
                            </p>
                          </div>
                          <div class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                            <time :datetime="activity.created_at">{{ formatDate(activity.created_at) }}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="text-center text-sm text-gray-500 dark:text-gray-400">
                No activity recorded yet.
              </div>
            </div>

            <!-- Transactions Tab -->
            <div v-else-if="currentTab === 'transactions'" class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Payment Transactions</h4>
              <div v-if="customerPayments.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No payment transactions found for this customer.</p>
              </div>
              <div v-else class="space-y-3">
                <div 
                  v-for="payment in customerPayments" 
                  :key="payment.id" 
                  class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">
                          Payment #{{ payment.id }}
                        </h5>
                        <span 
                          :class="[
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                            payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          ]"
                        >
                          {{ payment.status || 'N/A' }}
                        </span>
                      </div>
                      
                      <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div v-if="payment.project" class="flex items-center gap-1">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span class="font-medium">Project:</span>
                          <router-link :to="`/projects/${payment.project.id}`" class="text-brand-600 hover:underline dark:text-brand-400">
                            {{ payment.project.name }}
                          </router-link>
                        </div>
                        
                        <div class="flex items-center gap-1">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span class="font-medium">Method:</span> {{ payment.method || 'N/A' }}
                        </div>
                        
                        <div v-if="payment.reference" class="flex items-center gap-1">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          <span class="font-medium">Reference:</span> {{ payment.reference }}
                        </div>
                        
                        <div class="flex items-center gap-1">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="font-medium">Date:</span> {{ formatDate(payment.payment_date || payment.created_at) }}
                        </div>
                        
                        <div v-if="payment.notes" class="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
                          {{ payment.notes }}
                        </div>

                        <div class="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                          <div v-if="payment.received_by" class="flex items-center gap-1">
                            <span class="font-medium">Received by:</span>
                            <span class="flex items-center gap-1">
                               {{ payment.received_by.name }}
                            </span>
                          </div>
                          <div v-if="payment.approved_by" class="flex items-center gap-1">
                            <span class="font-medium">Approved by:</span>
                            <span class="flex items-center gap-1">
                               {{ payment.approved_by.name }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="text-right">
                      <div class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ formatCurrency(payment.amount) }}
                      </div>
                      <div v-if="payment.currency" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ payment.currency }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects Tab -->
            <div v-else-if="currentTab === 'projects'" class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Projects</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ customerProjects.length }} total</p>
              </div>
              
              <div v-if="customerProjects.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This customer doesn't have any projects yet.</p>
              </div>
              
              <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <router-link 
                  v-for="proj in customerProjects" 
                  :key="proj.id" 
                  :to="`/projects/${proj.id}`"
                  class="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <!-- Project Thumbnail/Header -->
                  <div class="relative h-32 bg-gradient-to-br from-brand-500 to-brand-700 overflow-hidden">
                    <img 
                      v-if="getProjectThumbnail(proj)" 
                      :src="getProjectThumbnail(proj)" 
                      :alt="proj.name"
                      class="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center">
                      <svg class="h-16 w-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    
                    <!-- Status Badge -->
                    <div class="absolute top-3 right-3">
                      <span :class="[
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                        proj.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      ]">
                        {{ proj.status || 'Active' }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Project Info -->
                  <div class="p-4">
                    <h5 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {{ proj.name }}
                    </h5>
                    
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div v-if="proj.plot_number" class="flex items-center gap-2">
                        <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <span class="truncate">Plot: {{ proj.plot_number }}</span>
                      </div>
                      
                      <div v-if="proj.address" class="flex items-center gap-2">
                        <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="truncate">{{ truncate(proj.address, 40) }}</span>
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{{ formatDate(proj.created_at) }}</span>
                      </div>
                      
                      <div v-if="proj.contract_value" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Contract Value</span>
                          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(proj.contract_value) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closePreviewModal"
    >
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closePreviewModal"></div>

        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden z-50">
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ previewDoc?.name }}</h3>
            <button @click="closePreviewModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
            <img
              v-if="previewDoc && getFileIcon(previewDoc) === 'image'"
              :src="previewUrl"
              :alt="previewDoc.name"
              class="max-w-full h-auto mx-auto"
            />
            <iframe
              v-else-if="previewDoc && getFileIcon(previewDoc) === 'pdf'"
              :src="previewUrl"
              class="w-full h-[70vh]"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { can } = usePermissions()
const loading = ref(true)
const customer = ref<any>(null)
const activities = ref<any[]>([])
const currentTab = ref('documents')

const tabs = [
  { name: 'documents', label: 'Documents' },
  { name: 'activity', label: 'Activity Log' },
  { name: 'transactions', label: 'Transactions' },
  { name: 'projects', label: 'Projects' },
]

const customerProjects = ref<any[]>([])
const customerPayments = ref<any[]>([])

// Preview Modal State
const showPreviewModal = ref(false)
const previewDoc = ref<any>(null)
const previewUrl = ref('')
const photoInput = ref<HTMLInputElement | null>(null)
const activeShareDropdown = ref<number | null>(null)

// Computed property to aggregate all documents from customer, projects, and payments
const allDocuments = computed(() => {
  const docs: any[] = []
  
  // Customer documents
  if (customer.value?.documents) {
    customer.value.documents.forEach((doc: any) => {
      docs.push({ ...doc, source: 'Customer' })
    })
  }
  
  // Project documents
  if (customer.value?.projects) {
    customer.value.projects.forEach((project: any) => {
      if (project.documents) {
        project.documents.forEach((doc: any) => {
          docs.push({ ...doc, source: `Project: ${project.name}` })
        })
      }
      
      // Payment documents from projects
      if (project.payments) {
        project.payments.forEach((payment: any) => {
          if (payment.documents) {
            payment.documents.forEach((doc: any) => {
              docs.push({ ...doc, source: `Payment #${payment.id} (${project.name})` })
            })
          }
        })
      }
    })
  }
  
  return docs
})

const getProjectThumbnail = (project: any) => {
  if (!project) return ''
  // Look for thumbnail in project documents
  const thumbnail = project.documents?.find((d: any) => 
    (d.document_category || '').toLowerCase().includes('thumbnail') || 
    (d.document_category || '').toLowerCase().includes('thumb')
  )
  if (thumbnail) {
    return getDocumentUrl(thumbnail)
  }
  return ''
}


const getFullName = (customer: any) => {
  if (!customer) return ''
  const prefix = customer.name_prefix ? `${customer.name_prefix} ` : ''
  return `${prefix}${customer.name}`
}

const triggerPhotoUpload = () => {
  photoInput.value?.click()
}

const handlePhotoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image size should be less than 2MB')
    return
  }

  try {
    const formData = new FormData()
    formData.append('profile_photo', file)
    formData.append('name', customer.value.name) // Include name to pass validation
    formData.append('_method', 'PUT')

    const response = await api.post(`/customers/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    toast.success('Profile photo updated successfully')
    await fetchCustomer()
  } catch (error: any) {
    toast.error('Error uploading photo')
  }
}

const toggleShareDropdown = (docId: number) => {
  activeShareDropdown.value = activeShareDropdown.value === docId ? null : docId
}

const shareViaWhatsApp = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const text = `Check out this document: ${document.name}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    activeShareDropdown.value = null
    toast.success('Opening WhatsApp...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const shareViaEmail = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const subject = `Document: ${document.name}`
    const body = `I'm sharing this document with you:\\n\\n${document.name}\\n\\n${url}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    activeShareDropdown.value = null
    toast.success('Opening email client...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const copyLink = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    await navigator.clipboard.writeText(url)
    activeShareDropdown.value = null
  } catch (error: any) {
    toast.error('Error copying link')
  }
}

const handleTabClick = async (tabName: string) => {
  currentTab.value = tabName
  // Refresh data when switching tabs
  if (tabName === 'documents') {
    await fetchCustomer()
  } else if (tabName === 'activity') {
    await fetchActivities()
  } else if (tabName === 'transactions') {
    await fetchCustomerPayments()
  } else if (tabName === 'projects') {
    await fetchCustomerProjects()
  }
}

const getDocumentUrl = (doc: any): string => {
  if (!doc?.file_path && !doc?.url && !doc?.file_path) return ''
  const candidate = doc.url || doc.file_path || doc.file_path
  if (!candidate) return ''
  if (candidate.startsWith('http')) return candidate
  
  // Get base URL and remove /api suffix if present
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = candidate.startsWith('/') ? candidate : `/storage/${candidate}`
  return `${base}${relative}`
}

const fetchCustomer = async () => {
  try {
    const response = await api.get(`/customers/${route.params.id}/details`)
    customer.value = response.data.customer
  } catch (error: any) {
    toast.error('Error fetching customer details')
  }
}


const fetchActivities = async () => {
  try {
    const response = await api.get(`/customers/${route.params.id}/activities`)
    activities.value = response.data
  } catch (error: any) {
    console.error('Error fetching activities:', error)
  }
}

const getProfilePhotoUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  // Get base URL and remove /api suffix if present
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

const getFileIcon = (document: any): string => {
  if (document.mime_type?.startsWith('image/')) return 'image'
  if (document.mime_type === 'application/pdf') return 'pdf'
  return 'file'
}

const isImageFile = (document: any): boolean => {
  return document.mime_type?.startsWith('image/') || false
}

const isPdfFile = (document: any): boolean => {
  return document.mime_type === 'application/pdf'
}


const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Permission handlers
const handlePreview = (doc: any) => {
  if (!can('documents', 'view')) {
    toast.error('You are not authorized to view documents')
    return
  }
  previewDocument(doc)
}

const handleDownload = (doc: any) => {
  if (!can('documents', 'download')) {
    toast.error('You are not authorized to download documents')
    return
  }
  downloadDocument(doc)
}

const handleShare = (docId: number) => {
  if (!can('documents', 'share')) {
    toast.error('You are not authorized to share documents')
    return
  }
  toggleShareDropdown(docId)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncate = (s: string | undefined, n = 80) => {
  if (!s) return ''
  return s.length > n ? s.substring(0, n - 1) + '…' : s
}

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return '—'
  const num = Number(value) || 0
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(num)
  return `₨ ${formatted}`
}

const fetchCustomerProjects = async () => {
  try {
    const res = await api.get('/projects', { params: { customer_id: route.params.id } })
    customerProjects.value = res.data.data || res.data
  } catch (e: any) {
    console.error('Error fetching customer projects', e)
  }
}

const fetchCustomerPayments = async () => {
  try {
    const res = await api.get('/payments', { params: { customer_id: route.params.id } })
    customerPayments.value = res.data.data || res.data
  } catch (e: any) {
    console.error('Error fetching customer payments', e)
  }
}

const getActivityColor = (action: string): string => {
  switch (action) {
    case 'created': return 'bg-green-500'
    case 'updated': return 'bg-blue-500'
    case 'deleted': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getActivityIcon = (action: string): string => {
  switch (action) {
    case 'created': return 'M12 4v16m8-8H4'
    case 'updated': return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    case 'deleted': return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const previewDocument = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    previewUrl.value = response.data.url
    previewDoc.value = document
    showPreviewModal.value = true
  } catch (error: any) {
    toast.error('Error loading preview')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDoc.value = null
  previewUrl.value = ''
}

const downloadDocument = async (document: any) => {
  try {
    const response = await api.get(`/documents/${document.id}/download`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = window.document.createElement('a')
    link.href = url
    link.setAttribute('download', document.name)
    window.document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    toast.success('Document downloaded successfully')
  } catch (error: any) {
    toast.error('Error downloading document')
  }
}

onMounted(async () => {
  if (!can('customers', 'view_details')) {
    toast.error('You are not authorized to view customer details')
    router.push('/customers')
    return
  }

  loading.value = true
  await Promise.all([fetchCustomer(), fetchActivities()])
  loading.value = false
})
</script>
