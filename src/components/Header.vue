<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'

</script>

<template>
  <BackButton />
  <div class="px-8 pt-16" style="max-width: 60rem; margin: 0 auto;">
    <slot></slot>
  </div>
</template>

<style scoped></style>
