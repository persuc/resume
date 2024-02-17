<script setup lang="ts">

import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'

interface Props {
  href?: string,
}

const { href } = defineProps<Props>()

const router = useRouter()

function onClick() {
  if (href) {
    router.push(href)
  } else {
    router.back()
  }
}

</script>

<template>
  <Button class="absolute left-4 top-4 z-10" text no-hover @click="onClick">
    <span>
      <slot>← Back</slot>
    </span>
  </Button>
</template>
