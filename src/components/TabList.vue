<script setup lang="ts">
import { ref } from 'vue'
import {
  tabsState,
  showNewTabForm,
  newTabTitle,
  newTabArtist,
  handleCreateTab,
  handleOpenTab,
  getTabMenuItems,
  handleFileSelect,
  triggerFileInput,
  createTab,
  saveTabs
} from '@/ts/tablature'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import FloatingMenu from '@/components/FloatingMenu.vue'
import External from './External.vue'
import EditLabel from './EditLabel.vue'
import { exampleTabs, type ExampleTab } from '@/assets/tablature/examples'

const showHelp = ref(false)

const fileInput = ref<HTMLInputElement>()

const onEditTitle = () => {
  tabsState.renamingTab = null
  saveTabs()
}

const handleLoadExampleTab = async (example: ExampleTab) => {
  await createTab(example.title, example.artist, example.content)
  showNewTabForm.value = false
}

</script>

<template>
  <div
    :class="{ 'w-full absolute flex items-center justify-center h-screen': true, 'z-20 bg-gray-600/[.5]': showHelp }">
    <div v-show="showHelp" class="bg-white border max-w-2xl border-gray-300 p-8 z-10 mt-4 h-fit select-none">
      <Icon v-show="showHelp" name="close" class="w-10 absolute right-2 top-2 cursor-pointer p-2"
        @click="() => showHelp = false"></Icon>
      <p>This page is for creating guitar tablatures using the VexTab standard notation language. You can find
        tutorials
        on the VexTab language at
        <External href="https://vexflow.com/vextab/tutorial.html">https://vexflow.com/vextab/tutorial.html</External>.
      </p>

      <p>
        Anything after <code class="font-mono bg-gray-100 px-1">//</code> on a line is a comment - it is ignored when
        the tab is drawn and played, so you can annotate your notation freely.
      </p>

      <p>
        <code class="font-mono bg-gray-100 px-1">#_#</code> is a hidden rest - it takes up time and keeps the voices
        aligned like a normal <code class="font-mono bg-gray-100 px-1">##</code> rest, but is not drawn. Use it for
        bars where a secondary voice is silent.
      </p>

      <p>
        Press Play to hear the tab. Click any note in the rendered notation to move the playhead there.
      </p>

      <p>
        This is a beta version of the editor - please export your files regularly for safekeeping!
      </p>
    </div>
  </div>
  <div :class="{ 'p-8': true, 'pointer-events-none': showHelp }">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Tablature</h1>
        <p class="text-gray-600">Guitar tablature editor and renderer</p>
        <p class="text-red-600">Warning! Beta version - export regularly</p>
      </div>

      <div class="flex items-center">
        <Button variant="primary" @click="showNewTabForm = !showNewTabForm" class="px-3">
          <Icon name="plus" class="w-4 h-4 mr-2" />
          New Tab
        </Button>
        <Button class="z-10" variant="outline" @click="() => showHelp = true">
          <span class="font-semibold text-xl">?</span>
        </Button>
      </div>

    </div>

    <input ref="fileInput" type="file" accept=".json" @change="handleFileSelect" class="hidden" />

    <div v-if="showNewTabForm" class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">Create New Tab</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input v-model="newTabTitle" type="text" placeholder="Song title"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Artist</label>
          <input v-model="newTabArtist" type="text" placeholder="Artist name"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <Button @click="handleCreateTab" :disabled="!newTabTitle.trim()" class="disabled:opacity-50">
          Create
        </Button>
        <Button @click="showNewTabForm = false" variant="secondary">
          Cancel
        </Button>
      </div>

      <div class="py-8">OR</div>

      <div class="flex flex-wrap items-center gap-y-2">
        <span class="text-sm text-gray-700">Load an example</span>
        <Button v-for="example in exampleTabs" :key="example.slug" @click="handleLoadExampleTab(example)">
          {{ example.title }}
        </Button>
      </div>
    </div>

    <div v-if="tabsState.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ tabsState.error }}
    </div>

    <div v-if="tabsState.isLoading" class="text-center py-8">
      <div class="text-gray-600">Loading tabs...</div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="tab in tabsState.tabs" :key="tab.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
        <div @click="handleOpenTab(tab.id)" class="p-6 cursor-pointer">
          <EditLabel class="w-[calc(100%-2rem)]" :is-open="tabsState.renamingTab === tab" :value="tab.title"
            @change="(v: string) => tab.title = v" @open="tabsState.renamingTab = tab" @close="onEditTitle"
            hide-edit-icon />
          <!-- <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ tab.title }}</h3> -->
          <p v-if="tab.artist" class="text-gray-600 mb-3">by {{ tab.artist }}</p>
          <p class="text-sm text-gray-500">
            Updated {{ new Date(tab.updatedAt).toLocaleDateString() }}
          </p>
        </div>

        <div class="absolute top-4 right-4">
          <FloatingMenu :items="getTabMenuItems(tab)" />
        </div>
      </div>

      <div v-if="tabsState.tabs.length === 0" class="flex w-full col-span-full flex-col items-center py-16">
        <div class="text-gray-500 mb-4">No tabs yet</div>
        <div class="flex items-center">
          <Button @click="showNewTabForm = true" class="bg-blue-600 hover:bg-blue-700">
            Create your first tab
          </Button>
          or
          <Button @click="triggerFileInput(fileInput)" class="bg-blue-600 hover:bg-blue-700">
            Import tab
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>