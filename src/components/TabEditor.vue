<script setup lang="ts">
import { ref } from 'vue'
import {
  tabsState,
  handleTabSave,
  handleExport,
  handleFileSelect,
  triggerFileInput
} from '@/ts/tablature'
import TabRenderer from './TabRenderer.vue'
import Button from './Button.vue'
import Icon from './Icon.vue'

const fileInput = ref<HTMLInputElement>()
const parseError = ref('')
const renderer = ref<InstanceType<typeof TabRenderer>>()

const handleInput = (event: Event) => {
  handleTabSave((event.target as HTMLTextAreaElement).value)
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"]/g,
    (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character] as string
  )

const handlePrint = () => {
  const tab = tabsState.currentTab
  const svg = renderer.value?.getSvg()
  if (!tab || !svg) return

  renderer.value?.stop()

  const sheet = window.open('', '_blank')
  if (!sheet) return

  // Browsers seed the "Save as PDF" filename from the document title.
  const title = tab.artist ? `${tab.title} - ${tab.artist}` : tab.title

  sheet.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { margin: 1.5cm; }
  body { margin: 0; font-family: Georgia, 'Times New Roman', Times, serif; color: #111827; }
  h1 { font-size: 22pt; font-weight: 600; margin: 0; text-align: center; }
  .artist { font-size: 12pt; font-style: italic; color: #4b5563; margin: 4pt 0 0; text-align: center; }
  .tempo { font-size: 11pt; color: #374151; margin: 18pt 0 8pt; }
  .sheet { width: fit-content; max-width: 100%; margin: 0 auto; }
  svg { display: block; max-width: 100%; height: auto; }
</style>
</head>
<body>
<h1>${escapeHtml(tab.title)}</h1>
${tab.artist ? `<p class="artist">by ${escapeHtml(tab.artist)}</p>` : ''}
<div class="sheet">
<p class="tempo">&#9833; = ${renderer.value?.tempo}</p>
${svg.outerHTML}
</div>
</body>
</html>`)

  sheet.document.close()
  sheet.focus()
  sheet.addEventListener('afterprint', () => sheet.close())
  sheet.print()
}
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

    <div class="flex justify-end items-center w-full pt-8">
      <Button @click="renderer?.toggle()" :disabled="!renderer?.hasAudio" variant="outline"
        class="disabled:opacity-50">
        <Icon :name="renderer?.isPlaying ? 'pause' : 'play'" class="w-4 h-4 mr-2" />
        {{ renderer?.isPlaying ? 'Pause' : 'Play' }}
      </Button>

      <Button @click="triggerFileInput(fileInput)" variant="outline">
        <Icon name="upload" class="w-4 h-4 mr-2" />
        Import
      </Button>

      <Button @click="handleExport()" variant="outline">
        <Icon name="download" class="w-4 h-4 mr-2" />
        Export
      </Button>

      <Button @click="handlePrint" :disabled="!renderer?.hasAudio" variant="outline" class="disabled:opacity-50">
        <Icon name="download" class="w-4 h-4 mr-2" />
        PDF
      </Button>
    </div>

    <div class="flex w-full flex-1 pt-4 min-h-[30rem]">
      <div class="flex-1 flex flex-col min-w-[20rem]">
        <textarea :value="tabsState.currentTab.content" @input="handleInput" spellcheck="false" autocapitalize="off"
          placeholder="Enter tab notation here..."
          class="w-full h-full p-4 font-mono text-sm border-t border-b border-gray-300 resize-none focus:outline-none" />

        <div v-if="parseError" class="sticky bottom-0 h-0 pointer-events-none">
          <div
            class="absolute inset-x-0 bottom-0 rounded-b border-t border-amber-300 bg-amber-50 px-4 py-2 font-mono text-xs text-amber-900">
            {{ parseError }}
          </div>
        </div>
      </div>

      <div class="flex-1 border-t border-b border-l border-gray-300 bg-white p-4">
        <TabRenderer ref="renderer" :value="tabsState.currentTab.content" @parse-error="parseError = $event" />
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
