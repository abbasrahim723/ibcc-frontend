<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="space-y-6">
      <!-- Header with Filters -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Payments</h3>

          <button
            v-if="can('scheduled_payments', 'create')"
            @click="router.push('/scheduled-payments/create')"
            class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
          >
            <span class="flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Schedule</span>
            </span>
          </button>
        </div>

        <!-- Filters Row -->
        <div v-if="loadingFilters" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div v-for="n in 7" :key="n" class="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <ProjectSelect
            v-model="filters.project_id"
            :projects="projects"
            placeholder="All Projects"
            :show-details="false"
            @change="handleFilterChange"
            class="w-full"
          />

          <GenericSelect
            v-model="filters.payer_type"
            :options="payerTypeOptions"
            placeholder="All Payer Types"
            @change="handlePayerTypeChange"
          />

          <CustomerSelect
            v-if="filters.payer_type === 'customer' || !filters.payer_type"
            v-model="filters.payer_id"
            :customers="customers"
            placeholder="All Payers"
            :show-address="false"
            @change="handleFilterChange"
            class="w-full"
          />
          <GenericSelect
            v-else-if="filters.payer_type === 'supplier'"
            v-model="filters.payer_id"
            :options="supplierOptions"
            placeholder="All Suppliers"
            searchable
            @change="handleFilterChange"
          />
          <GenericSelect
            v-else
            v-model="filters.payer_id"
            :options="userOptions"
            placeholder="All Labour/Staff"
            searchable
            @change="handleFilterChange"
          />

          <GenericSelect
            v-model="filters.direction"
            :options="directionOptions"
            placeholder="All Directions"
            @change="handleFilterChange"
          />

          <GenericSelect
            v-model="filters.frequency"
            :options="frequencyOptions"
            placeholder="All Frequencies"
            @change="handleFilterChange"
          />

          <GenericSelect
            v-model="filters.status"
            :options="statusOptions"
            placeholder="All Statuses"
            @change="handleFilterChange"
          />

          <input
            v-model="filters.search"
            @input="handleFilterChange"
            type="text"
            placeholder="Search schedules..."
            class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Kanban Board -->
      <div v-if="loading" class="grid grid-cols-1 gap-6 w-full" :style="{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }">
        <!-- Skeleton Column 1 -->
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50 min-h-[70vh]">
          <div class="mb-4 flex items-center justify-between">
            <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-5 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="space-y-3">
            <div v-for="n in 3" :key="n" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div class="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="flex items-center justify-between mb-3">
                <div class="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="flex gap-2">
                <div class="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Column 2 -->
        <div class="rounded-xl border border-gray-200 bg-yellow-50 p-4 dark:border-gray-800 dark:bg-yellow-900/10 min-h-[70vh]">
          <div class="mb-4 flex items-center justify-between">
            <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-5 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="space-y-3">
            <div v-for="n in 2" :key="n" class="rounded-lg border border-yellow-200 bg-white p-4 shadow-sm dark:border-yellow-900/30 dark:bg-gray-800">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div class="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="h-6 w-16 animate-pulse rounded-full bg-yellow-200 dark:bg-yellow-700"></div>
              </div>
              <div class="flex items-center justify-between mb-3">
                <div class="h-5 w-18 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="flex gap-2">
                <div class="h-8 w-16 animate-pulse rounded bg-green-200 dark:bg-green-700"></div>
                <div class="h-8 w-16 animate-pulse rounded bg-red-200 dark:bg-red-700"></div>
                <div class="h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Column 3 -->
        <div class="rounded-xl border border-gray-200 bg-green-50 p-4 dark:border-gray-800 dark:bg-green-900/10 min-h-[70vh]">
          <div class="mb-4 flex items-center justify-between">
            <div class="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-5 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="space-y-3">
            <div v-for="n in 4" :key="n" class="rounded-lg border border-green-200 bg-white p-4 shadow-sm dark:border-green-900/30 dark:bg-gray-800">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="h-4 w-30 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div class="h-3 w-22 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="h-6 w-16 animate-pulse rounded-full bg-green-200 dark:bg-green-700"></div>
              </div>
              <div class="flex items-center justify-between mb-3">
                <div class="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="flex gap-2">
                <div class="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="grid grid-cols-1 gap-6 w-full"
        :style="{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }"
      >
        <!-- Upcoming Column -->
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50 min-h-[70vh] max-h-[70vh]">
          <div class="mb-4 flex items-center justify-between">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Upcoming
              <span class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {{ upcomingSchedules.length }}
              </span>
            </h4>
          </div>

          <div class="space-y-3 h-[60vh] overflow-y-auto">
            <ScheduleCard
              v-for="schedule in upcomingSchedules"
              :key="schedule.id"
              :schedule="schedule"
              @edit="editSchedule"
              @delete="confirmDelete"
              @toggle-active="toggleScheduleActive"
              @preview="goToPreview"
            />
            <div v-if="upcomingSchedules.length === 0" class="text-center py-8 text-sm text-gray-500">
              No upcoming schedules
            </div>
          </div>
        </div>

        <!-- Due/Pending Review Column -->
        <div class="rounded-xl border border-gray-200 bg-yellow-50 p-4 dark:border-gray-800 dark:bg-yellow-900/10 min-h-[70vh] max-h-[70vh]">
          <div class="mb-4 flex items-center justify-between">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Due / Pending Review
              <span class="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                {{ dueSchedules.length }}
              </span>
            </h4>
          </div>

          <div class="space-y-3 h-[60vh] overflow-y-auto">
            <ScheduleCard
              v-for="schedule in dueSchedules"
              :key="schedule.id"
              :schedule="schedule"
              :is-due="true"
              @edit="editSchedule"
              @delete="confirmDelete"
              @toggle-active="toggleScheduleActive"
              @preview="goToPreview"
            />
            <div v-if="dueSchedules.length === 0" class="text-center py-8 text-sm text-gray-500">
              No schedules due
            </div>
          </div>
        </div>

        <!-- Active Column -->
        <div class="rounded-xl border border-gray-200 bg-green-50 p-4 dark:border-gray-800 dark:bg-green-900/10 min-h-[70vh] max-h-[70vh]">
          <div class="mb-4 flex items-center justify-between">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Active / Ended
              <span class="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {{ mergedActiveEnded.length }}
              </span>
            </h4>
          </div>

          <div class="space-y-3 h-[60vh] overflow-y-auto">
            <ScheduleCard
              v-for="schedule in mergedActiveEnded"
              :key="schedule.id"
              :schedule="schedule"
              :is-ended="!schedule.is_active"
              @edit="editSchedule"
              @delete="confirmDelete"
              @toggle-active="toggleScheduleActive"
              @preview="goToPreview"
            />
            <div v-if="mergedActiveEnded.length === 0" class="text-center py-8 text-sm text-gray-500">
              No active or ended schedules
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Generated Payments Lanes -->
    <div class="space-y-4 mt-10">
      <div v-if="loading" class="flex items-center justify-between">
        <div class="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div v-else class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Generated Payments</h3>
        <p class="text-sm text-gray-500">Drag payments to Approve or Reject, or use action buttons.</p>
      </div>
      <div
        v-if="loading"
        class="grid gap-4 w-full"
        :style="{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }"
      >
        <!-- Skeleton Pending Review Lane -->
        <div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/10">
          <div class="mb-3 flex items-center justify-between">
            <div class="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-5 w-8 animate-pulse rounded-full bg-white/80"></div>
          </div>
          <div class="space-y-3">
            <div v-for="n in 2" :key="n" class="rounded-lg border border-yellow-200 bg-white p-3 shadow-sm dark:border-yellow-900/30 dark:bg-gray-900">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                  <div class="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="h-5 w-16 animate-pulse rounded-full bg-yellow-200 dark:bg-yellow-700"></div>
              </div>
              <div class="flex items-center justify-between mb-3">
                <div class="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="flex gap-2">
                <div class="h-8 w-16 animate-pulse rounded bg-green-200 dark:bg-green-700"></div>
                <div class="h-8 w-16 animate-pulse rounded bg-red-200 dark:bg-red-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Approved Lane -->
        <div class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
          <div class="mb-3 flex items-center justify-between">
            <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-5 w-8 animate-pulse rounded-full bg-white/80"></div>
          </div>
          <div class="space-y-3">
            <div v-for="n in 3" :key="n" class="rounded-lg border border-green-200 bg-white p-3 shadow-sm dark:border-green-900/30 dark:bg-gray-900">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                  <div class="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="h-5 w-16 animate-pulse rounded-full bg-green-200 dark:bg-green-700"></div>
              </div>
              <div class="flex items-center justify-between mb-3">
                <div class="h-6 w-18 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Rejected Lane -->
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
          <div class="mb-3 flex items-center justify-between">
            <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-5 w-8 animate-pulse rounded-full bg-white/80"></div>
          </div>
          <div class="space-y-3">
            <div v-for="n in 1" :key="n" class="rounded-lg border border-red-200 bg-white p-3 shadow-sm dark:border-red-900/30 dark:bg-gray-900">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="h-4 w-30 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
                  <div class="h-3 w-22 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div class="h-5 w-16 animate-pulse rounded-full bg-red-200 dark:bg-red-700"></div>
              </div>
              <div class="flex items-center justify-between mb-3">
                <div class="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="grid gap-4 w-full"
        :style="{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }"
      >
        <!-- Pending Review -->
        <div
          class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/10"
          @dragover.prevent
          @drop.prevent="handleDrop('approve')"
        >
          <div class="mb-3 flex items-center justify-between">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-300">
              Pending Review
              <span class="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/40">
                {{ pendingPayments.length }}
              </span>
            </h4>
          </div>
          <div class="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
            <div
              v-for="payment in pendingPayments"
              :key="payment.id"
              class="rounded-lg border border-yellow-200 bg-white p-3 shadow-sm dark:border-yellow-900/30 dark:bg-gray-900"
              draggable="true"
              @dragstart="onDragStart(payment)"
              @dragend="onDragEnd"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ payment.title || payment.schedule?.title || 'Scheduled Payment' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ payment.schedule?.project?.name || 'No project' }}
                  </div>
                </div>
                <span class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {{ payment.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <div class="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                  {{ formatCurrency(payment.amount, payment.currency) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Due {{ formatDate(payment.payment_date || payment.due_date) }}
                </div>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <button
                  class="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  @click="approvePaymentAction(payment.id)"
                >
                  Approve
                </button>
                <button
                  class="flex-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                  @click="rejectPaymentAction(payment.id)"
                >
                  Reject
                </button>
              </div>
            </div>
            <div v-if="pendingPayments.length === 0" class="text-center py-6 text-sm text-gray-500">
              No pending payments
            </div>
          </div>
        </div>

        <!-- Approved / Completed -->
        <div
          class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10"
          @dragover.prevent
          @drop.prevent="handleDrop('approve')"
        >
          <div class="mb-3 flex items-center justify-between">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-green-700 dark:text-green-300">
              Approved / Completed
              <span class="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40">
                {{ approvedPayments.length }}
              </span>
            </h4>
          </div>
          <div class="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
            <div
              v-for="payment in approvedPayments"
              :key="payment.id"
              class="rounded-lg border border-green-200 bg-white p-3 shadow-sm dark:border-green-900/30 dark:bg-gray-900"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ payment.title || payment.schedule?.title || 'Approved Payment' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ payment.schedule?.project?.name || 'No project' }}
                  </div>
                </div>
                <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {{ payment.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <div class="text-lg font-bold text-green-700 dark:text-green-300">
                  {{ formatCurrency(payment.amount, payment.currency) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(payment.payment_date || payment.due_date) }}
                </div>
              </div>
            </div>
            <div v-if="approvedPayments.length === 0" class="text-center py-6 text-sm text-gray-500">
              No approved payments
            </div>
          </div>
        </div>

        <!-- Rejected -->
        <div
          class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10"
          @dragover.prevent
          @drop.prevent="handleDrop('reject')"
        >
          <div class="mb-3 flex items-center justify-between">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
              Rejected
              <span class="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900/40">
                {{ rejectedPayments.length }}
              </span>
            </h4>
          </div>
          <div class="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
            <div
              v-for="payment in rejectedPayments"
              :key="payment.id"
              class="rounded-lg border border-red-200 bg-white p-3 shadow-sm dark:border-red-900/30 dark:bg-gray-900"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ payment.title || payment.schedule?.title || 'Rejected Payment' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ payment.schedule?.project?.name || 'No project' }}
                  </div>
                </div>
                <span class="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-300">
                  {{ payment.status }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <div class="text-lg font-bold text-red-700 dark:text-red-300">
                  {{ formatCurrency(payment.amount, payment.currency) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(payment.payment_date || payment.due_date) }}
                </div>
              </div>
            </div>
            <div v-if="rejectedPayments.length === 0" class="text-center py-6 text-sm text-gray-500">
              No rejected payments
            </div>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ProjectSelect from '@/components/forms/ProjectSelect.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'
import ScheduleCard from '@/components/schedules/ScheduleCard.vue'
import { usePaymentSchedule } from '@/composables/usePaymentSchedule'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'
import api from '@/utils/axios'
import { formatAmount } from '@/utils/currency'

const router = useRouter()
const toast = useToast()
const { can } = usePermissions()
const { schedules, loading, fetchSchedules, deleteSchedule, toggleActive, quickApprovePayment, rejectPayment } = usePaymentSchedule()

const pageTitle = ref('Scheduled Payments')

const payerTypeOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'user', label: 'Labour/Staff' }
]

