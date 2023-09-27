<script setup lang="ts">
import type { NavItems } from '@/@types'

interface Props {
  items: NavItems[]
}

defineProps<Props>();

</script>

<template>
  <div class="flex flex-col">
    <div v-for="item in items" :class="item.classes ?? ''">
      <a :href="item.href">{{ item.label }}</a>
      <slot :name="item.label"></slot>
      <NavItems v-if="item.items" :items="item.items" class="ml-2" />
    </div>
  </div>
</template>