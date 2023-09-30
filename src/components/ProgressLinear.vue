<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  value: number
  text?: boolean
  max?: number
  containerClasses?: string
  barClasses?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: false,
  max: 100,
  color: 'bg-red',
  containerClasses: 'bg-gray-100',
  barClasses: 'bg-gray-200',
  label: '',
})

const percentage = computed(() => (props.value / props.max) * 100)
</script>

<template>
  <div class="flex items-center">
    <div v-show="label" class="mr-2 grow-0">
      {{ label }}
    </div>
    <div :class="`grow-1 w-full h-2 relative ${containerClasses}`">
      <div class="absolute w-full h-2 text-center text-shadow shadow-gray-500 bottom-2 z-10">
        {{ text ? `${value} / ${max}` : '' }}
      </div>
      <div :class="`h-2 ${barClasses}`" :style="`width: ${percentage}%`"></div>
    </div>
  </div>
</template>
