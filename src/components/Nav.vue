<script setup lang="ts">
import type { NavItems as TNavItems } from '@/@types'
import NavItems from '@/components/NavItems.vue'
import Icon from '@/components/Icon.vue'

interface Props {
  items: TNavItems[]
}

defineProps<Props>();

</script>

<template>
  <div id="nav" :class="`flex w-full lg:w-64 w-full shrink-0 mb-4 lg:mb-0 ${$attrs.class}`">
    <NavItems :items="items" class="!flex-row lg:!flex-col flex-wrap gap-x-4 lg:gap-x-0 lg:fixed lg:w-64 w-full lg:h-screen p-4 lg:border-r border-b lg:border-b-0 border-gray-200" />
  </div>
  <a class="fixed lg:hidden bg-white rounded-full p-2 left-2 bottom-2 border-gray-200 border z-10 cursor-pointer" href="#nav">
    <Icon name="chevron-left" class="rotate-90 w-6" />
  </a>
</template>
