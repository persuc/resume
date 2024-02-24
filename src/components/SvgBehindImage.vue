<script setup lang="ts">
import Icon from '@/components/Icon.vue'

interface Props {
  svg: string,
  image: string
}

const props = defineProps<Props>()

const imageUrl = new URL(`/src/assets/${props.image}`, import.meta.url).toString()

</script>

<template>
  <div class="relative">
    <Icon :name="svg" />
    <img class="absolute top-0" :src="imageUrl" />
    <div class="font-medium text-center">
      <slot></slot>
    </div>
  </div>
</template>
