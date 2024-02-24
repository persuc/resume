<script setup lang="ts">
import type { NavItems } from '@/@types'
import BackButton from '@/components/BackButton.vue'

interface Props {
  items: NavItems[]
  back?: string
}

defineProps<Props>();

</script>

<template>
  <div class="flex flex-col">
    <BackButton v-if="back" :href="back" class="relative !-left-5 !top-0" />
    <div v-for="item in items" :class="item.classes ?? ''">
      <a :href="item.href">{{ item.label }}</a>
      <slot :name="item.label"></slot>
      <NavItems v-if="item.items" :items="item.items" class="ml-2" />
    </div>
  </div>
</template>