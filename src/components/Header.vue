<script setup lang="ts">
import { useRouter } from 'vue-router'
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
  <header>
    <div @click="goHome" class="button text">
      <span>← Back</span>
    </div>

    <slot></slot>
  </header>
</template>

<style scoped>
</style>
