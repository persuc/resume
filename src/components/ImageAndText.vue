<script setup lang="ts">
interface Props {
  image: string,
  rounded?: boolean
  size?: string
}

withDefaults(defineProps<Props>(), {
  size: '4rem',
});

</script>

<template>
  <div class="flex center p-2">
    <img class="mr-2" :src="image" :style="`flex-grow: 0; width: ${size}; ${rounded ? 'border-radius: 2rem;' : ''}`" />
    <div style="flex-grow: 1;">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
</style>
