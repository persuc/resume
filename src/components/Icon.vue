<script setup lang="ts">
import { defineAsyncComponent, watch, type Component, computed, type AsyncComponentLoader, type ComputedOptions, type MethodOptions } from 'vue'

interface Props {
  name: string,
  preload?: string[]
}

const props = defineProps<Props>()

const iconConstructors: Record<string, AsyncComponentLoader<Component<any, any, any, ComputedOptions, MethodOptions>>> = import.meta.glob('/**/*.svg')
const componentsCache: Record<string, Component> = {}

const icon = computed(() => {
  if (!componentsCache[props.name]) {
    const iconPath = (props.name.includes('/') || props.name.endsWith('.svg')) ? props.name : `/src/assets/icons/${props.name}.svg`
    componentsCache[props.name] = defineAsyncComponent(() => iconConstructors[iconPath]())
  }
  return componentsCache[props.name]
})

</script>

<template>
  <component :is="icon" />
</template>
