<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <!-- Top Row: Title & View Toggle -->
      <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <div v-if="loading" class="flex items-center gap-3">
           <div class="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
         </div>
         <div v-else class="flex items-center gap-3">
           <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Document Management</h3>
           <!-- View Mode Toggle -->
           <div class="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
             <button
               @click="setViewMode('table')"
               :class="[
                 'rounded-md p-1.5 transition-colors',
                 viewMode === 'table'
                   ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400'
                   : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               ]"
               title="Table View"
             >
               <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
             <button
               @click="setViewMode('grid')"
               :class="[
                 'rounded-md p-1.5 transition-colors',
                 viewMode === 'grid'
                   ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400'
                   : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               ]"
               title="Grid View"
             >
               <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
               </svg>
             </button>
           </div>
         </div>
      </div>

      <!-- Bottom Row: Filters -->
      <div class="mb-6">
        <div v-if="loading" class="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <div class="h-10 w-full sm:w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-full sm:w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-full sm:w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-full sm:w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div v-else class="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
             <input
              v-model="searchQuery"
              type="text"
              placeholder="Search documents..."
              class="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              @input="fetchDocuments(1)"
            />
             <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
               <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

           <!-- Date Range -->
          <div class="relative w-full sm:w-56 group">
             <DateRangePicker v-model="dateRange" @change="fetchDocuments(1)" />
             <button
               v-if="dateRange"
               @click="dateRange = ''; fetchDocuments(1)"
               class="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               title="Clear date filter"
             >
               <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>

          <!-- Category Filter -->
          <GenericSelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="📂 All Categories"
            class="w-full sm:w-[180px]"
            @change="fetchDocuments(1)"
          />

           <!-- Model Filter -->
          <GenericSelect
            v-model="selectedModel"
            :options="modelOptions"
            placeholder="📂 All Models"
            class="w-full sm:w-[250px]"
            @change="fetchDocuments(1)"
          />
        </div>
      </div>

      <!-- Documents Table -->
      <div v-if="viewMode === 'table'" class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[250px]">File Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[150px]">Belongs To</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[80px]">Size</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Uploaded By</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              <tr v-if="loading" v-for="n in 8" :key="n" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-4">
                  <div class="flex items-center max-w-[250px]">
                    <div class="flex-shrink-0 mr-3 h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="min-w-0 flex-1">
                      <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                      <div class="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="inline-flex gap-2">
                    <div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="documents.length === 0">
                <td colspan="7" class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No documents found
                </td>
              </tr>
              <tr v-else v-for="document in documents" :key="document.id">
                <td class="px-4 py-4">
                  <div class="flex items-center max-w-[250px]">
                    <!-- File Icon -->
                    <div class="flex-shrink-0 mr-3">
                      <svg v-if="getFileIcon(document) === 'image'" class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <svg v-else-if="getFileIcon(document) === 'pdf'" class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <!-- Video Icon -->
                      <svg v-else-if="getFileIcon(document) === 'video'" class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <!-- Audio Icon -->
                      <svg v-else-if="getFileIcon(document) === 'audio'" class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <svg v-else class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1 overflow-hidden">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate" :title="document.name">{{ truncate(document.name, 20) }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ document.file_type?.toUpperCase() }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="max-w-[150px]">
                    <router-link
                      v-if="document.documentable && linkFor(document)"
                      :to="linkFor(document) as string"
                      class="text-sm text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 truncate block"
                      :title="getDocumentOwner(document)"
                    >
                      {{ getDocumentOwner(document) }}
                    </router-link>
                    <div v-else class="text-sm text-gray-900 dark:text-white truncate" :title="getDocumentOwner(document)">
                      {{ getDocumentOwner(document) }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span v-if="document.document_category" class="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ document.document_category }}
                  </span>
                  <span v-else class="text-xs text-gray-400">N/A</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatFileSize(document.file_size) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="max-w-[120px] truncate" :title="document.uploader?.name || 'Unknown'">
                    {{ document.uploader?.name || 'Unknown' }}
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(document.created_at) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <!-- Preview Button -->
                    <button
                      v-if="canPreview(document)"
                      @click="handlePreview(document)"
                      :disabled="loadingDocumentId === document.id"
                      :class="[
                        'p-1.5 rounded-md transition-colors',
                        can('documents', 'view')
                          ? 'text-purple-600 hover:text-purple-900 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 cursor-pointer'
                          : 'text-gray-300 cursor-not-allowed dark:text-gray-600',
                        loadingDocumentId === document.id ? 'opacity-75 cursor-wait' : ''
                      ]"
                      title="Preview"
                    >
                      <svg v-if="loadingDocumentId === document.id" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>



                    <!-- Share Dropdown -->
                    <div class="relative">
                      <button
                        @click.stop="handleShare(document.id)"
                        :class="[
                          'p-1.5 rounded-md transition-colors',
                          can('documents', 'share')
                            ? 'text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30 cursor-pointer'
                            : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                        ]"
                        title="Share"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>

                      <!-- Share Dropdown Menu -->
                      <div
                        v-if="activeShareDropdown === document.id"
                        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                      >
                        <div class="py-1">
                          <button
                            @click="shareViaWhatsApp(document)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <svg class="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </button>
                          <button
                            @click="shareViaEmail(document)"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </button>
                          <button
                            @click="copyLink(document)"
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

                    <!-- Download Button -->
                    <!-- Download Button -->
                    <button
                      @click="handleDownload(document)"
                      :class="[
                        'p-1.5 rounded-md transition-colors',
                        can('documents', 'download')
                          ? 'text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 dark:hover:bg-brand-900/30 cursor-pointer'
                          : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                      ]"
                      title="Download"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click="handleDelete(document)"
                      :class="[
                        'p-1.5 rounded-md transition-colors',
                        can('documents', 'delete')
                          ? 'text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer'
                          : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                      ]"
                      title="Delete"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="documents.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No documents found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Documents Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <!-- Grid Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="n in 8" :key="n" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 animate-pulse">
            <div class="flex flex-col items-center">
              <div class="h-24 w-24 rounded-lg bg-gray-200 dark:bg-gray-700 mb-3"></div>
              <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div class="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
              <div class="flex gap-2">
                <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="documents.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No documents found matching your criteria.</p>
        </div>

        <!-- Grid Cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="document in documents"
            :key="document.id"
            class="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600"
          >
            <div class="flex flex-col items-center text-center">
              <!-- File Icon / Thumbnail -->
              <div class="mb-3 relative">
                <div class="h-24 w-24 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <!-- Image Thumbnail -->
                  <img
                    v-if="getFileIcon(document) === 'image' && getDocumentThumbnailUrl(document)"
                    :src="getDocumentThumbnailUrl(document)"
                    :alt="document.name"
                    class="h-full w-full object-cover"
                    @error="($event.target as HTMLImageElement).style.display = 'none'; ($event.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')"
                  />
                  <!-- Fallback icons -->
                  <svg v-if="getFileIcon(document) === 'image'" class="hidden h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="getFileIcon(document) === 'pdf'" class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <!-- Video Icon -->
                  <svg v-else-if="getFileIcon(document) === 'video'" class="h-12 w-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <!-- Audio Icon -->
                  <svg v-else-if="getFileIcon(document) === 'audio'" class="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <svg v-else class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <!-- File type badge -->
                <span class="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-600 text-white dark:bg-gray-500">
                  {{ document.file_type?.toUpperCase() || 'FILE' }}
                </span>
              </div>

              <!-- File Name -->
              <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full mb-1" :title="document.name">
                {{ truncate(document.name, 25) }}
              </h4>

              <!-- Size -->
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {{ formatFileSize(document.file_size) }}
              </p>

              <!-- Category Badge -->
              <span
                v-if="document.document_category"
                class="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 mb-2"
              >
                {{ document.document_category }}
              </span>

              <!-- Belongs To Link -->
              <router-link
                v-if="document.documentable && linkFor(document)"
                :to="linkFor(document)!"
                class="text-xs text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 truncate max-w-full mb-3"
                :title="getDocumentOwner(document)"
              >
                {{ truncate(getDocumentOwner(document), 25) }}
              </router-link>
              <span v-else class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full mb-3">
                {{ truncate(getDocumentOwner(document), 25) }}
              </span>

              <!-- Action Buttons -->
              <div class="flex items-center gap-1 pt-2 border-t border-gray-100 dark:border-gray-700 w-full justify-center">
                <!-- Preview -->
                <button
                  v-if="canPreview(document)"
                  @click="handlePreview(document)"
                  :disabled="loadingDocumentId === document.id"
                  class="p-1.5 rounded-md text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                  title="Preview"
                >
                  <svg v-if="loadingDocumentId === document.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <!-- Share -->
                <div class="relative">
                  <button
                    @click.stop="handleShare(document.id)"
                    class="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
                    title="Share"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <!-- Share dropdown reuses table's logic via activeShareDropdown -->
                </div>

                <!-- Download -->
                <button
                  @click="handleDownload(document)"
                  class="p-1.5 rounded-md text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30 transition-colors"
                  title="Download"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <!-- Delete -->
                <button
                  @click="handleDelete(document)"
                  class="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="loading" class="mt-4 flex items-center justify-between">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="flex gap-2">
          <div class="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      <div v-else-if="pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closePreviewModal"
    >
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closePreviewModal"></div>

        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden z-50">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ previewDoc?.name }}</h3>
            <button @click="closePreviewModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
            <!-- Image Preview -->
            <img
              v-if="previewDoc && getFileIcon(previewDoc) === 'image'"
              :src="previewUrl"
              :alt="previewDoc.name"
              class="max-w-full h-auto mx-auto"
            />

            <!-- PDF Preview -->
            <iframe
              v-else-if="previewDoc && getFileIcon(previewDoc) === 'pdf'"
              :src="previewUrl"
              class="w-full h-[70vh]"
              frameborder="0"
            ></iframe>

            <!-- Video Preview -->
            <video
              v-else-if="previewDoc && getFileIcon(previewDoc) === 'video'"
              :src="previewUrl"
              controls
              class="w-full max-h-[70vh] mx-auto rounded-lg"
              controlslist="nodownload"
            >
              Your browser does not support the video tag.
            </video>

            <!-- Audio Preview -->
            <div v-else-if="previewDoc && getFileIcon(previewDoc) === 'audio'" class="flex flex-col items-center py-8">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-6">
                <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ previewDoc?.name }}</p>
              <audio
                :src="previewUrl"
                controls
                class="w-full max-w-md"
                controlslist="nodownload"
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmButtonText="confirmModalButtonText"
      @close="closeConfirmModal"
      @confirm="confirmAction"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'
