<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  tabsState,
  handleTabSave,
  handleExport,
  handleImportFile,
  triggerFileInput
} from '@/ts/tablature'
import TabRenderer from './TabRenderer.vue'
import Button from './Button.vue'
import Icon from './Icon.vue'

const props = defineProps<{
  modelValue: string
  autoSave?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const tabValue = ref(props.modelValue)
const fileInput = ref<HTMLInputElement>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const content = target.value

  tabValue.value = content
  emit('update:modelValue', content)

  if (props.autoSave) {
    handleTabSave(content)
  }
}

const handleImport = () => {
  triggerFileInput(fileInput.value)
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await handleImportFile(file)
  }
}

watch(() => props.modelValue, (newValue) => {
  tabValue.value = newValue
})
</script>

<template>
  <div v-if="tabsState.currentTab" class="flex flex-col h-full py-12">
    <div class="flex items-center pt-8 relative">
      <div class="flex flex-col text-center absolute w-full">
        <h1 class="text-3xl font-bold text-gray-900">{{ tabsState.currentTab.title }}
        </h1>
        <p v-if="tabsState.currentTab.artist" class="text-gray-600">by {{ tabsState.currentTab.artist }}</p>
      </div>
    </div>

    <input ref="fileInput" type="file" accept=".json" @change="handleFileSelect" class="hidden" />

    <div class="flex justify-end w-full pt-8">
      <Button @click="handleImport" variant="outline">
        <Icon name="upload" class="w-4 h-4 mr-2" />
        Import
      </Button>

      <Button @click="handleExport()" variant="outline">
        <Icon name="download" class="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>

    <div class="flex w-full flex-1 gap-4 pt-4">
      <div class="flex-1 flex flex-col min-w-[20rem]">
        <textarea ref="textareaRef" :value="tabValue" @input="handleInput" spellcheck="false" autocapitalize="off"
          placeholder="Enter tab notation here..."
          class="w-full h-full p-4 font-mono text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="flex-1 border border-gray-300 bg-white rounded p-4">
        <TabRenderer :value="tabValue" />
      </div>
    </div>

    <div class="mt-4 text-sm text-gray-500 text-center">
      Last updated {{ new Date(tabsState.currentTab.updatedAt).toLocaleString() }}
    </div>
  </div>
</template>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>