<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">Project Management</h3>

        <div class="flex flex-1 flex-col flex-wrap gap-4 sm:flex-row sm:items-center lg:flex-initial">
          <!-- View Toggle -->
          <div class="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              @click="viewMode = 'list'"
              :class="[
                'rounded-md p-1.5 transition-colors',
                viewMode === 'list' 
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
              title="List View"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              @click="viewMode = 'grid'"
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

          <!-- Filters -->
          <select v-model="filters.town_id" @change="handleSearch" class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="">All Towns</option>
            <option v-for="town in towns" :key="town.id" :value="town.id">{{ town.name }}</option>
          </select>

          <CustomerSelect
            v-model="filters.customer_id"
            :customers="customers"
            placeholder="All Customers"
            :show-address="false"
            @change="handleSearch"
            class="w-[200px]"
          />

          <StatusSelect
            v-model="filters.status"
            placeholder="All Status"
            @change="handleSearch"
            class="w-[160px]"
          />

          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search projects..."
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <button
            v-if="can('projects', 'create')"
            @click="router.push('/projects/create')"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            <span class="flex items-center gap-2">
              <span class="hidden md:inline">Add Project</span>
            </span>
          </button>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto max-h-[calc(100vh-250px)] overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 relative">
            <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[200px]">Project</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[180px]">Owner</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[200px]">Location</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Payments</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[160px]">Added / Updated</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img 
                      v-if="getProjectThumbnail(project)" 
                      :src="getProjectThumbnail(project)" 
                      :alt="project.name"
                      class="h-full w-full object-cover" 
                      @error="handleImageError"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-lg font-bold text-gray-400 dark:text-gray-600">
                      {{ project.name?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <button
                      @click="handleOpenProject(project)"
                      class="text-left text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline truncate"
                    >
                      {{ project.name }}
                    </button>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ project.plot_number || '—' }}</div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <router-link 
                  v-if="project.customer" 
                  :to="`/customers/${project.customer?.id}`" 
                  class="flex items-center gap-2 group"
                >
                  <div class="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 group-hover:border-brand-400 transition-colors">
                    <img 
                      v-if="getCustomerPhoto(project.customer)" 
                      :src="getCustomerPhoto(project.customer)" 
                      :alt="project.customer?.name"
                      class="h-full w-full object-cover" 
                      @error="handleImageError"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center text-sm font-bold text-gray-400 dark:text-gray-600">
                      {{ project.customer?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="font-medium text-sm text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 truncate">
                      {{ getCustomerDisplayName(project.customer) || '—' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ truncate(project.customer?.address || '', 25) }}</div>
                  </div>
                </router-link>
                <div v-else class="text-sm text-gray-400">—</div>
              </td>

              <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                <div class="truncate max-w-[200px]" :title="fullAddress(project)">{{ fullAddress(project) || '—' }}</div>
              </td>

              <td class="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                <div class="flex flex-col gap-1">
                  <div class="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1" title="Received (Incoming)">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    {{ formatCurrency(project.incoming_payments_sum_amount || 0) }}
                  </div>
                  <div class="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1" title="Paid (Outgoing)">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    {{ formatCurrency(project.outgoing_payments_sum_amount || 0) }}
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                <div class="text-xs truncate">By: <span class="font-medium">{{ truncate(project.creator?.name || project.created_by_name || '—', 15) }}</span></div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate">Updated: <span class="font-medium">{{ truncate(project.updater?.name || project.updated_by_name || '—', 15) }}</span></div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <div class="relative group">
                  <button class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-all duration-200"
                    @click.stop="toggleStatusDropdown(project.id)"
                    :class="{
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': project.status === 'planning',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': project.status === 'in_progress',
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400': project.status === 'on_hold',
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': project.status === 'completed',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': project.status === 'cancelled'
                    }"
                  >
                    <component :is="getStatusIcon(project.status)" class="w-3.5 h-3.5" />
                    {{ project.status?.replace('_', ' ') }}
                    <svg class="w-3 h-3 ml-1 transition-transform duration-200" :class="{ 'rotate-180': activeStatusDropdown === project.id }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  
                  <!-- Inline Status Dropdown -->
                  <div 
                    v-if="can('projects', 'change_status') && activeStatusDropdown === project.id"
                    class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50"
                    @click.stop
                  >
                    <div class="py-1">
                      <button v-for="status in ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']" 
                        :key="status"
                        @click="updateStatus(project, status)"
                        class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 capitalize transition-colors"
                        :class="{'bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 font-medium': project.status === status}"
                      >
                        <component :is="getStatusIcon(status)" class="w-4 h-4" :class="getStatusColor(status)" />
                        {{ status.replace('_', ' ') }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="can('documents', 'attach')"
                    @click="goAttachDocs('App\\Models\\Project', project.id)"
                    class="p-1.5 rounded-md text-brand-600 hover:bg-gray-100 dark:text-brand-400 dark:hover:bg-gray-800"
                    title="Attach Documents"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-9l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <button 
                    @click="handleEditProject(project)" 
                    :class="[
                      'p-1.5 rounded-md transition-colors',
                      can('projects', 'edit') ? 'text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30' : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                    ]"
                    :disabled="!can('projects', 'edit')"
                    title="Edit Project"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDeleteProject(project.id)" 
                    :class="[
                      'p-1.5 rounded-md transition-colors',
                      can('projects', 'delete') ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30' : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                    ]"
                    title="Delete Project"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No projects found</td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="project in projects" :key="project.id" class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <!-- Project Thumbnail/Header -->
          <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img 
              v-if="getProjectThumbnail(project)" 
              :src="getProjectThumbnail(project)" 
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="handleImageError"
            />
            <div v-else class="h-full w-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
               <span class="text-4xl font-bold text-white opacity-30">{{ project.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 right-3 z-10">
              <button class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-all duration-200 shadow-sm backdrop-blur-md"
                @click.stop="toggleStatusDropdown(project.id)"
                :class="{
                  'bg-blue-100/90 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200': project.status === 'planning',
                  'bg-yellow-100/90 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200': project.status === 'in_progress',
                  'bg-orange-100/90 text-orange-800 dark:bg-orange-900/80 dark:text-orange-200': project.status === 'on_hold',
                  'bg-green-100/90 text-green-800 dark:bg-green-900/80 dark:text-green-200': project.status === 'completed',
                  'bg-red-100/90 text-red-800 dark:bg-red-900/80 dark:text-red-200': project.status === 'cancelled'
                }"
              >
                <component :is="getStatusIcon(project.status)" class="w-3.5 h-3.5" />
                {{ project.status?.replace('_', ' ') }}
                <svg class="w-3 h-3 ml-1 transition-transform duration-200" :class="{ 'rotate-180': activeStatusDropdown === project.id }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <!-- Inline Status Dropdown -->
              <div 
                v-if="can('projects', 'change_status') && activeStatusDropdown === project.id"
                class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50"
                @click.stop
              >
                <div class="py-1">
                  <button v-for="status in ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']" 
                    :key="status"
                    @click="updateStatus(project, status)"
                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 capitalize transition-colors"
                    :class="{'bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 font-medium': project.status === status}"
                  >
                    <component :is="getStatusIcon(status)" class="w-4 h-4" :class="getStatusColor(status)" />
                    {{ status.replace('_', ' ') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-1 flex-col p-4">
            <div class="mb-3">
              <button
                @click="handleOpenProject(project)"
                class="block text-left text-lg font-semibold text-gray-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
              >
                {{ project.name }}
              </button>
              <div class="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="truncate">{{ fullAddress(project) || 'No address' }}</span>
              </div>
            </div>

            <!-- Owner -->
            <component
              :is="project.customer ? 'router-link' : 'div'"
              :to="project.customer ? `/customers/${project.customer.id}` : undefined"
              class="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <img 
                  v-if="getCustomerPhoto(project.customer)" 
                  :src="getCustomerPhoto(project.customer)" 
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                  {{ project.customer?.name?.charAt(0)?.toUpperCase() }}
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {{ getCustomerDisplayName(project.customer) || 'Unknown Owner' }}
                </div>
                <div class="truncate text-xs text-gray-500 dark:text-gray-400">Owner</div>
              </div>
            </component>

            <div class="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400">Contract Value</span>
                <span class="font-semibold text-brand-600 dark:text-brand-400">
                  {{ formatCurrency(project.contract_value) }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleEditProject(project)"
                  :disabled="!can('projects', 'edit')"
                  :class="[
                    'rounded p-1.5',
                    can('projects', 'edit') ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300' : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                  ]"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State Grid -->
        <div v-if="projects.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results</div>
        <div class="flex gap-2">
          <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Previous</button>
          <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Next</button>
        </div>
      </div>
    </div>
    </div>

    <!-- Project Modal -->
    <Modal v-if="isProjectModalOpen" @close="isProjectModalOpen = false">
      <div class="relative w-full max-w-[760px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{{ editingProject ? 'Edit Project' : 'Create Project' }}</h3>
        <form @submit.prevent="saveProject" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Project Name</label>
            <input v-model="projectForm.name" type="text" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Owner (Customer)</label>
              <select v-model="projectForm.customer_id" class="h-11 w-full rounded-lg border border-gray-300 px-3">
                <option value="">Select owner</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Plot Number</label>
              <input v-model="projectForm.plot_number" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
            <input v-model="projectForm.address" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contract Type</label>
              <select v-model="projectForm.contract_type" class="h-11 w-full rounded-lg border border-gray-300 px-3">
                <option value="">Select contract type</option>
                <option value="material_based">Material Based</option>
                <option value="labour_rate">Labour Rate</option>
                <option value="fixed_price">Fixed Price</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contract Value</label>
              <input v-model="projectForm.contract_value" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Attach Documents</label>
            <input type="file" multiple @change="handleFileChange" />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="isProjectModalOpen = false" class="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" class="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white">Save</button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Status Modal -->
    <Modal v-if="isStatusModalOpen" @close="isStatusModalOpen = false">
      <div class="relative w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Change Status</h3>
        <form @submit.prevent="updateStatus(statusForm.id, statusForm.status)" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Status</label>
            <select v-model="statusForm.status" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="isStatusModalOpen = false" class="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" class="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white">Update</button>
          </div>
        </form>
      </div>
    </Modal>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Modal from '@/components/profile/Modal.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import StatusSelect from '@/components/forms/StatusSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'
import { formatAmount } from '@/utils/currency'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  PauseCircleIcon, 
  PlayCircleIcon,
  CalendarIcon
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const { can } = usePermissions()
const currentPageTitle = ref('Projects')
const projects = ref<any[]>([])
const customers = ref<any[]>([])
const towns = ref<any[]>([])
const searchQuery = ref('')
const viewMode = ref<'list' | 'grid'>('list')
const filters = ref({
  town_id: '',
  customer_id: '',
  status: ''
})

const pagination = ref({ current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 })

const isProjectModalOpen = ref(false)
const editingProject = ref<any>(null)
const projectForm = ref({
  name: '',
  description: '',
  customer_id: null,
  plot_number: '',
  address: '',
  contract_type: '',
  contract_value: '',
  is_active: true,
})

const isStatusModalOpen = ref(false)
const statusForm = ref({
  id: null as number | null,
  status: ''
})

const activeStatusDropdown = ref<number | null>(null)

const toggleStatusDropdown = (id: number) => {
  if (activeStatusDropdown.value === id) {
    activeStatusDropdown.value = null
  } else {
    activeStatusDropdown.value = id
  }
}

const closeDropdowns = () => {
  activeStatusDropdown.value = null
}

const filesToUpload = ref<File[]>([])

const fetchProjects = async (page = 1) => {
  try {
    const params = { 
      page, 
      search: searchQuery.value || undefined,
      town_id: filters.value.town_id || undefined,
      customer_id: filters.value.customer_id || undefined,
      status: filters.value.status || undefined
    }
    const res = await api.get('/projects', { params })
    projects.value = res.data.data
    pagination.value = {
      current_page: res.data.current_page,
      last_page: res.data.last_page,
      per_page: res.data.per_page,
      total: res.data.total,
      from: res.data.from,
      to: res.data.to,
    }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching projects')
  }
}

const fetchCustomers = async () => {
  try {
    const res = await api.get('/customers')
    customers.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

const fetchTowns = async () => {
  try {
    const res = await api.get('/towns')
    towns.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  }
}

const handleSearch = () => fetchProjects(1)
const changePage = (page: number) => fetchProjects(page)

const openProjectModal = (project: any = null) => {
  editingProject.value = project
  if (project) {
    projectForm.value = { ...project }
  } else {
    projectForm.value = { name: '', description: '', customer_id: null, plot_number: '', address: '', contract_type: '', contract_value: '', is_active: true }
  }
  filesToUpload.value = []
  isProjectModalOpen.value = true
}

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  filesToUpload.value = Array.from(input.files)
}

const saveProject = async () => {
  try {
    const formData = new FormData()
    Object.entries(projectForm.value).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v as any)
    })
    filesToUpload.value.forEach((f) => formData.append('documents[]', f))

    if (editingProject.value) {
      const res = await api.put(`/projects/${editingProject.value.id}`, formData)
      toast.success('Project updated')
    } else {
      const res = await api.post('/projects', formData)
      toast.success('Project created')
    }

    isProjectModalOpen.value = false
    fetchProjects(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error saving project')
  }
}

const editProject = (p: any) => openProjectModal(p)

const handleEditProject = (project: any) => {
    if (!can('projects', 'edit')) {
        toast.error('You are not authorized to edit projects')
        return
    }
    router.push(`/projects/${project.id}/edit`)
}

const handleOpenProject = (project: any) => {
    if (!can('projects', 'view_details')) {
        toast.error('You are not authorized to view project details')
        return
    }
    router.push(`/projects/${project.id}`)
}

const handleDeleteProject = (id: number) => {
    if (!can('projects', 'delete')) {
        toast.error('You are not authorized to delete projects')
        return
    }
    deleteProject(id)
}

const deleteProject = async (id: number) => {
  if (!confirm('Are you sure?')) return
  try {
    const res = await api.delete(`/projects/${id}`)
    toast.success(res.data.message || 'Deleted')
    fetchProjects(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error deleting project')
  }
}

const handleStatusModalClick = (project: any) => {
    if (!can('projects', 'change_status')) {
        toast.error('You are not authorized to change project status')
        return
    }
    openStatusModal(project)
}

const openStatusModal = (project: any) => {
  statusForm.value = {
    id: project.id,
    status: project.status
  }
  isStatusModalOpen.value = true
}

const updateStatus = async (project: any, status: string = '') => {
  const newStatus = status || statusForm.value.status
  if (!newStatus) return

  try {
    await api.patch(`/projects/${project.id || statusForm.value.id}/status`, {
      status: newStatus
    })
    toast.success('Project status updated successfully')
    isStatusModalOpen.value = false
    activeStatusDropdown.value = null
    fetchProjects(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error updating project status')
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'planning': return CalendarIcon
    case 'in_progress': return PlayCircleIcon
    case 'completed': return CheckCircleIcon
    case 'on_hold': return PauseCircleIcon
    case 'cancelled': return XCircleIcon
    case 'pending': return ClockIcon
    case 'failed': return AlertCircleIcon
    default: return ClockIcon
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning': return 'text-blue-500'
    case 'in_progress': return 'text-yellow-500'
    case 'completed': return 'text-green-500'
    case 'on_hold': return 'text-orange-500'
    case 'cancelled': return 'text-red-500'
    case 'pending': return 'text-yellow-500'
    case 'failed': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

onMounted(() => {
  fetchProjects()
  fetchCustomers()
  fetchTowns()
  window.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns)
})

const truncate = (s: string | undefined, n = 40) => {
  if (!s) return ''
  return s.length > n ? s.substring(0, n - 1) + '…' : s
}

const fullAddress = (p: any) => {
  if (!p) return ''
  const parts = [p.plot_number, p.address, p.town?.name, p.city?.name, p.state?.name, p.country?.name]
  return parts.filter(Boolean).join(', ')
}

const paymentsTotal = (p: any) => {
  if (!p) return 0
  // support different withSum output shapes
  return p.payments_sum_amount ?? (p.payments_sum?.amount ?? p.payments_sum ?? 0)
}

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') => formatAmount(value, currency, { compact: true })

const getProjectThumbnail = (p: any) => {
  if (!p) return ''
  // direct url fields
  const direct = p.thumbnail_url || p.thumbnail?.file_path || p.thumbnail?.thumb_url
  if (direct) return makeAbsoluteUrl(direct)
  // look into documents for a thumbnail category
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

const goAttachDocs = (model: string, id: number) => {
  router.push({ path: '/documents/attach', query: { model, id } })
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) {
    img.style.display = 'none'
  }
}

const makeAbsoluteUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  // Get base URL and remove /api suffix if present
  let fileBase = (import.meta.env.VITE_FILE_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window?.location?.origin || ''
  
  // Remove /api from the end if it exists
  fileBase = fileBase.replace(/\/api\/?$/, '')
  const base = fileBase.replace(/\/$/, '')
  
  const relative = path.startsWith('/') ? path : `/storage/${path}`
  return `${base}${relative}`
}

</script>
