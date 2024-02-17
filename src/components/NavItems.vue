<script setup lang="ts">
import type { NavItems } from '@/@types'
import BackButton from '@/components/BackButton.vue'

interface Props {
  items: NavItems[]
}

defineProps<Props>();

</script>

<template>
  <div class="flex flex-col">
    <div v-for="item in items" :class="(item == 'back' || !item.classes) ? '' : item.classes">
      <BackButton v-if="item == 'back'" class="relative !-left-5 !top-0" />
      <template v-else>
        <a :href="item.href">{{ item.label }}</a>
        <slot :name="item.label"></slot>
        <NavItems v-if="item.items" :items="item.items" class="ml-2" />
      </template>
    </div>
  </div>
</template>