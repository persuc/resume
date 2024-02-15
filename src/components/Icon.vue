<script setup lang="ts">
import { defineAsyncComponent, watch, type Component } from 'vue'

interface Props {
  name: string,
  preload?: string[]
}

const props = defineProps<Props>()

const componentsCache: Record<string, Component> = {}

for (const pre of props.preload ?? []) {
  loadSvg(pre)
}

function loadSvg(name: string) {
  if (!componentsCache[name]) {
    componentsCache[name] = defineAsyncComponent(() =>
      import((name.includes('/') || name.endsWith('.svg')) ? name : `../assets/icons/${name}.svg`)
    )
  }
  return componentsCache[name]
}

watch(() => props.name, () => {
  icon = loadSvg(props.name)
})

let icon = loadSvg(props.name)

</script>

<template>
  <component :is="icon" />
</template>
