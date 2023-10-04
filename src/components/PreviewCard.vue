<script setup lang="ts">
import type { PreviewCard } from '@/@types'

interface Props {
  card: PreviewCard,
  boundHeight: boolean
}

withDefaults(defineProps<Props>(), {
  boundHeight: true
})
</script>

<template>
  <a :href="card.path" :class="`!no-underline ${boundHeight ? 'h-56' : ''} w-64`">
    <div :class="`p-4 border rounded flex flex-col items-center ${boundHeight ? 'h-56' : ''} w-64`">
      <span class="underline leading-3">{{ card.title }}</span>
      <component v-if="card.previewComponent" :is="card.previewComponent"
        class="flex mt-4 text-black h-full w-full bg-gray-50 px-4 p-2 rounded" />
      <img v-else-if="card.thumb" :src="card.thumb" class="pt-4 object-contain w-full h-full" />
    </div>
  </a>
</template>