<script setup lang="ts">
import { computed } from 'vue'


interface Props {
  href: string,
  thumbnail?: string | string[],
}

const props = defineProps<Props>()

const thumbnails = computed(() => {
  return [(props.thumbnail ?? [])].flat()
})

</script>

<template>
  <a target="_blank" :href="href">
    <div v-if="thumbnail" class="w-80 rounded-md border border-gray-300">
      <div class="w-80 h-80 relative">
        <img v-for="thumb in thumbnails" class="w-full absolute h-full" :src="thumb" />
      </div>
      <div class="py-2 px-2">
        <slot></slot>
      </div>
    </div>
    <slot v-else></slot>
  </a>
</template>