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
  <div class="flex items-center p-2">
    <img class="mr-2 grow-0" :src="image" :style="`width: ${size}; ${rounded ? 'border-radius: 2rem;' : ''}`" />
    <div class="grow">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
</style>
