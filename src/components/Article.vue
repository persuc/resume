<script setup lang="ts">
import type { NavItems } from '@/@types'
import Nav from '@/components/Nav.vue'

interface Props {
  items?: NavItems[]
  back?: string
  footer?: boolean
}

defineProps<Props>();

</script>

<template>
  <div v-if="items" class="flex lg:flex-row flex-col" style="column-gap: calc(50% - 36.5rem);">
    <Nav class="lg:h-screen" :items="items" :back="back" />

    <article class="px-4 lg:px-8 lg:pt-8 pt-20 min-w-0" style="margin-right: max(calc(50% - 36rem), 0px);">
      <slot></slot>
      <div v-show="footer ?? true" class="py-32"></div>
    </article>
  </div>
  <article v-else class="lg:px-8 mx-auto max-w-5xl">
    <slot class="pt-8"></slot>
    <div v-show="footer ?? true" class="py-32"></div>
  </article>
</template>