import { useViewPreferences } from '@/composables/useViewPreferences'
import DateRangePicker from '@/components/forms/DateRangePicker.vue'

const { can } = usePermissions()
const { getViewMode, setViewMode: saveViewPreference } = useViewPreferences()

interface Document {
  id: number
  name: string
  file_path: string
  file_type: string
  mime_type: string
  file_size: number
  document_category: string | null
  documentable_type: string
  documentable_id: number
  documentable?: any
  uploader?: { id: number; name: string }
  created_at: string
  updated_at: string
}

const router = useRouter()
const toast = useToast()
const currentPageTitle = ref('Documents')
const documents = ref<Document[]>([])
const searchQuery = ref('')
const dateRange = ref('')
const selectedCategory = ref('')
const selectedModel = ref('')
const loading = ref(true)
const viewMode = ref<'table' | 'grid'>(getViewMode('documents', 'table') as 'table' | 'grid')

// Function to set view mode and persist to backend
const setViewMode = (mode: 'table' | 'grid') => {
  viewMode.value = mode
  saveViewPreference('documents', mode)
}

const categoryOptions = [
  { label: '📷 Thumbnail', value: 'thumbnail' },
  { label: '🖼️ Image', value: 'image' },
  { label: '📄 Document', value: 'document' },
  { label: '📜 Contract', value: 'contract' },
  { label: '🧾 Invoice', value: 'invoice' },
  { label: '📐 Plan', value: 'plan' },
  { label: '🆔 CNIC Front', value: 'CNIC Front' },
  { label: '🆔 CNIC Back', value: 'CNIC Back' },
  { label: '💳 Payment Attachment', value: 'payment' },
  { label: '📦 Other', value: 'other' }
]
const modelOptions = [
  { label: '📂 All Models', value: '' },
  { label: '👤 Customers / Labours / Suppliers', value: 'App\\Models\\Customer' },
  { label: '🏗️ Projects', value: 'App\\Models\\Project' },
  { label: '💳 Payments', value: 'App\\Models\\Payment' },
]
const activeShareDropdown = ref<number | null>(null)
const showPreviewModal = ref(false)
const previewDoc = ref<Document | null>(null)
const previewUrl = ref('')
const loadingDocumentId = ref<number | null>(null)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
})

