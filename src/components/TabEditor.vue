<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  tabsState,
  handleTabSave,
  handleLinkSave,
  handleLyricsSave,
  handleExport,
  handleFileSelect,
  triggerFileInput
} from '@/ts/tablature'
import { parseMediaLink } from '@/ts/media'
import { printSheet } from '@/ts/tab-print'
import { DEFAULT_TEMPO } from '@/ts/vextab'
import TabRenderer from './TabRenderer.vue'
import MediaPlayer from './MediaPlayer.vue'
import EditLabel from './EditLabel.vue'
import TabHelp from './TabHelp.vue'
import Button from './Button.vue'
import Icon from './Icon.vue'

const fileInput = ref<HTMLInputElement>()
const parseError = ref('')
const renderer = ref<InstanceType<typeof TabRenderer>>()

const showLyrics = ref(false)

const handleInput = (event: Event) => {
  handleTabSave((event.target as HTMLTextAreaElement).value)
}

const handleLyricsInput = (event: Event) => {
  handleLyricsSave((event.target as HTMLTextAreaElement).value)
}

const isEditingLink = ref(false)

const onEditLink = (value: string) => {
  handleLinkSave(value.trim())
  isEditingLink.value = false
}

const embed = computed(() => parseMediaLink(tabsState.currentTab?.link))

const linkIsUnrecognised = computed(
  () => !!tabsState.currentTab?.link?.trim() && !embed.value
)

const handlePrint = () => {
  const tab = tabsState.currentTab
  const svg = renderer.value?.getSvg()
  if (!tab || !svg) return

  renderer.value?.stop()
  printSheet(tab, svg, renderer.value?.tempo ?? DEFAULT_TEMPO)
}
</script>

<template>
  <div v-if="tabsState.currentTab" class="flex flex-col h-full py-12">
    <div class="flex flex-col items-center pt-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ tabsState.currentTab.title }}</h1>
      <p v-if="tabsState.currentTab.artist" class="text-gray-600">by {{ tabsState.currentTab.artist }}</p>

      <EditLabel class="mt-2 w-96 max-w-full justify-center text-sm" :is-open="isEditingLink"
        :value="tabsState.currentTab.link ?? ''" placeholder="choose youtube/spotify URL"
        @open="isEditingLink = true" @close="onEditLink" />

      <p v-if="linkIsUnrecognised" class="mt-1 text-xs text-amber-600">
        Not a recognised YouTube or Spotify link
      </p>

      <MediaPlayer v-if="embed" :embed="embed" class="mt-4 w-full max-w-2xl" />
    </div>

    <input ref="fileInput" type="file" accept=".json" @change="handleFileSelect" class="hidden" />

    <div class="flex justify-end items-center w-full pt-8">
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

      <TabHelp />
    </div>

    <div class="flex w-full flex-1 pt-4 min-h-[30rem]">
      <div class="flex-1 flex flex-col min-w-[20rem] border-t border-b border-gray-300 bg-white">
        <div class="sticky top-0 z-10 flex h-11 items-center justify-end bg-white px-2">
          <button @click="showLyrics = !showLyrics"
            class="h-7 rounded border-0 bg-gray-200 px-3 text-xs text-gray-700 transition-colors hover:bg-gray-300">
            {{ showLyrics ? 'Markup' : 'Lyrics' }}
          </button>
        </div>

        <textarea v-if="!showLyrics" :value="tabsState.currentTab.content" @input="handleInput" spellcheck="false"
          autocapitalize="off" placeholder="Enter score markup here..."
          class="markup-input w-full h-full p-4 pb-16 font-mono text-sm bg-transparent border-0 resize-none focus:outline-none" />

        <textarea v-else :value="tabsState.currentTab.lyrics ?? ''" @input="handleLyricsInput"
          placeholder="Add lyrics..."
          class="sticky top-11 shrink-0 mx-auto w-full max-w-[34rem] h-[calc(100vh-4rem)] border-0 bg-transparent p-6 font-serif text-base leading-8 text-gray-800 resize-none focus:outline-none placeholder:italic placeholder:text-gray-400" />

        <div v-if="parseError && !showLyrics" class="sticky bottom-0 h-0 pointer-events-none">
          <div
            class="absolute inset-x-0 bottom-0 rounded-b border-t border-amber-300 bg-amber-50 px-4 py-2 font-mono text-xs text-amber-900">
            {{ parseError }}
          </div>
        </div>
      </div>

      <div class="flex-1 border-t border-b border-l border-gray-300 bg-white p-4">
        <div class="sticky top-0 z-10 -mx-4 flex justify-center bg-white px-4 py-2">
          <button @click="renderer?.toggle()" :disabled="!renderer?.hasAudio"
            :aria-label="renderer?.isPlaying ? 'Pause' : 'Play'"
            class="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-gray-800 p-0 text-white shadow-md transition-colors hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800">
            <Icon :name="renderer?.isPlaying ? 'pause' : 'play'" class="h-5 w-5" />
          </button>
        </div>

        <TabRenderer ref="renderer" :markup="tabsState.currentTab.content" @parse-error="parseError = $event" />
      </div>
    </div>

    <div class="mt-4 text-sm text-gray-500 text-center">
      Last updated {{ new Date(tabsState.currentTab.updatedAt).toLocaleString() }}
    </div>
  </div>
</template>

<style scoped>
.markup-input {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
