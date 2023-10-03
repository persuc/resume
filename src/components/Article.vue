<script setup lang="ts">
import type { NavItems } from '@/@types'
import Nav from '@/components/Nav.vue'

interface Props {
  items?: NavItems[]
}

defineProps<Props>();

</script>

<template>
  <div class="flex lg:flex-row flex-col" style="column-gap: calc(50% - 36rem);">
    <Nav class="lg:h-screen" v-if="items" :items="items" />

    <article class="px-4 lg:px-8 lg:pt-8 pt-20 max-w-min min-w-0">
      <slot></slot>
      <div class="py-32"></div>
    </article>
  </div>
</template>