<script setup lang="ts">
import Article from '@/components/Article.vue'
import BackButton from '@/components/BackButton.vue'
import Button from '@/components/Button.vue'
</script>

<template>
  <BackButton />
  <Article class="max-w-7xl">

    <p class="mt-8 font-display text-xl font-bold">Welcome to my wall!</p>

    <p class="mb-8">This is a google doc with open permissions, feel free to leave me a message, or create some chaos 😈
    </p>

    <iframe class="w-full h-screen"
      src="https://docs.google.com/document/d/1u5JzHT5a9x57gD80HSfMfd-QpcKk9FMyavCyFo0glc4/edit?usp=sharing"></iframe>
  </Article>
</template>