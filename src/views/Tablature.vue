<script setup lang="ts">
import { onMounted } from 'vue'
import {
  tabsState,
  loadTabs,
  currentView,
  handleCloseEditor,
  openExample
} from '@/ts/tablature'
import { findExample } from '@/assets/tablature/examples'
import TabList from '@/components/TabList.vue'
import TabEditor from '@/components/TabEditor.vue'
import BackButton from '@/components/BackButton.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  loadTabs()

  const slug = route.params.example
  if (typeof slug !== 'string') return

  const example = findExample(slug)
  if (example) openExample(example)
  else router.replace({ name: 'Tablature' })
})

function back() {
  if (tabsState.currentTab === null) {
    router.back()
    return true
  }

  handleCloseEditor()
  if (route.name === 'TablatureExample') router.replace({ name: 'Tablature' })
  return true
}

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <BackButton v-show="router.options.history.state.back || tabsState.currentTab" :handler="back" />

    <div class="container max-w-full">
      <TabList v-if="currentView === 'list'" />

      <TabEditor v-else-if="currentView === 'editor' && tabsState.currentTab" />
    </div>
  </div>
</template>
