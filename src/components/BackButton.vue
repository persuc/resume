<script setup lang="ts">

import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'

interface Props {
  href?: string,
  handler?: () => boolean
}

const { href, handler } = defineProps<Props>()

const router = useRouter()

function onClick() {
  if (handler && handler()) {
    return
  }
  if (href) {
    router.push(href)
  } else if (router.options.history.state.back !== null) {
    router.back()
  } else {
    router.push('/')
  }
}

</script>

<template>
  <Button class="absolute left-4 top-4 z-10 select-none" variant="text" @click="onClick">
    <span>
      <slot>← Back</slot>
    </span>
  </Button>
</template>
