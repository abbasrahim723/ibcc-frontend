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
          
          <div class="border rounded-lg border-gray-300 dark:border-gray-600 overflow-hidden">
            <!-- Toolbar -->
            <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-2 items-center">
              <button type="button" @click="editor?.chain().focus().toggleBold().run()" :class="{ 'bg-gray-200 dark:bg-gray-700': editor?.isActive('bold') }" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                Bold
              </button>
              <button type="button" @click="editor?.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-200 dark:bg-gray-700': editor?.isActive('italic') }" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                Italic
              </button>
              <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-gray-200 dark:bg-gray-700': editor?.isActive('heading', { level: 1 }) }" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                H1
              </button>
              <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-gray-200 dark:bg-gray-700': editor?.isActive('heading', { level: 2 }) }" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                H2
              </button>
              <button type="button" @click="editor?.chain().focus().toggleBulletList().run()" :class="{ 'bg-gray-200 dark:bg-gray-700': editor?.isActive('bulletList') }" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                Bullet List
              </button>
              <button type="button" @click="editor?.chain().focus().toggleOrderedList().run()" :class="{ 'bg-gray-200 dark:bg-gray-700': editor?.isActive('orderedList') }" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                Ordered List
              </button>
              
              <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <!-- Placeholders Dropdown -->
              <div class="relative">
                <select 
                  @change="insertPlaceholder($event)" 
                  class="text-sm border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-1 pl-2 pr-8"
                >
                  <option value="">Insert Placeholder...</option>
                  <option v-for="p in placeholders" :key="p.id" :value="p.key">
                    {{ p.key }} ({{ p.model }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Editor Content -->
            <editor-content :editor="editor" class="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none" />
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
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
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

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    Image,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: ({ editor }) => {
    form.value.content = editor.getHTML()
  },
})

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
    if (editor.value) {
      editor.value.commands.setContent(data.content)
    }
  } catch (error) {
    toast.error('Error fetching template details')
    router.push('/admin/templates/templates')
  }
}

const insertPlaceholder = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const value = select.value
  if (value && editor.value) {
    editor.value.chain().focus().insertContent(` ${value} `).run()
    select.value = "" // Reset dropdown
  }
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
  if (!form.value.content || form.value.content === '<p></p>') {
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

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
/* Basic Tiptap Editor Styles */
.ProseMirror {
  outline: none;
  min-height: 300px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
