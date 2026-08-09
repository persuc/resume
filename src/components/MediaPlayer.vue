<script setup lang="ts">
import type { MediaEmbed } from '@/ts/media'

defineProps<{
  embed: MediaEmbed
}>()
</script>

<template>
  <div v-if="embed.kind === 'youtube'" class="relative w-full aspect-video">
    <iframe :src="embed.src" :title="embed.title" class="absolute inset-0 w-full h-full border-0" loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
  </div>

  <iframe v-else :src="embed.src" :title="embed.title" :height="embed.height" class="w-full border-0" loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
</template>
