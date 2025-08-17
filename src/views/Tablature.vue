<script setup lang="ts">
import { onMounted } from 'vue'
import {
  tabsState,
  loadTabs,
  currentView,
  handleCloseEditor,
  handleTabSave
} from '@/ts/tablature'
import TabList from '@/components/TabList.vue'
import TabEditor from '@/components/TabEditor.vue'
import BackButton from '@/components/BackButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  loadTabs()
})

function back() {
  if (tabsState.currentTab === null) {
    router.back()
  } else {
    handleCloseEditor()
  }
  return true
}

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <BackButton v-show="router.options.history.state.back || tabsState.currentTab" :handler="back" />

    <div class="container max-w-full">
      <TabList v-if="currentView === 'list'" />

      <div v-else-if="currentView === 'editor' && tabsState.currentTab">
        <TabEditor v-model="tabsState.currentTab.content" @save="handleTabSave" :auto-save="true" />

      </div>
    </div>
  </div>
</template>