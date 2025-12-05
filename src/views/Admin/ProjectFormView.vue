<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="isEditMode ? 'Edit Project' : 'Create Project'" />

    <form @submit.prevent="saveProject" class="space-y-6">
      <!-- Basic Information -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Project Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="e.g., Residential Complex - Phase 1"
            />
          </div>

          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Brief description of the project"
            ></textarea>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Customer/Owner</label>
            <CustomerSelect
              v-model="form.customer_id"
              :customers="customers"
              placeholder="Select customer"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Project Type</label>
            <select v-model="form.project_type" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Building Type</label>
            <select v-model="form.building_type" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select building type</option>
              <option value="House">House</option>
              <option value="Plaza">Plaza</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Farmhouse">Farmhouse</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Status</label>
            <select v-model="form.status" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Location Details -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Location Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Plot Number</label>
            <input v-model="form.plot_number" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Street Address</label>
            <input v-model="form.address" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <!-- Hidden country field - always Pakistan by default -->
          <input v-model="form.country_id" type="hidden" />

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">State/Province</label>
            <select v-model="form.state_id" @change="onStateChange" :disabled="!form.country_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select state</option>
              <option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">City</label>
            <select v-model="form.city_id" @change="onCityChange" :disabled="!form.state_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select city</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Town/Area</label>
            <select v-model="form.town_id" @change="onTownChange" :disabled="!form.city_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select town</option>
              <option v-for="town in towns" :key="town.id" :value="town.id">{{ town.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phase / Sector</label>
            <select v-model="form.phase_id" :disabled="!form.town_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select phase/sector</option>
              <option v-for="phase in phases" :key="phase.id" :value="phase.id">{{ phase.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">GPS Latitude</label>
            <input v-model="form.latitude" type="number" step="0.0000001" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g., 24.8607" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">GPS Longitude</label>
            <input v-model="form.longitude" type="number" step="0.0000001" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="e.g., 67.0011" />
          </div>
        </div>
      </div>

      <!-- Construction Details -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Construction Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Plot Area (sq ft)</label>
            <input v-model.number="form.plot_area_sq_ft" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Covered Area (sq ft)</label>
            <input v-model.number="form.covered_area_sq_ft" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Total Area (sq ft)</label>
            <input v-model.number="form.area_sq_ft" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Number of Floors</label>
            <input v-model.number="form.number_of_floors" type="number" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Number of Basements</label>
            <input v-model.number="form.number_of_basements" type="number" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Number of Rooms</label>
            <input v-model.number="form.number_of_rooms" type="number" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Number of Bathrooms</label>
            <input v-model.number="form.number_of_bathrooms" type="number" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Foundation Type</label>
            <select v-model="form.foundation_type" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select type</option>
              <option value="shallow">Shallow Foundation</option>
              <option value="deep">Deep Foundation</option>
              <option value="pile">Pile Foundation</option>
              <option value="raft">Raft Foundation</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Structure Type</label>
            <select v-model="form.structure_type" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select type</option>
              <option value="rcc">RCC (Reinforced Concrete)</option>
              <option value="steel_frame">Steel Frame</option>
              <option value="load_bearing">Load Bearing</option>
              <option value="composite">Composite</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contract & Financial -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Contract & Financial</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contract Type</label>
            <select v-model="form.contract_type_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select contract type</option>
              <option v-for="type in contractTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Contract Value ({{ currencySymbol }})</label>
            <div class="flex gap-2 items-center">
              <div class="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                <button type="button" @click="selectCurrency('PKR')" :class="['px-3 py-2 text-sm font-medium transition-colors', form.currency === 'PKR' ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']">PKR</button>
                <button type="button" @click="selectCurrency('USD')" :class="['px-3 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-700 transition-colors', form.currency === 'USD' ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']">USD</button>
                <button type="button" @click="selectCurrency('EUR')" :class="['px-3 py-2 text-sm font-medium border-l border-gray-300 dark:border-gray-700 transition-colors', form.currency === 'EUR' ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700']">EUR</button>
              </div>
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 font-semibold text-lg">{{ currencySymbol }}</span>
                <input v-model.number="form.contract_value" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 pl-8 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="0.00" />
              </div>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Estimated Cost ({{ currencySymbol }})</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 font-semibold text-lg">{{ currencySymbol }}</span>
              <input v-model.number="form.estimated_cost" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 pl-8 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Actual Cost ({{ currencySymbol }})</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 font-semibold text-lg">{{ currencySymbol }}</span>
              <input v-model.number="form.actual_cost" type="number" step="0.01" class="h-11 w-full rounded-lg border border-gray-300 px-3 pl-8 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="0.00" />
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Completion Percentage: {{ form.completion_percentage }}%</label>
            <input v-model.number="form.completion_percentage" type="range" min="0" max="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Timeline</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Start Date</label>
            <input v-model="form.start_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">End Date</label>
            <input v-model="form.end_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Planned Completion Date</label>
            <input v-model="form.planned_completion_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Actual Completion Date</label>
            <input v-model="form.actual_completion_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>
        </div>
      </div>

      <!-- Team Assignment -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Team Assignment</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Project Manager</label>
            <select v-model="form.project_manager_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select project manager</option>
              <option v-for="user in projectManagers" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Site Engineer</label>
            <select v-model="form.site_engineer_id" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="">Select site engineer</option>
              <option v-for="user in siteEngineers" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Permits & Utilities -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Permits & Utilities</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Building Permit Number</label>
            <input v-model="form.building_permit_number" type="text" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Permit Issue Date</label>
            <input v-model="form.permit_issue_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Permit Expiry Date</label>
            <input v-model="form.permit_expiry_date" type="date" class="h-11 w-full rounded-lg border border-gray-300 px-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>
        </div>

        <div>
          <label class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-400">Available Utilities</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label class="flex items-center cursor-pointer">
              <input v-model="form.has_electricity" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-400">Electricity</span>
            </label>

            <label class="flex items-center cursor-pointer">
              <input v-model="form.has_water" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-400">Water</span>
            </label>

            <label class="flex items-center cursor-pointer">
              <input v-model="form.has_gas" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-400">Gas</span>
            </label>

            <label class="flex items-center cursor-pointer">
              <input v-model="form.has_sewerage" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-400">Sewerage</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Documents Management -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 class="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Project Documents</h3>

        <!-- Project Thumbnail -->
        <div class="mb-8">
          <h4 class="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Project Thumbnail</h4>
          <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/30 p-6">
            <div class="flex items-center justify-center gap-4">
              <div class="text-center flex-1">
                <svg class="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Select thumbnail image</p>
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleThumbnailChange(e)"
                  class="hidden"
                  ref="thumbnailInput"
                />
                <button
                  type="button"
                  @click="() => thumbnailInput?.click()"
                  class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Upload Thumbnail
                </button>
              </div>
              <div v-if="thumbnailPreview" class="flex-shrink-0">
                <img :src="thumbnailPreview" class="h-24 w-24 rounded-lg object-cover" />
              </div>
            </div>
          </div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Recommended: Square image, min 200x200px</p>
        </div>

        <!-- Project Images Gallery -->
        <div class="mb-8">
          <h4 class="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Project Images</h4>
          <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/30 p-6 text-center">
            <svg class="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Drag and drop images or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*"
              @change="(e) => handleImagesChange(e)"
              class="hidden"
              ref="imagesInput"
            />
            <button
              type="button"
              @click="() => imagesInput?.click()"
              class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Select Images
            </button>
            <p class="mt-2 text-xs text-gray-500">You can upload multiple images</p>
          </div>

          <!-- Images Preview Grid -->
          <div v-if="imagePreviews.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(preview, index) in imagePreviews" :key="index" class="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img :src="preview" class="h-24 w-full object-cover" />
              <button
                type="button"
                @click="removeImagePreview(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Project Documents Upload -->
        <div class="mb-4">
          <h4 class="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Documents & Files</h4>
          <div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/30 p-6 text-center">
            <svg class="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Drag and drop files or click to browse</p>
            <input
              type="file"
              multiple
              @change="(e) => handleDocumentsChange(e)"
              class="hidden"
              ref="documentsInput"
            />
            <button
              type="button"
              @click="() => documentsInput?.click()"
              class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Select Files
            </button>
            <p class="mt-2 text-xs text-gray-500">PDF, Word, Excel, PowerPoint, Images, etc.</p>
          </div>

          <!-- Uploaded Documents List -->
          <div v-if="uploadedDocuments.length > 0" class="mt-4 space-y-2">
            <div v-for="(doc, index) in uploadedDocuments" :key="index" class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ doc.file.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ (doc.file.size / 1024).toFixed(2) }} KB</p>
                </div>
              </div>
              <button
                type="button"
                @click="removeDocument(index)"
                class="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Notes -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Additional Notes</label>
          <textarea
            v-model="form.additional_notes"
            rows="3"
            class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white dark:border-gray-700 dark:bg-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Any additional information about the project"
          ></textarea>
        </div>

        <!-- Active Status -->
        <div class="mt-4">
          <label class="flex items-center cursor-pointer">
            <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-400">Project is Active</span>
          </label>
        </div>
      </div>

      <!-- Show validation errors -->
      <div v-if="Object.keys(errors).length > 0" class="mb-4">
        <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <div class="font-semibold">There were validation errors:</div>
          <ul class="mt-2 list-disc ml-5 text-sm space-y-1">
            <li v-for="(msgs, key) in errors" :key="key">
              <span class="font-medium">{{ key }}:</span> {{ msgs[0] }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="$router.push('/projects')"
          class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300"
        >
          {{ isEditMode ? 'Update Project' : 'Create Project' }}
        </button>
      </div>
    </form>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import CustomerSelect from '@/components/forms/CustomerSelect.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const currentPageTitle = ref('Projects')
const customers = ref<any[]>([])
const countries = ref<any[]>([])
const states = ref<any[]>([])
const cities = ref<any[]>([])
const towns = ref<any[]>([])

const isProjectModalOpen = ref(false)

// Custom Customer Dropdown State - REMOVED (Replaced by CustomerSelect component)

const form = ref({
  name: '',
  description: '',
  customer_id: null as number | null,
  project_type: '',
  building_type: '',
  plot_number: '',
  address: '',
  country_id: null as number | null,
  state_id: null as number | null,
  city_id: null as number | null,
  town_id: null as number | null,
  phase_id: null as number | null,
  latitude: '',
  longitude: '',

  // Construction
  area_sq_ft: '',
  plot_area_sq_ft: '',
  covered_area_sq_ft: '',
  number_of_floors: '',
  number_of_rooms: '',
  number_of_bathrooms: '',
  number_of_basements: '',
  foundation_type: '',
  structure_type: '',
  status: 'planning',

  // Contract & Financial
  contract_type_id: '',
  contract_value: '',
  estimated_cost: '',
  actual_cost: '',
  completion_percentage: 0,
  currency: 'PKR',

  // Timeline
  start_date: '',
  end_date: '',
  planned_completion_date: '',
  actual_completion_date: '',

  // Team
  project_manager_id: null,
  site_engineer_id: null,

  // Permits
  building_permit_number: '',
  permit_issue_date: '',
  permit_expiry_date: '',

  // Utilities
  has_electricity: false,
  has_water: false,
  has_gas: false,
  has_sewerage: false,

  additional_notes: '',
  is_active: true,
})

const documents = ref<{ file: File | null, category: string, description: string }[]>([])
const contractTypes = ref<any[]>([])
const projectManagers = ref<any[]>([])
const siteEngineers = ref<any[]>([])
const phases = ref<any[]>([])

// Document management
const thumbnailInput = ref<HTMLInputElement>()
const imagesInput = ref<HTMLInputElement>()
const documentsInput = ref<HTMLInputElement>()
const thumbnailPreview = ref<string>('')
const imagePreviews = ref<string[]>([])
const imageFiles = ref<File[]>([])
const uploadedDocuments = ref<{ file: File, category?: string, description?: string }[]>([])
const errors = ref<Record<string, string[]>>({})

const buildingTypes = [
  'House', 'Plaza', 'Apartment', 'Commercial', 'Industrial', 'Farmhouse', 'Other'
]

const documentCategories = [
  'Blueprint', 'Planning', 'Site Picture', 'Permit', 'Contract', 'Invoice', 'Other'
]

const currencySymbol = computed(() => {
  const symbols: Record<string, string> = {
    'PKR': '₨',
    'USD': '$',
    'EUR': '€'
  }
  return symbols[form.value.currency] || form.value.currency
})

const selectCurrency = (curr: string) => {
  form.value.currency = curr
}

const isEditMode = computed(() => !!route.params.id)

const fetchCustomers = async () => {
  try {
    const res = await api.get('/customers', { params: { status: 'active', per_page: 100 } })
    customers.value = res.data.data || res.data
  } catch (e) {
    console.error(e)
  }
}

const fetchContractTypes = async () => {
  try {
    const res = await api.get('/contract-types', { params: { active_only: true } })
    contractTypes.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const fetchUsers = async () => {
  try {
    const res = await api.get('/users')
    projectManagers.value = res.data.data || res.data
    siteEngineers.value = res.data.data || res.data
  } catch (e) {
    console.error(e)
  }
}

const fetchCountries = async () => {
  try {
    const res = await api.get('/countries', { params: { active_only: true, all: true } })
    countries.value = res.data

    // Default to Pakistan if not set
    if (!form.value.country_id) {
      const pakistan = countries.value.find(c => c.name.toLowerCase() === 'pakistan')
      if (pakistan) {
        form.value.country_id = pakistan.id
        await onCountryChange()
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const onCountryChange = async () => {
  states.value = []
  cities.value = []
  towns.value = []
  form.value.state_id = null
  form.value.city_id = null
  form.value.town_id = null

  if (form.value.country_id) {
    try {
      const res = await api.get('/states', { params: { country_id: form.value.country_id, active_only: true, all: true } })
      states.value = res.data
    } catch (e) {
      console.error(e)
    }
  }
}

const onStateChange = async () => {
  cities.value = []
  towns.value = []
  form.value.city_id = null
  form.value.town_id = null

  if (form.value.state_id) {
    try {
      const res = await api.get('/cities', { params: { state_id: form.value.state_id, active_only: true, all: true } })
      cities.value = res.data
    } catch (e) {
      console.error(e)
    }
  }
}

const onCityChange = async () => {
  towns.value = []
  form.value.town_id = null
  phases.value = []
  form.value.phase_id = null

  if (form.value.city_id) {
    try {
      const res = await api.get('/towns', { params: { city_id: form.value.city_id, active_only: true, all: true } })
      towns.value = res.data
    } catch (e) {
      console.error(e)
    }
  }
}

const onTownChange = async () => {
  phases.value = []
  form.value.phase_id = null

  if (form.value.town_id) {
    try {
      const res = await api.get('/phases', { params: { town_id: form.value.town_id, active_only: true, all: true } })
      phases.value = res.data
    } catch (e) {
      console.error(e)
    }
  }
}

const addDocument = () => {
  documents.value.push({ file: null, category: 'Site Picture', description: '' })
}

const removeDocument = (index: number) => {
  uploadedDocuments.value.splice(index, 1)
}

const handleDocumentFileChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    documents.value[index].file = input.files[0]
  }
}

// New document management methods
const handleThumbnailChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    uploadedDocuments.value.push({ file, category: 'thumbnail' })
  }
}

const handleImagesChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreviews.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      imageFiles.value.push(file)
      uploadedDocuments.value.push({ file, category: 'image' })
    })
  }
}

const removeImagePreview = (index: number) => {
  imagePreviews.value.splice(index, 1)
  if (imageFiles.value[index]) {
    uploadedDocuments.value = uploadedDocuments.value.filter(doc => doc.file !== imageFiles.value[index])
  }
  imageFiles.value.splice(index, 1)
}

const handleDocumentsChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    Array.from(input.files).forEach((file) => {
      uploadedDocuments.value.push({ file, category: 'document' })
    })
  }
}

