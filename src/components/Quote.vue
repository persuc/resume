<script setup lang="ts">
import Note from '@/components/Note.vue'

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