const directionOptions = [
  { value: 'incoming', label: 'Incoming' },
  { value: 'outgoing', label: 'Outgoing' }
]

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'due', label: 'Due' },
  { value: 'ended', label: 'Ended' }
]

const supplierOptions = computed(() => suppliers.value.map(s => ({ value: s.id, label: s.name })))
const userOptions = computed(() => users.value.map(u => ({ value: u.id, label: u.name })))

const projects = ref<any[]>([])
const customers = ref<any[]>([])
const suppliers = ref<any[]>([])
const users = ref<any[]>([])
const showPreviewModal = ref(false)
const selectedSchedule = ref<any>(null)
const draggingPayment = ref<any>(null)
const searchDebounce = ref<any>(null)
const loadingFilters = ref(true)

const filters = ref({
  project_id: '',
  payer_id: '',
  payer_type: '',
  direction: '',
  frequency: '',
  status: '',
  search: ''
})

// Categorize schedules into exclusive kanban columns
const categorizedSchedules = computed(() => {
  const now = new Date()
  const upcoming: any[] = []
  const due: any[] = []
  const active: any[] = []
  const ended: any[] = []

  schedules.value.forEach(schedule => {
    if (!schedule.is_active) {
      ended.push(schedule)
      return
    }

    if (schedule.next_due_date) {
      const nextDate = new Date(schedule.next_due_date)

      if (!isNaN(nextDate.getTime())) {
        if (nextDate <= now) {
          due.push(schedule)
          return
        }

        upcoming.push(schedule)
        return
      }
    }

    active.push(schedule)
  })

  return { upcoming, due, active, ended }
})

