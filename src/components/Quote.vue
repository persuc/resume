<script setup lang="ts">
interface Props {
  quotation: string,
  author: string,
}

defineProps<Props>();

</script>

<template>
  <p class="pa-2" style="border-left: 2pt solid var(--color-border); background-color: var(--color-background-hover);">
    “{{ quotation }}”
    <br />
    <i class="ml-2" style="">— {{ author }}</i>
  </p>
</template>

<style scoped>
</style>
