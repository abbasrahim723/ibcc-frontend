<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="mx-auto w-full max-w-6xl">
      <!-- Loading Skeleton -->
      <div v-if="pageLoading" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <!-- Basic Information Section Skeleton -->
        <div class="space-y-6">
          <div>
            <div class="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Project -->
              <div class="md:col-span-2">
                <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Direction -->
              <div>
                <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Payer Type -->
              <div>
                <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Payer -->
              <div class="md:col-span-2">
                <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Title -->
              <div class="md:col-span-2">
                <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Amount & Currency -->
              <div>
                <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <div>
                <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Payment Method -->
              <div class="md:col-span-2">
                <div class="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Notes -->
              <div class="md:col-span-2">
                <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>

          <!-- Schedule Configuration Section Skeleton -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div class="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
            <div class="space-y-4">
              <!-- Schedule Type -->
              <div>
                <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="flex gap-4">
                  <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>

              <!-- Start Date -->
              <div>
                <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <!-- Recurring Options -->
              <div class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <!-- Frequency -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                    <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  </div>

                  <div>
                    <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                    <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    <div class="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mt-1"></div>
                  </div>
                </div>

                <!-- Day of Week -->
                <div>
                  <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div class="flex flex-wrap gap-2">
                    <div v-for="n in 7" :key="n" class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>

                <!-- Day of Month -->
                <div>
                  <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div class="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mt-1"></div>
                </div>

                <!-- End Condition -->
                <div>
                  <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div class="space-y-3">
                    <div class="flex items-center gap-2">
                      <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div class="h-11 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div class="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div class="h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                      <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notification Channels -->
              <div>
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div class="flex flex-wrap gap-3">
                  <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Section Skeleton -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div class="h-6 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div v-for="n in 6" :key="n" class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div class="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700 mt-3"></div>
            </div>
          </div>

          <!-- Actions Skeleton -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div class="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      <!-- Actual Form -->
      <div v-else class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Project -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project
                </label>
                <ProjectSelect
                  v-model="form.project_id"
                  :projects="projects"
                  placeholder="Select Project"
                  :show-details="true"
                  class="w-full"
                />
              </div>

              <!-- Direction -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Direction <span class="text-red-500">*</span>
                </label>
                <GenericSelect
                  v-model="form.direction"
                  :options="directionOptions"
                  placeholder="Select Direction"
                  required
                />
              </div>

              <!-- Payer Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payer Type <span class="text-red-500">*</span>
                </label>
                <GenericSelect
                  v-model="form.payer_type"
                  :options="payerTypeOptions"
                  placeholder="Select Type"
                  required
                  @change="form.payer_id = null"
                />
              </div>

              <!-- Payer -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ form.payer_type === 'customer' ? 'Customer' : form.payer_type === 'supplier' ? 'Supplier' : 'Labour/Staff' }} <span class="text-red-500">*</span>
                </label>
                <CustomerSelect
                  v-model="form.payer_id"
                  :customers="payerOptions"
                  :type="form.payer_type"
                  :placeholder="form.payer_type === 'customer' ? 'Select Customer' : form.payer_type === 'supplier' ? 'Select Supplier' : 'Select Labour/Staff'"
                  :show-address="true"
                  class="w-full"
                />
              </div>

              <!-- Title -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="e.g., Monthly Rent Payment"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <!-- Amount & Currency -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Amount <span class="text-red-500">*</span></label>
                <div class="flex h-11 items-stretch overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                  <div class="flex items-center px-3 bg-gray-50 text-gray-700 text-sm font-semibold dark:bg-gray-800 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    {{ currencySymbol }}
                  </div>
                  <input
                    v-model.number="form.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="flex-1 bg-transparent px-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Currency</label>
                <input
                  v-model="form.currency"
                  type="text"
                  placeholder="PKR"
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <!-- Payment Method -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <GenericSelect
                  v-model="form.method"
                  :options="methodOptions"
                  placeholder="Select Method"
                />
              </div>

              <!-- Notes -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Additional notes about this schedule..."
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Schedule Configuration Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule Configuration</h3>

            <div class="space-y-4">
              <!-- Schedule Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule Type <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-4">
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="form.schedule_type"
                      type="radio"
                      value="one_time"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">One-Time</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="form.schedule_type"
                      type="radio"
                      value="recurring"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Recurring</span>
                  </label>
                </div>
              </div>

              <!-- Start Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <DatePicker v-model="form.start_date" placeholder="dd/mm/yyyy" />
              </div>

              <!-- Recurring Options -->
              <div v-if="form.schedule_type === 'recurring'" class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <!-- Frequency -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency <span class="text-red-500">*</span>
                    </label>
                    <GenericSelect
                      v-model="form.frequency"
                      :options="frequencyOptions"
                      placeholder="Select Frequency"
                      required
                      @change="updatePreview"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interval
                    </label>
                    <input
                      v-model.number="form.interval"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1"
                      @input="updatePreview"
                      class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <p class="text-xs text-gray-500 mt-1">Every X {{ form.frequency || 'periods' }}</p>
                  </div>
                </div>

                <!-- Day of Week (for weekly/bi-weekly) -->
                <div v-if="form.frequency === 'weekly' || form.frequency === 'bi_weekly'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day of Week
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <label v-for="day in weekDays" :key="day.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="form.day_of_week"
                        type="checkbox"
                        :value="day.value"
                        @change="updatePreview"
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ day.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Day of Month (for monthly/quarterly) -->
                <div v-if="form.frequency === 'monthly' || form.frequency === 'quarterly'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day of Month
                  </label>
                  <input
                    v-model.number="form.day_of_month"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="1-31"
                    @input="updatePreview"
                    class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <p class="text-xs text-gray-500 mt-1">Which day of the month (1-31)</p>
                </div>

                <!-- End Condition -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Condition <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-3">
                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="endCondition"
                        type="radio"
                        value="date"
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300 mr-3">End by date:</span>
                      <DatePicker
                        v-model="form.end_date"
                        :disabled="endCondition !== 'date'"
                        placeholder="dd/mm/yyyy"
                        @change="updatePreview"
                      />
                    </label>

                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="endCondition"
                        type="radio"
                        value="occurrences"
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300 mr-3">After</span>
                      <input
                        v-model.number="form.max_occurrences"
                        type="number"
                        min="1"
                        max="100"
                        :disabled="endCondition !== 'occurrences'"
                        @input="updatePreview"
                        class="w-20 rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300 ml-2">occurrences (max 100)</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Notification Channels -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Channels
                </label>
                <div class="flex flex-wrap gap-3">
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="form.notification_channels"
                      type="checkbox"
                      value="in_app"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">In-App</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="form.notification_channels"
                      type="checkbox"
                      value="email"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Email</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="form.notification_channels"
                      type="checkbox"
                      value="whatsapp"
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Section -->
          <div v-if="form.schedule_type === 'recurring' && previewDates.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview Upcoming Dates</h3>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div v-for="(date, index) in previewDates.slice(0, 6)" :key="index" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ index + 1 }}. {{ formatDate(date) }}
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-3">
                Total estimated: {{ formatCurrency(form.amount * previewDates.length, form.currency) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              type="button"
              @click="router.push('/scheduled-payments')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="scheduleLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 disabled:opacity-50"
            >
              {{ scheduleLoading ? 'Saving...' : (isEdit ? 'Update Schedule' : 'Create Schedule') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ProjectSelect from '@/components/forms/ProjectSelect.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import GenericSelect from '@/components/forms/GenericSelect.vue'
import DatePicker from '@/components/forms/DatePicker.vue'
import { usePaymentSchedule } from '@/composables/usePaymentSchedule'
import { useToast } from '@/composables/useToast'
import api from '@/utils/axios'
import { formatAmount } from '@/utils/currency'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { createSchedule, updateSchedule, getSchedule, previewConfiguration, loading: scheduleLoading } = usePaymentSchedule()

const isEdit = computed(() => !!route.params.id)
const pageTitle = computed(() => isEdit.value ? 'Edit Payment Schedule' : 'Create Payment Schedule')

const projects = ref<any[]>([])
const customers = ref<any[]>([])
const previewDates = ref<string[]>([])
const endCondition = ref<'date' | 'occurrences'>('occurrences')
const pageLoading = ref(true)

const activeCustomers = computed(() => customers.value.filter((c: any) => c.status === 'active'))
const supplierOptions = computed(() => activeCustomers.value.filter((c: any) => (c.type || c.customer_type) === 'supplier'))
const labourOptions = computed(() => activeCustomers.value.filter((c: any) => (c.type || c.customer_type) === 'labour'))
const customerOptions = computed(() => activeCustomers.value.filter((c: any) => (c.type || c.customer_type) === 'customer' || !c.type))

const payerOptions = computed(() => {
  if (form.value.payer_type === 'supplier') return supplierOptions.value
  if (form.value.payer_type === 'user') return labourOptions.value
  return customerOptions.value
})

const weekDays = [
  { label: 'Mon', value: 'monday' },
  { label: 'Tue', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
  { label: 'Sat', value: 'saturday' },
  { label: 'Sun', value: 'sunday' }
]

const directionOptions = [
  { value: 'incoming', label: 'Incoming (Receive Payment)' },
  { value: 'outgoing', label: 'Outgoing (Make Payment)' }
]

const payerTypeOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'user', label: 'Labour/Staff' }
]

const methodOptions = [
  { value: 'cash', label: '💵 Cash' },
  { value: 'bank_transfer', label: '🏦 Bank Transfer' },
  { value: 'cheque', label: '🧾 Cheque' },
  { value: 'online', label: '🌐 Online Payment' },
  { value: 'other', label: '✨ Other' }
]

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

const form = ref({
  project_id: null as number | null,
  payer_id: null as number | null,
  payer_type: 'customer',
  amount: 0,
  currency: 'PKR',
  method: '',
  direction: 'incoming' as 'incoming' | 'outgoing',
  title: '',
  notes: '',
  schedule_type: 'recurring' as 'one_time' | 'recurring',
  frequency: 'monthly' as 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'yearly' | null,
  interval: 1,
  day_of_week: [] as string[],
  day_of_month: null as number | null,
  start_date: '',
  end_date: '',
  max_occurrences: 10 as number | null,
  notification_channels: ['in_app'] as string[]
})

const loadData = async () => {
  try {
    const [projectsRes, customersRes] = await Promise.all([
      api.get('/projects', { params: { per_page: 200 } }),
      api.get('/customers', { params: { per_page: 200, status: 'active' } })
    ])

    projects.value = projectsRes.data.data || projectsRes.data
    customers.value = (customersRes.data.data || customersRes.data || []).filter((c: any) => c.status === 'active')
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    pageLoading.value = false
  }
}

const loadSchedule = async () => {
  if (!isEdit.value) return

  try {
    const schedule = await getSchedule(Number(route.params.id))

    form.value = {
      project_id: schedule.project_id,
      payer_id: schedule.payer_id,
      payer_type: schedule.payer_type,
      amount: schedule.amount,
      currency: schedule.currency,
      method: schedule.method || '',
      direction: schedule.direction,
      title: schedule.title || '',
      notes: schedule.notes || '',
      schedule_type: schedule.schedule_type,
      frequency: schedule.frequency || null,
      interval: schedule.interval,
      day_of_week: schedule.day_of_week || [],
      day_of_month: schedule.day_of_month,
      start_date: schedule.start_date,
      end_date: schedule.end_date || '',
      max_occurrences: schedule.max_occurrences || 10,
      notification_channels: schedule.notification_channels || ['in_app']
    }

    // Set end condition
    if (schedule.end_date) {
      endCondition.value = 'date'
    } else if (schedule.max_occurrences) {
      endCondition.value = 'occurrences'
    }
  } catch (error) {
    console.error('Failed to load schedule:', error)
    router.push('/scheduled-payments')
  } finally {
    pageLoading.value = false
  }
}

const updatePreview = async () => {
  if (form.value.schedule_type !== 'recurring' || !form.value.frequency || !form.value.start_date) {
    previewDates.value = []
    return
  }

  try {
    const config = {
      schedule_type: form.value.schedule_type,
      frequency: form.value.frequency,
      interval: form.value.interval,
      day_of_week: form.value.day_of_week,
      day_of_month: form.value.day_of_month,
      start_date: form.value.start_date,
      end_date: endCondition.value === 'date' ? form.value.end_date : null,
      max_occurrences: endCondition.value === 'occurrences' ? form.value.max_occurrences : null
    }

    const dates = await previewConfiguration(config, 10)
    previewDates.value = dates
  } catch (error) {
    console.error('Failed to preview:', error)
    previewDates.value = []
  }
}

const handleSubmit = async () => {
  // Clear end condition fields based on selection
  const submitData = { ...form.value }

  if (form.value.schedule_type === 'recurring') {
    if (endCondition.value === 'date') {
      submitData.max_occurrences = null
    } else {
      submitData.end_date = ''
    }
  }

  try {
    if (isEdit.value) {
      await updateSchedule(Number(route.params.id), submitData)
    } else {
      await createSchedule(submitData)
    }

    router.push('/scheduled-payments')
  } catch (error) {
    console.error('Failed to save schedule:', error)
  }
}

const formatCurrency = (value: number, currency: string = 'PKR') =>
  formatAmount(value, currency, { compact: true })

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const currencySymbol = computed(() => {
  if (form.value.currency?.toUpperCase() === 'PKR') return 'Rs'
  if (form.value.currency?.toUpperCase() === 'USD') return '$'
  return form.value.currency || 'Rs'
})

// Reset recurrence-specific fields when toggling schedule type
watch(() => form.value.schedule_type, (type) => {
  if (type === 'one_time') {
    form.value.frequency = null
    form.value.interval = 1
    form.value.day_of_week = []
    form.value.day_of_month = null
    endCondition.value = 'occurrences'
    previewDates.value = []
  } else if (!form.value.frequency) {
    form.value.frequency = 'monthly'
  }
})

// Watch for changes that should trigger preview update
watch([
  () => form.value.frequency,
  () => form.value.interval,
  () => form.value.start_date,
  () => form.value.end_date,
  () => form.value.max_occurrences,
  () => endCondition.value
], () => {
  updatePreview()
}, { deep: true })

// Auto-select project owner when payer type is customer
watch(() => form.value.project_id, (projectId) => {
  if (!projectId) return
  const project = projects.value.find((p: any) => p.id === projectId)
  if (project && form.value.payer_type === 'customer') {
    form.value.payer_id = project.customer_id || project.customer?.id || null
  }
})

// When switching back to customer, re-align payer with project owner if available
watch(() => form.value.payer_type, (type) => {
  if (type === 'customer' && form.value.project_id) {
    const project = projects.value.find((p: any) => p.id === form.value.project_id)
    form.value.payer_id = project?.customer_id || project?.customer?.id || null
  } else if (type !== 'customer') {
    form.value.payer_id = null
  }
})

onMounted(() => {
  loadData()
  loadSchedule()
  if (route.query.project_id) {
    form.value.project_id = Number(route.query.project_id)
  }
})
</script>
