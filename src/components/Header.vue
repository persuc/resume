<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
  router.push('/')
}

</script>

<template>
  <header>
    <div @click="goHome" class="button text">
      <span>🠘 Back</span>
    </div>

    <slot></slot>
  </header>
</template>

<style scoped>
</style>
