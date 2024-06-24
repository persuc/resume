<script setup lang="ts">
import Panel from '@/components/Panel.vue'

interface Props {
  label: string,
  language: string,
  code: string
}

defineProps<Props>()

</script>

<template>
  <Panel class="my-4" :pad-content="false">
    <template v-slot:label>{{ label }}</template>
    <template v-slot:content>
      <pre v-highlightjs><code :class="[language]">{{ code }}</code></pre>
    </template>
  </Panel>
</template>