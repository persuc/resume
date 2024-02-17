<script setup lang="ts">

import Button from '@/components/Button.vue'

interface Props {
  href: string,
}

withDefaults(defineProps<Props>(), {
  href: '/'
});

</script>

<template>
  <a href="/" class="plain absolute left-4 top-4 z-10">
    <Button text no-hover>
      <span>
        <slot>← Back</slot>
      </span>
    </Button>
  </a>
</template>
