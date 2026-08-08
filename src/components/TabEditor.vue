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
        {{ renderer?.isPlaying ? 'Stop' : 'Play' }}
      </Button>

      <Button @click="triggerFileInput(fileInput)" variant="outline">
        <Icon name="upload" class="w-4 h-4 mr-2" />
        Import
      </Button>

      <Button @click="handleExport()" variant="outline">
        <Icon name="download" class="w-4 h-4 mr-2" />
        Export
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
