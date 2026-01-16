<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div class="mb-6 flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Management</h3>

          <div class="flex flex-wrap items-center gap-3">
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
                @click="viewMode = 'kanban'"
                :class="[
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'kanban'
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                ]"
                title="Kanban View"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h6M4 12h6M4 18h6M14 6h6M14 12h6M14 18h6" />
                </svg>
              </button>
            </div>

            <button
              v-if="can('projects', 'create')"
              @click="router.push('/projects/create')"
              class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
            >
              <span class="flex items-center gap-2">
                <span class="hidden md:inline">Add Project</span>
                <span class="md:hidden">Add</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Filters row -->
        <div class="flex flex-wrap items-center gap-3">
          <GenericSelect
            v-model="filters.town_id"
            :options="townOptions"
            placeholder="All Towns"
            :loading="loadingTowns"
            searchable
            class="w-[180px]"
            @change="handleSearch"
          />

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
            class="min-w-[220px] flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
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
            <!-- Loading Skeleton -->
            <tr v-if="loading" v-for="n in 5" :key="'skeleton-' + n" class="animate-pulse">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div class="min-w-0 flex-1">
                    <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <div class="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="h-4 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
              </td>
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <div class="h-3 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                  <div class="h-3 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="h-6 bg-gray-200 rounded-full w-20 dark:bg-gray-700"></div>
              </td>
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div class="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div class="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
              </td>
            </tr>

            <!-- Actual Data Rows -->
            <tr v-else v-for="project in projects" :key="project.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
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

      <!-- Kanban View -->
      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <div
            v-for="col in kanbanColumns"
            :key="col.key"
            class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="['h-2.5 w-2.5 rounded-full', col.dot]"></span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ col.title }}</span>
              </div>
              <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {{ groupedProjects[col.key]?.length || 0 }}
              </span>
            </div>

            <div class="space-y-3">
              <!-- Kanban Loading Skeletons -->
              <div v-if="loading" v-for="n in 3" :key="'kanban-skeleton-' + n" class="animate-pulse">
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800/70">
                  <div class="flex items-start gap-3">
                    <div class="h-12 w-12 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <div class="h-4 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
                        <div class="h-5 bg-gray-200 rounded-full w-16 dark:bg-gray-700"></div>
                      </div>
                      <div class="flex items-center gap-1 mb-3">
                        <div class="h-3 w-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                        <div class="h-3 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                      </div>
                      <div class="flex flex-wrap items-center gap-2 mb-3">
                        <div class="h-6 bg-gray-200 rounded-full w-16 dark:bg-gray-700"></div>
                        <div class="h-6 bg-gray-200 rounded-full w-16 dark:bg-gray-700"></div>
                        <div class="h-6 bg-gray-200 rounded-full w-20 dark:bg-gray-700"></div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="h-6 w-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div class="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                    <div class="h-7 bg-gray-200 rounded-full w-12 dark:bg-gray-700"></div>
                    <div class="h-7 bg-gray-200 rounded-full w-12 dark:bg-gray-700"></div>
                    <div class="h-7 bg-gray-200 rounded-full w-12 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>

              <!-- Actual Kanban Cards -->
              <div
                v-else
                v-for="project in groupedProjects[col.key] || []"
                :key="project.id"
                class="rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/70"
              >
                <div class="flex items-start gap-3">
                  <div class="h-12 w-12 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
                    <img
                      v-if="getProjectThumbnail(project)"
                      :src="getProjectThumbnail(project)"
                      :alt="project.name"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
                      {{ project.name?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <button
                        @click="handleOpenProject(project)"
                        class="truncate text-sm font-semibold text-gray-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                      >
                        {{ project.name }}
                      </button>
                      <span :class="['rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize', col.chip]">
                        {{ project.status?.replace('_', ' ') || 'other' }}
                      </span>
                    </div>
                    <div class="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="truncate">{{ fullAddress(project) || 'No address' }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                    <svg class="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    {{ formatCurrency(project.incoming_payments_sum_amount || 0) }}
                  </div>
                  <div class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                    <svg class="h-3 w-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    {{ formatCurrency(project.outgoing_payments_sum_amount || 0) }}
                  </div>
                  <div v-if="project.contract_value" class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                    <span class="text-gray-500 dark:text-gray-400">Contract</span>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formatCurrency(project.contract_value) }}</span>
                  </div>
                </div>

                <div class="mt-3 flex items-center gap-2">
                  <router-link
                    v-if="project.customer"
                    :to="`/customers/${project.customer.id}`"
                    class="group inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-xs shadow-sm hover:shadow dark:bg-gray-800 dark:border dark:border-gray-700"
                  >
                    <div class="h-6 w-6 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <img v-if="getCustomerPhoto(project.customer)" :src="getCustomerPhoto(project.customer)" class="h-full w-full object-cover" @error="handleImageError" />
                      <div v-else class="flex h-full w-full items-center justify-center text-[11px] font-semibold text-gray-500">
                        {{ project.customer?.name?.charAt(0)?.toUpperCase() }}
                      </div>
                    </div>
                    <span class="truncate font-medium text-gray-800 group-hover:text-brand-600 dark:text-gray-100 dark:group-hover:text-brand-300">
                      {{ getCustomerDisplayName(project.customer) || 'Owner' }}
                    </span>
                  </router-link>
                  <span v-else class="text-xs text-gray-400">No owner</span>
                </div>

                <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <button
                    v-if="can('documents', 'attach')"
                    @click="goAttachDocs('App\\Models\\Project', project.id)"
                    class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Docs
                  </button>
                  <button
                    @click="handleEditProject(project)"
                    :disabled="!can('projects', 'edit')"
                    class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-900/20 dark:text-brand-200"
                  >
                    Edit
                  </button>
                  <button
                    v-if="can('projects', 'delete')"
                    @click="handleDeleteProject(project.id)"
                    class="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div v-if="(groupedProjects[col.key]?.length || 0) === 0" class="rounded-lg border border-dashed border-gray-200 px-3 py-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
                No projects in this lane
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && pagination.total > pagination.per_page" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results</div>
        <div class="flex gap-2">
          <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Previous</button>
          <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700">Next</button>
        </div>
      </div>

      <!-- Loading Pagination Skeleton -->
      <div v-if="loading" class="mt-4 flex items-center justify-between animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-48 dark:bg-gray-700"></div>
        <div class="flex gap-2">
          <div class="h-8 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
          <div class="h-8 bg-gray-200 rounded w-12 dark:bg-gray-700"></div>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Modal from '@/components/profile/Modal.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'