const fetchProject = async () => {
  if (!route.params.id) return

  try {
    const res = await api.get(`/projects/${route.params.id}`)
    const project = res.data

    // Populate form
    Object.keys(form.value).forEach(key => {
      if (project[key] !== undefined && project[key] !== null) {
        // @ts-ignore
        form.value[key] = project[key]
      }
    })

    // Load cascading dropdowns
    if (project.country_id) {
      const statesRes = await api.get('/states', { params: { country_id: project.country_id, active_only: true, all: true } })
      states.value = statesRes.data

      if (project.state_id) {
        const citiesRes = await api.get('/cities', { params: { state_id: project.state_id, active_only: true, all: true } })
        cities.value = citiesRes.data

        if (project.city_id) {
          const townsRes = await api.get('/towns', { params: { city_id: project.city_id, active_only: true, all: true } })
          towns.value = townsRes.data
        }
      }
    }
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Error fetching project')
    router.push('/projects')
  }
}

const saveProject = async () => {
  try {
    errors.value = {}

    // Normalize boolean fields to values backend expects
    form.value.is_active = !!form.value.is_active

    const formData = new FormData()

    // Append form fields (skip empty strings but include explicit booleans)
    Object.entries(form.value).forEach(([key, value]) => {
      if (key === 'is_active') return // handle below explicitly
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value as any)
      }
    })

    // Append is_active explicitly as boolean/true/false string
    formData.append('is_active', form.value.is_active ? '1' : '0')

    // Append documents (use uploadedDocuments if available, fallback to documents)
    const docsToSend = uploadedDocuments.value.length ? uploadedDocuments.value : documents.value
    docsToSend.forEach((doc: any, index: number) => {
      if (doc.file) {
        formData.append(`document_files[${index}]`, doc.file)
        formData.append(`document_categories[${index}]`, doc.category || 'document')
        formData.append(`document_descriptions[${index}]`, doc.description || '')
      }
    })

    const config = { headers: { 'Content-Type': 'multipart/form-data' } }
    if (isEditMode.value) {
      formData.append('_method', 'PUT')
      await api.post(`/projects/${route.params.id}`, formData, config)
      toast.success('Project updated successfully')
    } else {
      await api.post('/projects', formData, config)
      toast.success('Project created successfully')
    }

    router.push('/projects')
  } catch (e: any) {
    const resp = e.response?.data
    if (resp && resp.errors) {
      errors.value = resp.errors
    }
    toast.error(resp?.message || 'Error saving project')
  }
}

onMounted(() => {
  fetchCustomers()
  fetchContractTypes()
  fetchCountries()
  fetchUsers()

  if (isEditMode.value) {
    fetchProject()
  }
})
</script>

<style scoped>
.customer-dropdown { max-height: 15rem; overflow: auto }
</style>
