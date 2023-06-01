<script setup lang="ts">
interface Props {
  quotation: string,
  author: string,
}

defineProps<Props>();
</script>

<template>
  <Note>
    “{{ quotation }}”
    <br />
    <i class="ml-2" style="">— {{ author }}</i>
  </Note>
</template>