// Confirmation Modal State
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalButtonText = ref('Confirm')
const pendingDocument = ref<Document | null>(null)

const fetchDocuments = async (page = 1) => {
  loading.value = true
  try {
    const params: any = {
      page,
      per_page: 15,
      search: searchQuery.value,
      category: selectedCategory.value,
      documentable_type: selectedModel.value,
    }

    if (dateRange.value) {
       if (typeof dateRange.value === 'string' && dateRange.value.includes(' to ')) {
         const [start, end] = dateRange.value.split(' to ')
         params.start_date = start
         params.end_date = end || start
       } else {
         params.start_date = dateRange.value
         params.end_date = dateRange.value
       }
    }

    const response = await api.get('/documents', { params })
    documents.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching documents')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchDocuments(1)
}

const changePage = (page: number) => {
  fetchDocuments(page)
}

const getFileIcon = (document: Document): string => {
  if (document.mime_type?.startsWith('image/')) {
    return 'image'
  } else if (document.mime_type === 'application/pdf') {
    return 'pdf'
  } else if (document.mime_type?.startsWith('video/')) {
    return 'video'
  } else if (document.mime_type?.startsWith('audio/')) {
    return 'audio'
  }
  return 'file'
}

// Generate thumbnail URL for image documents
const getDocumentThumbnailUrl = (document: Document): string => {
  if (!document.file_path || getFileIcon(document) !== 'image') {
    return ''
  }
  
  // Get base URL from environment
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  
  // Remove /api from the end if it exists
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  // Handle file path
  const filePath = document.file_path.startsWith('/') ? document.file_path : `/storage/${document.file_path}`
  return `${base}${filePath}`
}

const linkFor = (document: Document) => {
  if (!document.documentable_type) return null
  if (document.documentable_type.includes('Customer')) {
    const type = document.documentable?.type
    if (type === 'supplier') return `/suppliers/${document.documentable_id}`
    if (type === 'labour') return `/labours/${document.documentable_id}`
    return `/customers/${document.documentable_id}`
  }
  if (document.documentable_type.includes('Project')) return `/projects/${document.documentable_id}`
  if (document.documentable_type.includes('Payment')) return `/payments/${document.documentable_id}/edit`
  return null
}

const canPreview = (document: Document): boolean => {
  const icon = getFileIcon(document)
  return icon === 'image' || icon === 'pdf' || icon === 'video' || icon === 'audio'
}

const getDocumentOwner = (document: Document): string => {
  if (!document.documentable_type) return 'Unknown'
  const type = document.documentable_type.split('\\').pop()?.toLowerCase() || ''
  const name = (document.documentable && document.documentable.name) || `ID: ${document.documentable_id}`
  if (type.includes('customer')) {
    const docType = document.documentable?.type
    const label = docType === 'supplier' ? 'Supplier' : (docType === 'labour' ? 'Labour' : 'Customer')
    return `${label}: ${name}`
  }
  if (type.includes('project')) return `Project: ${name}`
  if (type.includes('payment')) return `Payment #${document.documentable_id}`
  return `${type || 'Unknown'}: ${name}`
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const previewDocument = async (document: Document) => {
  loadingDocumentId.value = document.id
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    previewUrl.value = response.data.url
    previewDoc.value = document
    showPreviewModal.value = true
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error loading preview')
  } finally {
    loadingDocumentId.value = null
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDoc.value = null
  previewUrl.value = ''
}

const handlePreview = (document: Document) => {
  if (!can('documents', 'view')) {
    toast.error('You are not authorized to view documents')
    return
  }
  previewDocument(document)
}

const handleDownload = (document: Document) => {
  if (!can('documents', 'download')) {
    toast.error('You are not authorized to download documents')
    return
  }
  downloadDocument(document)
}

const handleShare = (docId: number) => {
  if (!can('documents', 'share')) {
    toast.error('You are not authorized to share documents')
    return
  }
  toggleShareDropdown(docId)
}

const handleDelete = (document: Document) => {
    if (!can('documents', 'delete')) {
        toast.error('You are not authorized to delete documents')
        return
    }
    deleteDocument(document)
}

const truncate = (s: string | undefined, n = 80) => {
  if (!s) return ''
  return s.length > n ? s.substring(0, n - 1) + '…' : s
}

const toggleShareDropdown = (docId: number) => {
  activeShareDropdown.value = activeShareDropdown.value === docId ? null : docId
}

const shareViaWhatsApp = async (document: Document) => {
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

const shareViaEmail = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    const subject = `Document: ${document.name}`
    const body = `I'm sharing this document with you:\n\n${document.name}\n\n${url}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    activeShareDropdown.value = null
    toast.success('Opening email client...')
  } catch (error: any) {
    toast.error('Error getting document URL')
  }
}

const copyLink = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/url`)
    const url = response.data.url
    await navigator.clipboard.writeText(url)
    activeShareDropdown.value = null
    toast.success('Link copied to clipboard!')
  } catch (error: any) {
    toast.error('Error copying link')
  }
}

const downloadDocument = async (document: Document) => {
  try {
    const response = await api.get(`/documents/${document.id}/download`, {
      responseType: 'blob'
    })

    // Create blob link to download
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
    toast.error(error.response?.data?.message || 'Error downloading document')
  }
}

const deleteDocument = (document: Document) => {
  pendingDocument.value = document
  confirmModalTitle.value = 'Delete Document'
  confirmModalMessage.value = `Are you sure you want to delete "${document.name}"? This action cannot be undone.`
  confirmModalButtonText.value = 'Delete'
  showConfirmModal.value = true
}

const confirmAction = async () => {
  if (!pendingDocument.value) return

  try {
    const response = await api.delete(`/documents/${pendingDocument.value.id}`)
    toast.success(response.data.message)
    fetchDocuments(pagination.value.current_page)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error deleting document')
  } finally {
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingDocument.value = null
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    activeShareDropdown.value = null
  }
}

onMounted(() => {
  fetchDocuments()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
