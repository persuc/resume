<script setup lang="ts">
interface Props {
  tech: string[] 
}

defineProps<Props>();

</script>

<template>
  <b>Tech: </b>
  <template v-for="(t, i) in tech">
    <i>{{ t }}</i>{{ i === tech.length - 1 ? '' : ', ' }}
  </template>
</template>

<style scoped>
</style>