import StatusSelect from '@/components/forms/StatusSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { usePermissions } from '@/composables/usePermissions'
import { useViewPreferences } from '@/composables/useViewPreferences'
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
const { getViewMode, setViewMode: saveViewPreference } = useViewPreferences()
const currentPageTitle = ref('Projects')
const projects = ref<any[]>([])
const customers = ref<any[]>([])
const towns = ref<any[]>([])
const searchQuery = ref('')
const viewMode = ref<'list' | 'kanban'>(getViewMode('projects', 'list') as 'list' | 'kanban')
const loading = ref(false)
const loadingCustomers = ref(false)
const loadingTowns = ref(false)
const kanbanColumns = [
  { key: 'planning', title: 'Planning', dot: 'bg-blue-500', chip: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' },
  { key: 'in_progress', title: 'In Progress', dot: 'bg-amber-500', chip: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
  { key: 'on_hold', title: 'On Hold', dot: 'bg-orange-500', chip: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200' },
  { key: 'completed', title: 'Completed', dot: 'bg-green-500', chip: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' },
  { key: 'cancelled', title: 'Cancelled', dot: 'bg-red-500', chip: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' },
  { key: 'other', title: 'Other', dot: 'bg-gray-400', chip: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200' },
]

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

const groupedProjects = computed(() => {
  const groups: Record<string, any[]> = {
    planning: [],
    in_progress: [],
    on_hold: [],
    completed: [],
    cancelled: [],
    other: [],
  }

  projects.value.forEach((p) => {
    const key = (p?.status && groups[p.status] !== undefined) ? p.status : 'other'
    groups[key].push(p)
  })

  return groups
})

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
  loading.value = true
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
  } finally {
    loading.value = false
  }
}

const fetchCustomers = async () => {
  loadingCustomers.value = true
  try {
    const res = await api.get('/customers')
    customers.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  } finally {
    loadingCustomers.value = false
  }
}

const fetchTowns = async () => {
  loadingTowns.value = true
  try {
    const res = await api.get('/towns')
    towns.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
  } finally {
    loadingTowns.value = false
  }
}

const townOptions = computed(() => towns.value.map(t => ({ value: t.id, label: t.name })))

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

// Persist view mode changes to backend
watch(viewMode, (newMode) => {
  saveViewPreference('projects', newMode)
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
