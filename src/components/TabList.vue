<script setup lang="ts">
import { ref } from 'vue'
import {
  tabsState,
  showNewTabForm,
  newTabTitle,
  newTabArtist,
  newTabLink,
  handleCreateTab,
  handleOpenTab,
  getTabMenuItems,
  handleFileSelect,
  triggerFileInput,
  createTab,
  saveTabs,
  type TabFile
} from '@/ts/tablature'
import { parseMediaLink } from '@/ts/media'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import FloatingMenu from '@/components/FloatingMenu.vue'
import EditLabel from './EditLabel.vue'
import TabHelp from './TabHelp.vue'
import { exampleTabs, type ExampleTab } from '@/assets/tablature/examples'

const fileInput = ref<HTMLInputElement>()

const onEditTitle = (tab: TabFile, value: string) => {
  const title = value.trim()
  if (title) tab.title = title

  tabsState.renamingTab = null
  saveTabs()
}

const onEditLink = (tab: TabFile, value: string) => {
  tab.link = value.trim()

  tabsState.linkingTab = null
  saveTabs()
}

const handleLoadExampleTab = async (example: ExampleTab) => {
  await createTab(example)
  showNewTabForm.value = false
}

</script>

<template>
  <div class="p-8">
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
        <TabHelp />
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
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Link (optional)</label>
          <input v-model="newTabLink" type="url" placeholder="YouTube or Spotify link"
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
            @open="tabsState.renamingTab = tab" @close="(v: string) => onEditTitle(tab, v)" hide-edit-icon />
          <p v-if="tab.artist" class="text-gray-600 mb-3">by {{ tab.artist }}</p>

          <EditLabel v-if="tabsState.linkingTab === tab" class="w-[calc(100%-2rem)] mb-3" :is-open="true"
            :value="tab.link ?? ''" placeholder="YouTube or Spotify link"
            @close="(v: string) => onEditLink(tab, v)" hide-edit-icon />
          <p v-else-if="tab.link" class="text-sm mb-3"
            :class="parseMediaLink(tab.link) ? 'text-gray-500' : 'text-amber-600'">
            {{ parseMediaLink(tab.link)?.kind === 'spotify' ? 'Spotify' : parseMediaLink(tab.link) ? 'YouTube' :
              'Unrecognised link' }}
          </p>

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