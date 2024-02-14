<script setup lang="ts">

interface Props {
  href: string,
}

defineProps<Props>()
</script>

<template>
  <a target="_blank" :href="href">
    <slot></slot>
  </a>
</template>