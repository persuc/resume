<script setup lang="ts">
interface Props {
  name?: string,
  image: string
}

defineProps<Props>();

</script>

<template>
  <div class="flex center hcenter pa-2">
    <img class="mb-2 br-2" :src="image" />
    <br />
    <span v-if="name">{{ name }}</span>
  </div>
</template>

<style scoped lang="postcss">

</style>
