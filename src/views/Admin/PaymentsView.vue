<template>
  <admin-layout :key="expensesOnly ? 'expenses' : 'payments'">
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h3 class="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white">{{ currentPageTitle }}</h3>
              <div class="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 dark:border-gray-700">
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md"
                  :class="viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  @click="setViewMode('list')"
                >
                  List
                </button>
                <button
                  class="px-3 py-1 text-sm font-medium rounded-md"
                  :class="viewMode === 'kanban' ? 'bg-brand-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  @click="setViewMode('kanban')"
                >
                  Kanban
                </button>
              </div>
            </div>
            <div v-if="can('payments', 'create')">
              <button
                @click="router.push(expensesOnly ? '/payments/create?expense=1' : '/payments/create')"
                class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
              >
                <span class="flex items-center gap-2">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="hidden md:inline">{{ expensesOnly ? 'New Expense' : 'New Payment' }}</span>
                </span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-center">
            <ProjectSelect
              v-model="filters.project_id"
              :projects="projects"
              placeholder="All Projects"
              :show-details="false"
              @change="handleSearch"
              class="w-full"
            />

            <CustomerSelect
              v-if="!expensesOnly"
              v-model="filters.customer_id"
              :customers="customers"
              placeholder="All Payers"
              :show-address="false"
              @change="handleSearch"
              class="w-full"
            />

            <StatusSelect
              v-model="filters.status"
              :statuses="['scheduled','draft','pending', 'completed', 'failed', 'cancelled', 'rejected']"
              placeholder="All Status"
              @change="handleSearch"
              class="w-full"
            />

            <DateRangePicker
              v-model="filters.date_range"
              @change="handleSearch"
              class="w-full"
            />

            <div v-if="!expensesOnly" class="flex items-center gap-2">
              <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  v-model="filters.show_expenses_only"
                  true-value="1"
                  false-value=""
                  @change="handleExpensesToggle"
                  class="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Expenses only
              </label>
            </div>

            <div class="col-span-1 sm:col-span-2 lg:col-span-5">
               <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                :placeholder="expensesOnly ? 'Search expenses...' : 'Search payments...'"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div v-if="viewMode === 'list'" class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="overflow-x-auto max-h-[calc(100vh-250px)] overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 relative">
              <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-16">#</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[220px]">Project</th>
                  <th v-if="!expensesOnly" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[200px]">Payer</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Date</th>
                  <th v-if="!expensesOnly" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[150px]">Received By</th>
                  <th v-if="!expensesOnly" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[150px]">Approved By</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[100px]">Status</th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ payment.id }}
                  </td>
                  <td class="px-4 py-4">
                    <div v-if="payment.project" class="flex items-center gap-3">
                      <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <img
                          v-if="getProjectThumbnail(payment.project)"
                          :src="getProjectThumbnail(payment.project)"
                          :alt="payment.project.name"
                          class="h-full w-full object-cover"
                        />
                        <div v-else class="h-full w-full flex items-center justify-center text-sm font-bold text-gray-400 dark:text-gray-600">
                          {{ payment.project.name?.charAt(0)?.toUpperCase() }}
                        </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <router-link :to="`/projects/${payment.project.id}`" class="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">
                            {{ payment.project.name }}
                          </router-link>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ payment.project.plot_number || '—' }}</div>
                      </div>
                    </div>
                    <span v-else class="text-sm text-gray-400">—</span>
                  </td>
                  <td v-if="!expensesOnly" class="px-4 py-4">
                    <router-link
                      v-if="payment.payer"
                      :to="`/customers/${payment.payer.id}`"
                      class="flex items-center gap-2 group"
                    >
                      <div class="h-8 w-8 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:border-brand-400 transition-colors">
                        <img
                          v-if="getCustomerPhoto(payment.payer)"
                          :src="getCustomerPhoto(payment.payer)"
                          :alt="formatCustomerName(payment.payer)"
                          class="h-full w-full object-cover"
                        />
                        <div v-else class="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-600">
                          {{ payment.payer?.name?.charAt(0)?.toUpperCase() || '—' }}
                        </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-sm font-medium text-brand-600 dark:text-brand-400 truncate max-w-[180px] group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                          {{ formatCustomerName(payment.payer) || payment.payer_id || '—' }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {{ payment.payer?.address || payment.payer?.street_address || '—' }}
                        </div>
                      </div>
                    </router-link>
                    <div v-else class="text-sm text-gray-400">—</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                       <span v-if="payment.direction === 'outgoing'" class="text-red-500" title="Outgoing">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                       </span>
                       <span v-else class="text-green-500" title="Incoming">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                       </span>
                       {{ formatCurrency(payment.amount, payment.currency) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(payment.payment_date) }}
                  </td>
                  <td v-if="!expensesOnly" class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     <div class="flex items-center gap-2">
                        <div v-if="payment.received_by" class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                           {{ payment.received_by.name?.charAt(0) }}
                        </div>
                        <span class="truncate max-w-[120px]">{{ payment.received_by?.name || '—' }}</span>
                     </div>
                  </td>
                  <td v-if="!expensesOnly" class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     <div class="flex items-center gap-2">
                        <div v-if="payment.approved_by" class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                           {{ payment.approved_by.name?.charAt(0) }}
                        </div>
                        <span class="truncate max-w-[120px]">{{ payment.approved_by?.name || '—' }}</span>
                     </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="relative group">
                      <button
                        @click.stop="can('payments', 'change_status') ? toggleStatusDropdown(payment.id) : null"
                        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-all duration-200"
                        :class="[
                          {
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': payment.status === 'completed',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': payment.status === 'pending',
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': payment.status === 'failed' || payment.status === 'cancelled',
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400': !['completed', 'pending', 'failed', 'cancelled'].includes(payment.status)
                          },
                          can('payments', 'change_status') ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                        ]"
                      >
                        <component :is="getStatusIcon(payment.status)" class="w-3.5 h-3.5" />
                        {{ payment.status }}
                        <svg v-if="can('payments', 'change_status')" class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      </button>
                      <div v-if="payment.is_scheduled" class="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                        Scheduled
                        <router-link v-if="payment.schedule_id" :to="`/scheduled-payments/${payment.schedule_id}/edit`" class="underline hover:text-brand-800">
                          View
                        </router-link>
                      </div>

                      <!-- Inline Status Dropdown -->
                      <div v-if="activeStatusDropdown === payment.id" class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                        <div class="py-1">
                          <button v-for="status in ['pending', 'completed', 'failed', 'cancelled']"
                            :key="status"
                            @click="updatePaymentStatus(payment, status)"
                            class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 capitalize transition-colors"
                            :class="{'bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 font-medium': payment.status === status}"
                          >
                            <component :is="getStatusIcon(status)" class="w-4 h-4" :class="getStatusColor(status)" />
                            {{ status }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        v-if="can('documents', 'attach')"
                        @click="goAttachDocs('App\\Models\\Payment', payment.id)"
                        class="p-1.5 rounded-md text-brand-600 hover:bg-gray-50 dark:text-brand-400 dark:hover:bg-brand-900/30"
                        title="Attach Documents"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-9l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                      <button
                        v-if="payment.status === 'pending'"
                        @click="can('payments', 'edit') ? approvePayment(payment) : toast.error('You do not have permission to approve payments')"
                        class="p-1.5 rounded-md transition-colors"
                        :class="[
                          can('payments', 'edit')
                            ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30'
                            : 'text-green-600/50 cursor-not-allowed dark:text-green-400/50'
                        ]"
                        title="Approve Payment"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <router-link
                        v-if="can('payments', 'edit')"
                        :to="`/payments/${payment.id}/edit`"
                        class="p-1.5 text-brand-600 hover:bg-brand-50 rounded-md transition-colors dark:text-brand-400 dark:hover:bg-brand-900/30"
                        title="Edit Payment"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </router-link>
                      <button
                        v-else
                        @click="toast.error('You do not have permission to edit payments')"
                        class="p-1.5 text-brand-600/50 cursor-not-allowed rounded-md dark:text-brand-400/50"
                        title="Edit Payment (Unauthorized)"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="payments.length === 0">
                  <td :colspan="expensesOnly ? 7 : 9" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    {{ expensesOnly ? 'No expenses found' : 'No payments found' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="col in kanbanColumns"
            :key="col.key"
            class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40 p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {{ col.title }} ({{ groupedPayments[col.key]?.length || 0 }})
              </h4>
            </div>
            <div class="space-y-3 max-h-[60vh] overflow-auto">
              <div
                v-for="p in groupedPayments[col.key] || []"
                :key="p.id"
                class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img v-if="getProjectThumbnail(p.project)" :src="getProjectThumbnail(p.project)" class="h-full w-full object-cover" />
                      <div v-else class="h-full w-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {{ p.project?.name?.charAt(0)?.toUpperCase() || '-' }}
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{{ formatCurrency(p.amount, p.currency) }}</span>
                        <span v-if="p.direction === 'outgoing'" class="text-red-500 text-xs font-semibold">Out</span>
                        <span v-else class="text-green-600 text-xs font-semibold">In</span>
                      </div>
                      <div class="text-xs text-gray-600 dark:text-gray-300">
                        <router-link
                          v-if="p.project"
                          :to="`/projects/${p.project.id}`"
                          class="text-brand-600 hover:underline"
                        >
                          {{ p.project?.name || 'No project' }}
                        </router-link>
                        <span v-else>{{ p.project?.name || 'No project' }}</span>
                        · {{ formatDate(p.payment_date) }}
                      </div>
                      <router-link
                        v-if="p.payer"
                        :to="`/customers/${p.payer.id}`"
                        class="mt-1 flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        <div class="h-6 w-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <img v-if="getCustomerPhoto(p.payer)" :src="getCustomerPhoto(p.payer)" class="h-full w-full object-cover" />
                          <div v-else class="h-full w-full flex items-center justify-center text-[10px] font-semibold text-gray-500">
                            {{ p.payer?.name?.charAt(0)?.toUpperCase() || '-' }}
                          </div>
                        </div>
                        <span class="truncate">{{ formatCustomerName(p.payer) }}</span>
                      </router-link>
                      <div class="mt-1 text-[11px] text-gray-500 dark:text-gray-400 flex gap-3" v-if="!expensesOnly">
                        <span v-if="p.received_by">Received: {{ p.received_by?.name || p.received_by?.full_name || '-' }}</span>
                        <span v-if="p.approved_by">Approved: {{ p.approved_by?.name || p.approved_by?.full_name || '-' }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="text-xs capitalize px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-green-100 text-green-700': p.status === 'completed',
                      'bg-yellow-100 text-yellow-700': p.status === 'pending',
                      'bg-red-100 text-red-700': ['failed','cancelled','rejected'].includes(p.status),
                      'bg-gray-100 text-gray-700': true
                    }"
                  >
                    {{ p.status }}
                  </span>
                </div>

                <div class="mt-2 flex flex-wrap gap-2">
                  <router-link
                    :to="`/payments/${p.id}/edit`"
                    class="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-brand-600"
                  >
                    Edit
                  </router-link>
                  <button
                    v-if="p.status === 'pending' && can('payments','edit')"
                    @click="approvePayment(p)"
                    class="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    v-if="p.status === 'pending' && can('payments','edit')"
                    @click="updatePaymentStatus(p, 'failed')"
                    class="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Reject
                  </button>
                  <button
                    v-if="can('documents','attach')"
                    @click="goAttachDocs('App\\Models\\Payment', p.id)"
                    class="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  >
                    Docs
                  </button>
                </div>
              </div>
              <div v-if="(groupedPayments[col.key]?.length || 0) === 0" class="text-xs text-gray-500 dark:text-gray-400">
                No items
              </div>
            </div>
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
  </admin-layout>

  <ConfirmationModal
    :is-open="showConfirm"
    title="Approve payment"
    message="Are you sure you want to approve this payment?"
    confirm-button-text="Approve"
    @close="closeConfirm"
    @confirm="confirmApprove"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import ProjectSelect from '@/components/forms/ProjectSelect.vue'
import StatusSelect from '@/components/forms/StatusSelect.vue'
import DateRangePicker from '@/components/forms/DateRangePicker.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { formatAmount } from '@/utils/currency'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'

const props = defineProps({
  expensesOnly: { type: Boolean, default: false }
})
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
const authStore = useAuthStore()
const { can } = usePermissions()
const currentPageTitle = ref('Payments')
const payments = ref<any[]>([])
const activeStatusDropdown = ref<number | null>(null)
const projects = ref<any[]>([])
const customers = ref<any[]>([])
const searchQuery = ref('')
const filters = ref({
  project_id: '',
  customer_id: '',
  status: '',
  date_range: [] as string[],
  show_expenses_only: ''
})
const viewMode = ref<'list' | 'kanban'>('list')
const groupedPayments = computed(() => {
  const groups: Record<string, any[]> = {
    pending: [],
    completed: [],
    failed: [],
    cancelled: [],
    other: []
  }
  payments.value.forEach((p) => {
    const key = groups[p.status] ? p.status : 'other'
    groups[key].push(p)
  })
  return groups
})

const kanbanColumns = [
  { key: 'pending', title: 'Pending' },
  { key: 'completed', title: 'Completed' },
  { key: 'failed', title: 'Failed' },
  { key: 'cancelled', title: 'Cancelled' },
  { key: 'other', title: 'Other' }
]

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15,
  from: 0,
  to: 0
})

