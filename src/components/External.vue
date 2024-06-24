<script setup lang="ts">
import { computed } from 'vue'


interface Props {
  href: string,
  thumbnail?: string | string[],
  size?: string,
}

const props = withDefaults(defineProps<Props>(), {
  size: '16rem',
})

const thumbnails = computed(() => {
  return [(props.thumbnail ?? [])].flat()
})

</script>

<template>
  <a target="_blank" :href="href">
    <div v-if="thumbnail" class="border border-slate-800" :style="`width: ${size};`">
      <div class="relative w-full" :style="`height: ${size};`">
        <img v-for="thumb in thumbnails" class="object-cover h-full w-full absolute" :src="thumb" />
      </div>
      <div class="py-2 px-2 bg-slate-800 text-slate-50 underline">
        <slot></slot>
      </div>
    </div>
    <slot v-else></slot>
  </a>
</template>