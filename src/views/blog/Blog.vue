<script setup lang="ts">
import Button from '@/components/Button.vue'
import { blogPosts } from '@/ts/blog'

</script>

<template>
  <a href="/" class="plain absolute left-4 top-4 z-10">
    <Button text no-hover>
      <span class="text-nowrap">← Back</span>
    </Button>
  </a>

  <div class="blog px-8 pt-24 md:pt-8" style="max-width: 60rem; margin: 0 auto;">

    <p class="text-3xl mb-4">Recent blog posts:</p>

    <div v-for="post in blogPosts" :key="post.title" class="border-t border-gray-200">
      <a :href="`${post.path}`" class="flex justify-between items-center plain" style="color: var(--color-text)">
        <div class="grid grid-cols-[4rem,auto] gap-x-2 p-2">
          <img :src="post.thumb" class="object-contain" />
          <div class="flex flex-col justify-center">
            <div class="text-xl">{{ post.title }}</div>
            <div class="text-slate-500">{{ post.subtitle }}</div>
          </div>
        </div>
        <span>→</span>
      </a>
    </div>

  </div>
</template>
