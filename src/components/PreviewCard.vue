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
    <div :class="`p-4 border rounded flex flex-col items-center gap-y-2 ${boundHeight ? 'h-56' : ''} w-64`">
      <div class="underline">{{ card.title }}</div>
      <div v-if="card.previewComponent || card.thumb" class="w-full h-full overflow-auto">
        <component v-if="card.previewComponent" :is="card.previewComponent"
          class="flex mt-4 text-black h-full w-full bg-gray-50 px-4 p-2 rounded" />
        <img v-else-if="card.thumb" :src="card.thumb" class="object-contain h-full w-full" />
      </div>
    </div>
  </a>
</template>