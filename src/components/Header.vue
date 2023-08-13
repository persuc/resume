<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
const router = useRouter()

interface Props {
  backRoute?: string,
}

const props = withDefaults( defineProps<Props>(), {
  backRoute: '/'
})

function goHome() {
  router.push(props.backRoute)
}

</script>

<template>
  <header class="flex justify-between items-center p-4 text-base border-b bg-gray-100">
    <Button text @click="goHome">
      <span>← Back</span>
    </Button>
    <slot></slot>
  </header>
</template>

<style scoped>
</style>