const toggleStatusDropdown = (id: number) => {
  if (activeStatusDropdown.value === id) {
    activeStatusDropdown.value = null
  } else {
    activeStatusDropdown.value = id
  }
}

const closeStatusDropdown = () => {
  activeStatusDropdown.value = null
}

const fetchPayments = async (page = 1) => {
  try {
    const params: any = {
      page,
      search: searchQuery.value || undefined,
      project_id: filters.value.project_id || undefined,
      customer_id: props.expensesOnly ? undefined : (filters.value.customer_id || undefined),
      status: filters.value.status || undefined,
      category_id: filters.value.category_id || undefined,
      is_expense: (props.expensesOnly || filters.value.show_expenses_only) ? 1 : undefined
    }

    if (filters.value.date_range && filters.value.date_range.length === 2) {
      // Assuming backend expects start_date and end_date or a date_range param
      // Let's send start_date and end_date
      // Note: flatpickr range might be a string "YYYY-MM-DD to YYYY-MM-DD" or array depending on config/v-model
      // Our DateRangePicker emits the raw value. If it's a string with " to ", split it.
      // If it's an array, use indices.
      // Let's handle both just in case.
      let start, end
      if (Array.isArray(filters.value.date_range)) {
        start = filters.value.date_range[0]
        end = filters.value.date_range[1]
      } else if (typeof filters.value.date_range === 'string' && (filters.value.date_range as string).includes(' to ')) {
         const parts = (filters.value.date_range as string).split(' to ')
         start = parts[0]
         end = parts[1]
      }

      if (start && end) {
        params.start_date = start
        params.end_date = end
      }
    }

    const response = await api.get('/payments', { params })
    payments.value = response.data.data
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to
    }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching payments')
  }
}

