<script setup lang="ts">
interface Props {
  company: string,
  role: string,
  dateFrom: string,
  dateTo: string,
}

defineProps<Props>();
</script>

<template>
  <div class="flex space-between">
    <h3>{{ company }}<span style="font-weight: 300;"> • {{ role }}</span></h3><i>{{ dateFrom }} - {{ dateTo }}</i>
  </div>
</template>

<style scoped lang="postcss">
</style>
