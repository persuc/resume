<script setup lang="ts">
interface Props {
  title: string,
}

defineProps<Props>()
</script>

<template>
  <div class="font-display uppercase lg:mt-0 mt-4 text-lg w-fit"> {{ title }}</div>
  <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
    <slot />
  </div>
</template>