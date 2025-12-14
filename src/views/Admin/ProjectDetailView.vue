<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div v-if="project" class="space-y-6">
      
      <!-- 1. Hero Header -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-5">
             <div class="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <img v-if="getProjectThumbnail(project)" :src="getProjectThumbnail(project)" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-50 dark:bg-gray-800">
                  {{ project?.name?.charAt(0)?.toUpperCase() }}
                </div>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ project.name }}</h1>
                  <span :class="[
                    'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getStatusColor(project.status)
                  ]">
                    {{ formatTitle(project.status) }}
                  </span>
                </div>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span v-if="project.plot_number" class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Plot #{{ project.plot_number }}
                    </span>
                    <span v-if="project.city" class="flex items-center gap-1">
                        {{ project.city.name }}
                    </span>
                    <span class="text-gray-300">|</span>
                    <span>Created {{ formatDate(project.created_at) }}</span>
                </div>
              </div>
          </div>
          <div class="flex items-center gap-3">
             <button @click="router.push(`/projects/${project.id}/edit`)" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
                Edit Project
             </button>
             <button class="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm">
                Add Payment
             </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- LEFT COLUMN (Main Content) -->
          <div class="lg:col-span-2 space-y-6">

             <!-- 2. Financial Stats Grid -->
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                   <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contract Value</div>
                   <div class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(project.contract_value) }}</div>
                </div>
                 <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                   <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Paid (Exp)</div>
                   <div class="text-lg font-bold text-red-600">{{ formatCurrency(project.outgoing_payments_sum_amount) }}</div>
                </div>
                 <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                   <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Received</div>
                   <div class="text-lg font-bold text-green-600">{{ formatCurrency(project.incoming_payments_sum_amount) }}</div>
                </div>
                 <div class="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                   <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Balance</div>
                   <div class="text-lg font-bold text-brand-600">{{ calculateBalance(project) }}</div>
                </div>
             </div>

            <!-- 3. Tabs & Content -->
            <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
                <div class="border-b border-gray-200 dark:border-gray-800 px-6 pt-4">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button 
                          v-for="tab in tabs" 
                          :key="tab"
                          @click="activeTab = tab"
                          :class="[
                            activeTab === tab ? 'border-brand-500 text-brand-600 dark:text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                          ]"
                        >
                          {{ tab }}
                        </button>
                    </nav>
                </div>

                <div class="p-6">
                    <!-- Overview Tab -->
                    <div v-if="activeTab === 'Overview'" class="space-y-6">
                       <div class="prose max-w-none dark:prose-invert text-sm text-gray-600 dark:text-gray-300">
                          <h4 class="text-gray-900 dark:text-white font-medium mb-2">Description</h4>
                          <p v-if="project.description" v-html="project.description"></p>
                          <p v-else class="italic text-gray-400">No description provided for this project.</p>
                       </div>

                       <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t dark:border-gray-800">
                          <div>
                             <h4 class="text-xs uppercase font-semibold text-gray-500 mb-3">Property Details</h4>
                             <dl class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                   <dt class="text-gray-500">Plot Area</dt>
                                   <dd class="font-medium text-gray-900 dark:text-gray-200">{{ project.plot_area_sq_ft ? project.plot_area_sq_ft + ' sq ft' : '—' }}</dd>
                                </div>
                                <div class="flex justify-between">
                                   <dt class="text-gray-500">Covered Area</dt>
                                   <dd class="font-medium text-gray-900 dark:text-gray-200">{{ project.covered_area_sq_ft ? project.covered_area_sq_ft + ' sq ft' : '—' }}</dd>
                                </div>
                                 <div class="flex justify-between">
                                   <dt class="text-gray-500">Floors</dt>
                                   <dd class="font-medium text-gray-900 dark:text-gray-200">{{ project.number_of_floors || '—' }}</dd>
                                </div>
                             </dl>
                          </div>
                          <div>
                              <h4 class="text-xs uppercase font-semibold text-gray-500 mb-3">Construction Details</h4>
                               <dl class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                   <dt class="text-gray-500">Structure Type</dt>
                                   <dd class="font-medium text-gray-900 dark:text-gray-200">{{ formatTitle(project.structure_type) || '—' }}</dd>
                                </div>
                                <div class="flex justify-between">
                                   <dt class="text-gray-500">Building Permit</dt>
                                   <dd class="font-medium text-gray-900 dark:text-gray-200">{{ project.building_permit_number || '—' }}</dd>
                                </div>
                             </dl>
                          </div>
                       </div>
                    </div>

                    <!-- Documents Tab -->
                    <div v-if="activeTab === 'Documents'">
                       <div v-if="documents.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents</h3>
                          <p class="mt-1 text-sm text-gray-500">Get started by uploading a new document.</p>
                       </div>
                       <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <li v-for="doc in documents" :key="doc.id" class="relative group rounded-lg border border-gray-200 bg-white shadow-sm hover:border-brand-400 hover:shadow-md transition-all dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                             
                             <!-- Document Preview / Icon -->
                             <div 
                                class="aspect-w-16 aspect-h-10 bg-gray-100 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden relative"
                                @click="handlePreview(doc)"
                             >
                                <img v-if="isImageFile(doc)" :src="makeAbsoluteUrl(doc.url || doc.path || doc.file_path)" class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                                <div v-else class="flex flex-col items-center justify-center h-40 w-full text-gray-400">
                                   <svg v-if="doc.mime_type === 'application/pdf'" class="h-16 w-16 text-red-500 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L24 12L12 24L0 12L12 0Z" opacity="0"></path><path fill-rule="evenodd" d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4ZM12 4L18 10H12V4ZM12 4H6V20H18V10H12V4Z" clip-rule="evenodd"></path></svg>
                                   <svg v-else class="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                   <span class="text-xs font-medium uppercase tracking-wider">{{ doc.file_type || 'DOC' }}</span>
                                </div>

                                <!-- Overlay on hover -->
                                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             </div>

                             <!-- Info & Actions -->
                             <div class="p-4">
                                <div class="flex items-start justify-between">
                                    <div class="min-w-0 flex-1">
                                        <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate cursor-pointer hover:text-brand-600" @click="handlePreview(doc)">{{ doc.name }}</h4>
                                        <p class="text-xs text-gray-500 mt-0.5">{{ formatFileSize(doc.file_size) }} &bull; {{ formatDate(doc.created_at) }}</p>
                                    </div>
                                    
                                    <!-- Three Dot Menu -->
                                    <div class="relative ml-2">
                                        <button @click.stop="toggleDocMenu(doc.id)" class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>
                                        </button>
                                        
                                        <!-- Dropdown -->
                                        <div v-if="activeDocMenu === doc.id" v-click-outside="closeDocMenu" class="absolute right-0 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-20 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                                            <button 
                                                v-if="can('documents', 'view')"
                                                @click="handlePreview(doc); closeDocMenu()" 
                                                class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                Preview
                                            </button>
                                             <button 
                                                v-if="can('documents', 'download')"
                                                @click="handleDownload(doc); closeDocMenu()" 
                                                class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Download
                                            </button>
                                            <button 
                                                v-if="can('documents', 'share')"
                                                @click="handleShareWhatsApp(doc); closeDocMenu()" 
                                                class="flex w-full items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                            >
                                                <svg class="mr-3 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                                WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                          </li>
                       </ul>
                    </div>

                    <!-- Payments Tab -->
                    <div v-if="activeTab === 'Payments'">
                        <div v-if="displayedPayments.length === 0" class="text-center py-10">
                            <p class="text-gray-500">No payments found</p>
                        </div>

                        <div v-else class="space-y-3">
                            <div v-for="p in displayedPayments" :key="p.id" 
                                 class="flex items-center gap-3 p-3 rounded-lg border transition-colors"
                                 :class="p.direction === 'incoming' ? 'border-green-100 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10' : 'border-red-100 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10'"
                            >
                                <div class="flex-shrink-0">
                                    <div class="h-2 w-2 rounded-full" :class="p.direction === 'incoming' ? 'bg-green-500' : 'bg-red-500'"></div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-baseline gap-2">
                                        <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(p.amount) }}</span>
                                        <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="p.direction === 'incoming' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'">{{ p.direction === 'incoming' ? 'In' : 'Out' }}</span>
                                        <span class="text-xs text-gray-500">{{ formatDate(p.created_at) }}</span>
                                    </div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ p.title || (p.direction === 'incoming' ? 'Payment Received' : 'Payment Sent') }}</div>
                                </div>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <template v-if="p.direction === 'incoming'">
                                        <img v-if="getCustomerPhoto(project.customer)" :src="getCustomerPhoto(project.customer)" class="h-8 w-8 rounded-full object-cover border-2 border-white dark:border-gray-800" />
                                        <div v-else class="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-xs text-brand-700 font-bold border-2 border-white dark:border-gray-800">{{ project.customer?.name?.charAt(0) }}</div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getCustomerDisplayName(project.customer) }}</span>
                                            <span class="text-xs text-gray-500 capitalize">{{ project.customer?.type || 'Customer' }}</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <img v-if="getCustomerPhoto(p.payer)" :src="getCustomerPhoto(p.payer)" class="h-8 w-8 rounded-full object-cover border-2 border-white dark:border-gray-800" />
                                        <div v-else class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-700 font-bold border-2 border-white dark:border-gray-800">{{ (p.payer?.name || 'L')?.charAt(0) }}</div>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getCustomerDisplayName(p.payer) || 'Labour / Staff' }}</span>
                                            <span class="text-xs text-gray-500 capitalize">{{ p.payer?.type || 'Labour' }}</span>
                                        </div>
                                    </template>
                                    <span
                                      v-if="p.schedule_id"
                                      class="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                                    >
                                      Scheduled
                                      <router-link :to="`/scheduled-payments/${p.schedule_id}/edit`" class="underline hover:text-brand-800">
                                        View
                                      </router-link>
                                    </span>
                                </div>
                            </div>
                            <div v-if="payments.length > displayedPayments.length" class="text-center pt-2">
                                <button @click="loadMorePayments" class="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors dark:text-brand-400 dark:hover:bg-brand-900/20">Load More ({{ payments.length - displayedPayments.length }} remaining)</button>
                            </div>
                        </div>
                     </div>
                     
                    <!-- Scheduled Payments Tab -->
                    <div v-if="activeTab === 'Scheduled Payments'">
                      <div class="flex items-center justify-between mb-4">
                        <h4 class="text-base font-semibold text-gray-900 dark:text-white">Scheduled Payments</h4>
                        <button
                          class="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                          @click="router.push({ path: '/scheduled-payments/create', query: { project_id: project.id } })"
                        >
                          Schedule Payment
                        </button>
                      </div>
                      <div v-if="scheduleList.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        No scheduled payments for this project.
                      </div>
                      <div v-else class="space-y-3">
                        <div
                          v-for="s in scheduleList"
                          :key="s.id"
                          class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                        >
                          <div class="flex items-center gap-3">
                            <span
                              class="h-2 w-2 rounded-full"
                              :class="s.direction === 'incoming' ? 'bg-green-500' : 'bg-red-500'"
                            ></span>
                            <div>
                              <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ s.title || 'Untitled Schedule' }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ s.schedule_type === 'one_time' ? 'One-time' : (s.frequency || '').replace('_', ' ') }}
                                <span v-if="s.next_due_date"> • Next: {{ formatDate(s.next_due_date) }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center gap-3">
                            <span class="text-sm font-semibold" :class="s.direction === 'incoming' ? 'text-green-600' : 'text-red-600'">
                              {{ formatCurrency(s.amount, s.currency) }}
                            </span>
                            <router-link
                              :to="`/scheduled-payments/${s.id}/edit`"
                              class="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              View
                            </router-link>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                     <!-- Timeline Tab -->
                    <div v-if="activeTab === 'Timeline'">
                        <div class="flow-root">
                          <ul role="list" class="-mb-8">
                            <li v-for="(activity, activityIdx) in activities" :key="activity.id">
                              <div class="relative pb-8">
                                <span v-if="activityIdx !== activities.length - 1" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                                <div class="relative flex space-x-3">
                                  <div>
                                    <span :class="[
                                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                                      getActivityColor(activity)
                                    ]">
                                       <svg v-if="activity.action === 'created'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                       <svg v-else-if="activity.action === 'updated'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                       <svg v-else-if="activity.action === 'deleted'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                       <svg v-else class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </span>
                                  </div>
                                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                      <p class="text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-medium text-gray-900 dark:text-white">{{ activity.user?.name || 'System' }}</span>
                                        {{ activity.description }}
                                      </p>
                                    </div>
                                    <div class="whitespace-nowrap text-right text-sm text-gray-500">
                                      {{ formatDate(activity.created_at) }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                             <li v-if="activities.length === 0">
                                <div class="text-sm text-gray-500 italic">No activity recorded for this project yet.</div>
                            </li>
                          </ul>
                        </div>
                    </div>

                </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (Sidebar) -->
          <div class="space-y-6">

             <!-- Customer Card -->
             <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Customer Details</h3>
                <div class="flex items-center gap-4 mb-6">
                   <img v-if="project.customer?.profile_photo_url" :src="project.customer.profile_photo_url" class="h-14 w-14 rounded-full border-2 border-white shadow-sm" />
                   <div v-else class="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border-2 border-white shadow-sm">
                      {{ project.customer?.name?.charAt(0) }}
                   </div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ project.customer?.name }}</div>
                      <div class="text-xs text-gray-500">Client since {{ formatDate(project.customer?.created_at) }}</div>
                   </div>
                </div>
                
                <div class="space-y-3">
                   <a v-if="project.customer?.phone_primary" :href="`tel:${project.customer.phone_primary}`" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <div class="p-1.5 bg-green-100 text-green-700 rounded-md">
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      </div>
                      <span>{{ project.customer.phone_primary }}</span>
                   </a>
                   <a v-if="project.customer?.whatsapp_number" :href="`https://wa.me/${project.customer.whatsapp_number}`" target="_blank" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300">
                      <div class="p-1.5 bg-green-100 text-green-700 rounded-md">
                         <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      </div>
                      <span>WhatsApp</span>
                   </a>
                   <div v-if="project.customer?.address" class="flex items-start gap-3 p-2 text-sm text-gray-500">
                      <svg class="h-4 w-4 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span>{{ project.customer.address }}</span>
                   </div>
                </div>
                 <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button @click="router.push(`/customers/${project.customer_id}`)" class="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                        View Full Profile
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </button>
                </div>
             </div>

             <!-- Project Info Sidebar -->
             <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Project Info</h3>
                <div class="space-y-4 text-sm">
                   <div>
                      <div class="text-gray-500">Address</div>
                      <div class="font-medium text-gray-900 dark:text-gray-200 mt-1">{{ fullAddress(project) }}</div>
                   </div>
                   <div class="grid grid-cols-2 gap-4">
                       <div>
                          <div class="text-gray-500">Start Date</div>
                          <div class="font-medium text-gray-900 dark:text-gray-200">{{ formatDate(project.start_date) || '—' }}</div>
                       </div>
                       <div>
                          <div class="text-gray-500">Planned End</div>
                          <div class="font-medium text-gray-900 dark:text-gray-200">{{ formatDate(project.planned_completion_date) || '—' }}</div>
                       </div>
                   </div>
                   <div>
                       <div class="flex justify-between items-center mb-1">
                          <span class="text-gray-500">Completion</span>
                          <span class="font-bold text-gray-900">{{ project.completion_percentage || 0 }}%</span>
                       </div>
                       <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div class="bg-brand-600 h-2 rounded-full" :style="`width: ${project.completion_percentage || 0}%`"></div>
                       </div>
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
              v-if="previewDoc && isImageFile(previewDoc)"
              :src="previewUrl"
              :alt="previewDoc.name"
              class="max-w-full h-auto mx-auto"
            />
            <iframe
              v-else-if="previewDoc && (isPdfFile(previewDoc) || true)"
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
import { formatAmount } from '@/utils/currency'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { can } = usePermissions()
const id = Number(route.params.id)

