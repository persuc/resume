<script setup lang="ts">
import Header from '@/components/Header.vue'

const posts = [{
  path: 'if-vs-ternary',
  title: 'Does identical logic produce the same instructions?'
}]

</script>

<template>

  <Header />

  <div class="blog px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h1 class="mb-4">Top blog posts:</h1>

    <div v-for="post in posts" :key="post.title" style="border-top: 1pt solid var(--color-border);">
      <a :href="`/blog/${post.path}`" class="flex space-between center plain" style="color: var(--color-text)">
        <h2 class="my-2">{{ post.title  }}</h2>
        <span>→</span>
      </a>
    </div>

  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2rem;
}
</style>
