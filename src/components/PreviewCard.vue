<script setup lang="ts">
import type { PreviewCard } from '@/@types'

interface Props {
  card: PreviewCard,
}

defineProps<Props>()
</script>

<template>
  <a :href="card.path" class="plain h-fit">
    <div class="border border-slate-800 w-64 min-h-64">
      <div v-if="card.thumb || card.previewComponent" class="relative w-full h-64 border-b border-slate-800">
        <img v-if="card.thumb" class="object-cover w-full absolute h-full" :src="card.thumb" />
        <component v-else-if="card.previewComponent" :is="card.previewComponent"
          class="flex text-black h-full w-full px-4 p-2" />
      </div>
      <div class="py-2 px-2 bg-gray-950 text-slate-50 !no-underline">
        {{ card.title }}
      </div>
    </div>
  </a>
</template>