<script setup lang="ts">
import Article from '@/components/Article.vue'
import Button from '@/components/Button.vue'
</script>

<template>
  <a href="/" class="plain absolute left-0 top-1 z-10">
    <Button text no-hover>
      <span>← Back</span>
    </Button>
  </a>
  <Article class="max-w-7xl">

    <p class="mt-8 font-display text-xl font-bold">Welcome to my wall!</p>

    <p class="mb-8">This is a google doc with open permissions, feel free to leave me a message, or create some chaos 😈
    </p>

    <iframe class="w-full h-screen"
      src="https://docs.google.com/document/d/1u5JzHT5a9x57gD80HSfMfd-QpcKk9FMyavCyFo0glc4/edit?usp=sharing"></iframe>
  </Article>
</template>