const upcomingSchedules = computed(() => categorizedSchedules.value.upcoming)
const dueSchedules = computed(() => categorizedSchedules.value.due)
const activeSchedules = computed(() => categorizedSchedules.value.active)
const endedSchedules = computed(() => categorizedSchedules.value.ended)
const mergedActiveEnded = computed(() => [...activeSchedules.value, ...endedSchedules.value])

// Payments generated from schedules for review/approval lanes
const allSchedulePayments = computed(() => {
  return schedules.value.flatMap(schedule => {
    const payments = schedule.payments || []
    return payments.map((payment: any) => ({ ...payment, schedule }))
  })
})

const pendingPayments = computed(() => {
  return allSchedulePayments.value.filter(p => ['scheduled', 'pending'].includes(p.status))
})

const approvedPayments = computed(() => {
  return allSchedulePayments.value.filter(p => p.status === 'completed')
})

const rejectedPayments = computed(() => {
  return allSchedulePayments.value.filter(p => p.status === 'rejected')
})

const handleFilterChange = () => {
  loadSchedules()
}

const loadSchedules = async () => {
  try {
    await fetchSchedules(filters.value as any)
  } catch (error) {
    console.error('Failed to load schedules:', error)
  }
}

const loadProjects = async () => {
  try {
    const res = await api.get('/projects', { params: { per_page: 200 } })
    projects.value = res.data.data || res.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

const loadCustomers = async () => {
  try {
    const res = await api.get('/customers', { params: { per_page: 200 } })
    customers.value = res.data.data || res.data
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const loadSuppliers = async () => {
  try {
    const res = await api.get('/suppliers', { params: { per_page: 200 } })
    suppliers.value = res.data.data || res.data
  } catch (error) {
    console.error('Failed to load suppliers:', error)
  }
}

const loadUsers = async () => {
  try {
    const res = await api.get('/users/list')
    users.value = res.data.data || res.data
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loadingFilters.value = false
  }
}

const editSchedule = (schedule: any) => {
  router.push(`/scheduled-payments/${schedule.id}/edit`)
}

const confirmDelete = async (schedule: any) => {
  if (!confirm(`Are you sure you want to delete this schedule: ${schedule.title || 'Untitled'}?`)) {
    return
  }

  try {
    await deleteSchedule(schedule.id)
    await loadSchedules()
  } catch (error) {
    console.error('Failed to delete schedule:', error)
  }
}

const toggleScheduleActive = async (schedule: any) => {
  try {
    await toggleActive(schedule.id, !schedule.is_active)
    await loadSchedules()
  } catch (error) {
    console.error('Failed to toggle schedule:', error)
  }
}

const goToPreview = (schedule: any) => {
  router.push(`/scheduled-payments/${schedule.id}/preview`)
}

const handlePayerTypeChange = () => {
  filters.value.payer_id = ''
  handleFilterChange()
}

// Debounce search input to avoid spamming API
watch(() => filters.value.search, () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }
  searchDebounce.value = setTimeout(() => {
    loadSchedules()
  }, 300)
})

const onDragStart = (payment: any) => {
  draggingPayment.value = payment
}

const onDragEnd = () => {
  draggingPayment.value = null
}

const handleDrop = async (target: 'approve' | 'reject') => {
  if (!draggingPayment.value) return

  try {
    if (target === 'approve') {
      await quickApprovePayment(draggingPayment.value.id)
      toast.success('Payment approved')
    } else {
      await rejectPayment(draggingPayment.value.id, 'Rejected from board')
      toast.success('Payment rejected')
    }
    await loadSchedules()
  } catch (error) {
    console.error('Failed to update payment:', error)
  } finally {
    draggingPayment.value = null
  }
}

const formatCurrency = (value: number, currency: string = 'PKR') =>
  formatAmount(value, currency, { compact: true })

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const approvePaymentAction = async (paymentId: number) => {
  try {
    await quickApprovePayment(paymentId)
    await loadSchedules()
    toast.success('Payment approved')
  } catch (error) {
    console.error('Failed to approve payment:', error)
  }
}

const rejectPaymentAction = async (paymentId: number) => {
  try {
    await rejectPayment(paymentId, 'Rejected from board')
    await loadSchedules()
    toast.success('Payment rejected')
  } catch (error) {
    console.error('Failed to reject payment:', error)
  }
}

onMounted(() => {
  loadSchedules()
  loadProjects()
  loadCustomers()
  loadSuppliers()
  loadUsers()
})
</script>
