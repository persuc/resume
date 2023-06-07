<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

interface Props {
  name: string,
}

const { name } = defineProps<Props>()

const icon = defineAsyncComponent(() =>
  import(`../assets/icons/${name}.svg`)
)
</script>

<template>
  <component :is="icon" />
</template>