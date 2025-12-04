<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <form @submit.prevent="saveTemplate" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Title -->
          <div>
            <label for="title" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Template Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              id="title"
              placeholder="e.g. Standard Service Contract"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
              required
            />
          </div>

          <!-- Type -->
          <div>
            <label for="type" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Template Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              id="type"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
              required
            >
              <option value="" disabled>Select a type</option>
              <option value="contract">Contract</option>
              <option value="initial_quote">Initial Quote</option>
              <option value="estimate">Estimate</option>
              <option value="payment_reminder">Payment Reminder</option>
            </select>
          </div>
        </div>

        <!-- Editor -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Content <span class="text-red-500">*</span>
          </label>

          <div class="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
            <Editor
              :tinymce="tinymce"
              v-model="form.content"
              :init="editorInit"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="flex items-center">
          <input
            v-model="form.status"
            id="status"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-brand-600 focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-brand-600"
          />
          <label for="status" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <button
            v-if="isEditing"
            type="button"
            @click="previewTemplate"
            class="rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-200 dark:border-brand-500 dark:text-brand-500 dark:hover:bg-brand-900/20"
          >
            Preview
          </button>
          <router-link
            to="/admin/templates/templates"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="isSaving"
            class="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : (isEditing ? 'Update Template' : 'Create Template') }}
          </button>
        </div>
      </form>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/models/dom/model'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/wordcount'
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/skins/ui/oxide/content.css'
import 'tinymce/skins/content/default/content.css'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import api from '@/utils/axios'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => route.params.id !== undefined)
const pageTitle = computed(() => isEditing.value ? 'Edit Template' : 'Create Template')
const isSaving = ref(false)
const placeholders = ref<any[]>([])

const form = ref({
  title: '',
  type: '',
  content: '',
  status: true
})

const editorInit = computed(() => ({
  height: 480,
  menubar: 'file edit view insert format tools table help',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount advlist code fullscreen insertdatetime',
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | superscript subscript | codesample code fullscreen | removeformat | placeholders',
  toolbar_mode: 'sliding',
  statusbar: true,
  branding: false,
  promotion: false,
  placeholder: 'Start writing your template...',
  content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
  setup: (editor) => {
    editor.ui.registry.addMenuButton('placeholders', {
      text: 'Placeholders',
      fetch: (callback) => {
        const items = placeholders.value.map((p) => ({
          type: 'menuitem',
          text: `${p.key} (${p.model})`,
          onAction: () => editor.insertContent(` ${p.key} `),
        }))

        callback(
          items.length
            ? items
            : [
                {
                  type: 'menuitem',
                  text: 'No placeholders available',
                  enabled: false,
                },
              ],
        )
      },
    })

    editor.on('change keyup setcontent', () => {
      form.value.content = editor.getContent()
    })
  },
}))

const fetchPlaceholders = async () => {
  try {
    const response = await api.get('/placeholders')
    placeholders.value = response.data.filter((p: any) => p.status)
  } catch (error) {
    console.error('Error fetching placeholders', error)
  }
}

const fetchTemplate = async (id: string) => {
  try {
    const response = await api.get(`/templates/${id}`)
    const data = response.data
    form.value = {
      title: data.title,
      type: data.type,
      content: data.content,
      status: data.status
    }
  } catch (error) {
    toast.error('Error fetching template details')
    router.push('/admin/templates/templates')
  }
}

const isContentEmpty = (content: string) => {
  if (!content) return true
  const textOnly = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim()
  return textOnly.length === 0
}

const previewTemplate = async () => {
  if (!isEditing.value) return
  try {
    const response = await api.get(`/templates/${route.params.id}/preview`)
    // Open in new window
    const win = window.open("", "_blank")
    if (win) {
        win.document.write(response.data.content)
        win.document.close()
    }
  } catch (error: any) {
    toast.error('Error generating preview')
  }
}

const saveTemplate = async () => {
  if (isContentEmpty(form.value.content)) {
    toast.error('Content cannot be empty')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value) {
      await api.put(`/templates/${route.params.id}`, form.value)
      toast.success('Template updated successfully')
    } else {
      await api.post('/templates', form.value)
      toast.success('Template created successfully')
    }
    router.push('/admin/templates/templates')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error saving template')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await fetchPlaceholders()
  if (isEditing.value) {
    await fetchTemplate(route.params.id as string)
  }
})
</script>