// State
const pageTitle = ref('Project Dashboard')
const project = ref<any>(null)
const documents = ref<any[]>([])
const payments = ref<any[]>([])
const scheduleList = ref<any[]>([])
const activities = ref<any[]>([])
const tabs = ['Overview', 'Documents', 'Payments', 'Scheduled Payments', 'Timeline']
const activeTab = ref('Overview')
const paymentsToShow = ref(10)
const displayedPayments = computed(() => payments.value.slice(0, paymentsToShow.value))

// Doc Menu & Preview State
const activeDocMenu = ref<number | null>(null)
const showPreviewModal = ref(false)
const previewDoc = ref<any>(null)
const previewUrl = ref('')

// Helpers
const getFullUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || api.defaults.baseURL || window?.location?.origin || ''
  const base = fileBase.replace(/\/$/, '')
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTitle = (str: string) => {
    if (!str) return ''
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') => formatAmount(value, currency, { compact: true })

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const fullAddress = (p: any) => {
  if (!p) return ''
  const parts = [p.house_number ? `#${p.house_number}` : '', p.street_address, p.town?.name, p.city?.name].filter(Boolean)
  if (parts.length > 0) return parts.join(', ')
  return p.address || '—'
}

const calculateBalance = (p: any) => {
    if (!p) return '—'
    const received = Number(p.incoming_payments_sum_amount) || 0
    const paid = Number(p.outgoing_payments_sum_amount) || 0
    return formatCurrency(received - paid)
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 border-green-200'
        case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

// Activity Formatting
const formatActivityTitle = (activity: any) => {
    const action = activity.action.charAt(0).toUpperCase() + activity.action.slice(1)
    let type = activity.model_type.split('\\').pop()
    if (type === 'Project') type = 'Project'
    else if (type === 'Payment') type = 'Payment'
    else if (type === 'Document') type = 'Document'
    return `${action} ${type}`
}

const formatActivityChanges = (changes: any) => {
    if (!changes) return ''
    if (typeof changes === 'string') return changes
    if (changes.model_name) return `Name: ${changes.model_name}`
    if (changes.after) {
         const keys = Object.keys(changes.after).filter(k => k !== 'updated_at')
         if (keys.length > 0) return `Changed: ${keys.map(k => formatTitle(k)).join(', ')}`
    }
    return ''
}

const formatActivityDescription = (activity: any) => {
    if (activity.description === 'created' || activity.description === 'updated' || activity.description === 'deleted') {
        const changes = formatActivityChanges(activity.changes)
        if (changes) return changes
        return `${formatTitle(activity.action)} ${activity.model_type.split('\\').pop()}`
    }
    return activity.description
}

const getActivityColor = (activity: any) => {
    const action = activity.action
    if (action === 'created') return 'bg-green-100 text-green-600'
    if (action === 'updated') return 'bg-blue-100 text-blue-600'
    if (action === 'deleted') return 'bg-red-100 text-red-600'
    return 'bg-gray-100 text-gray-600'
}

const getActivityIcon = (activity: any) => {
  if (activity.action === 'created') return 'M12 4v16m8-8H4'
  if (activity.action === 'updated') return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  if (activity.action === 'deleted') return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
  return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

// Document Logic
const isImageFile = (doc: any) => {
    return (doc.mime_type || '').startsWith('image/') || (doc.name || '').match(/\.(jpg|jpeg|png|gif|webp)$/i)
}

const isPdfFile = (doc: any) => {
    return (doc.mime_type || '') === 'application/pdf' || (doc.name || '').match(/\.pdf$/i)
}

const toggleDocMenu = (id: number) => {
    activeDocMenu.value = activeDocMenu.value === id ? null : id
}

const closeDocMenu = () => {
    activeDocMenu.value = null
}

const handleShareWhatsApp = (doc: any) => {
    if (!can('documents', 'share')) {
        toast.error('You are not authorized to share documents')
        return
    }
    const url = getFullUrl(doc.url || doc.path || doc.file_path)
    const text = `Check out this document: ${doc.name} - ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

const handleDownload = async (doc: any) => {
  if (!can('documents', 'download')) {
    toast.error('You are not authorized to download documents')
    return
  }
  try {
     const url = getFullUrl(doc.url || doc.path || doc.file_path)
     const link = document.createElement('a')
     link.href = url
     link.download = doc.name
     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
  } catch(e) {
      toast.error('Error downloading')
  }
}

const handlePreview = async (doc: any) => {
  if (!can('documents', 'view')) {
      toast.error('You are not authorized to view documents')
      return 
  }
  try {
     const url = getFullUrl(doc.url || doc.path || doc.file_path)
     previewUrl.value = url
     previewDoc.value = doc
     showPreviewModal.value = true
  } catch (e) {
      toast.error('Error opening preview')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewDoc.value = null
  previewUrl.value = ''
}

const loadMorePayments = () => {
  paymentsToShow.value += 10
}

const getProjectThumbnail = (p: any) => {
  if (!p) return ''
  const direct = p.thumbnail_url || p.thumbnail?.file_path || p.thumbnail?.thumb_url
  if (direct) return makeAbsoluteUrl(direct)
  const docThumb = (p.documents || []).find((d: any) => (d.document_category || d.category || '').toLowerCase() === 'thumbnail' || (d.document_category || d.category || '').toLowerCase() === 'thumb')
  if (docThumb) return makeAbsoluteUrl(docThumb.file_path || docThumb.url || docThumb.thumb_url)
  return ''
}

const getCustomerPhoto = (c: any) => {
  if (!c) return ''
  const path = c.profile_photo_url || c.photo || c.avatar || c.profile_photo
  return path ? makeAbsoluteUrl(path) : ''
}

const getCustomerDisplayName = (c: any) => {
  if (!c) return ''
  const prefix = c.name_prefix ? `${c.name_prefix} ` : ''
  return `${prefix}${c.name}`.trim()
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

// Directives
const vClickOutside = {
    mounted(el: any, binding: any) {
        el.clickOutsideEvent = (event: Event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    }
}

// Data Loading
const loadData = async () => {
  if (!can('projects', 'view_details')) {
    toast.error('You are not authorized to view project details')
    router.push('/projects')
    return
  }

  try {
    const [projectRes, documentsRes, paymentsRes, activitiesRes, schedulesRes] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/documents`),
      api.get(`/projects/${id}/payments`),
      api.get(`/projects/${id}/activities`),
      api.get('/payment-schedules', { params: { project_id: id, per_page: 200 } })
    ])

    project.value = projectRes.data.data || projectRes.data // Handle wrapper
    documents.value = documentsRes.data.data || documentsRes.data
    payments.value = paymentsRes.data.data || paymentsRes.data
    activities.value = activitiesRes.data.data || activitiesRes.data 
    scheduleList.value = schedulesRes.data.data || schedulesRes.data
    
    pageTitle.value = project.value.name
    
  } catch (error) {
    console.error('Data load error:', error)
    toast.error('Failed to load project details') 
    router.push('/projects')
  }
}

onMounted(() => {
  loadData()
})
</script>
