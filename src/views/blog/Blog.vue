<script setup lang="ts">
import Header from '@/components/Header.vue'

const posts = [
  {
  path: 'if-vs-ternary',
  title: 'Does identical logic produce the same instructions?',
  subtitle: 'Assembly, C++'
  },
  {
  path: 'algs-in-three-levels',
  title: 'Algorithms in Three Levels',
  subtitle: 'Python, Algorithms & Data Structures'
}
]

</script>

<template>

  <Header />

  <div class="blog px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h1 class="mb-4">Top blog posts:</h1>

    <div v-for="post in posts" :key="post.title" style="border-top: 1pt solid var(--color-border);">
      <a :href="`/blog/${post.path}`" class="flex space-between center plain" style="color: var(--color-text)">
        <div class="mb-2">
          <h2 class="mt-2 mb-0">{{ post.title  }}</h2>
          <span style="color: var(--color-subheading)">{{ post.subtitle }}</span>
        </div>
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