const fetchProjects = async () => {
  try {
    const res = await api.get('/projects', { params: { per_page: 200, with: 'documents' } })
    projects.value = res.data.data || res.data
  } catch (e: any) {
    // ignore
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

const loadAll = (page = 1) => {
  currentPageTitle.value = props.expensesOnly ? 'Expenses' : 'Payments'
  fetchPayments(page)
  fetchProjects()
  fetchCustomers()
}

const handleSearch = () => loadAll(1)
const handleExpensesToggle = () => loadAll(1)
const changePage = (page: number) => loadAll(page)

const formatCurrency = (value: number | string | null | undefined, currency: string = 'PKR') => formatAmount(value, currency, { compact: true })

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const showConfirm = ref(false)
const confirmTarget = ref<any>(null)

const approvePayment = (payment: any) => {
  confirmTarget.value = payment
  showConfirm.value = true
}

const confirmApprove = async () => {
  if (!confirmTarget.value) return
  try {
    await api.put(`/payments/${confirmTarget.value.id}`, {
      status: 'completed',
      approved_by: authStore.user?.id
    })
    toast.success('Payment approved')
    showConfirm.value = false
    confirmTarget.value = null
    fetchPayments(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error approving payment')
  }
}

const updatePaymentStatus = async (payment: any, status: string) => {
  if (payment.status === status) return
  try {
    const approvedId =
      status === 'completed'
        ? (payment.approved_by?.id || authStore.user?.id || payment.approved_by || null)
        : (payment.approved_by?.id || payment.approved_by || null)

    await api.put(`/payments/${payment.id}`, {
      status: status,
      // ensure approved_by is an id, not a populated object
      approved_by: approvedId
    })
    toast.success(`Status updated to ${status}`)
    fetchPayments(pagination.value.current_page)
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error updating status')
  }
}

const getProjectThumbnail = (p: any) => {
  if (!p) return ''
  const direct = p.thumbnail_url || p.thumbnail?.file_path || p.thumbnail?.thumb_url
  if (direct) return makeAbsoluteUrl(direct)
  const docThumb = (p.documents || []).find((d: any) => (d.document_category || d.category || '').toLowerCase() === 'thumbnail' || (d.document_category || d.category || '').toLowerCase() === 'thumb')
  if (docThumb) return makeAbsoluteUrl(docThumb.file_path || docThumb.url || docThumb.thumb_url)
  return ''
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

const getCustomerPhoto = (c: any) => {
  if (!c) return ''
  const path = c.profile_photo_url || c.photo || c.avatar || c.profile_photo
  return path ? makeAbsoluteUrl(path) : ''
}

const formatCustomerName = (c: any) => {
  if (!c) return ''
  const prefix = c.name_prefix ? `${c.name_prefix} ` : ''
  const full = c.name || [c.first_name, c.last_name].filter(Boolean).join(' ')
  return (prefix + full).trim() || c.email || ''
}

const goAttachDocs = (model: string, id: number) => {
  router.push({ path: '/documents/attach', query: { model, id } })
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

onMounted(() => {
  const prefKey = props.expensesOnly ? 'expenses_view_mode' : 'payments_view_mode'
  const saved = localStorage.getItem(prefKey)
  viewMode.value = saved === 'kanban' ? 'kanban' : 'list'
  loadAll(1)
})

watch(() => props.expensesOnly, () => {
  const prefKey = props.expensesOnly ? 'expenses_view_mode' : 'payments_view_mode'
  const saved = localStorage.getItem(prefKey)
  viewMode.value = saved === 'kanban' ? 'kanban' : 'list'
  loadAll(1)
})

const setViewMode = (mode: 'list' | 'kanban') => {
  viewMode.value = mode
  const prefKey = props.expensesOnly ? 'expenses_view_mode' : 'payments_view_mode'
  localStorage.setItem(prefKey, mode)
}

// expose to template
const closeConfirm = () => {
  showConfirm.value = false
  confirmTarget.value = null
}
</script>
