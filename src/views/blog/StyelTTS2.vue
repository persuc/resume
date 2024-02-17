<script setup lang="ts">
import Article from '@/components/Article.vue'
import BackButton from '@/components/BackButton.vue'
import Codeblock from '@/components/Codeblock.vue'

const navItems = [
  "back" as const,
  {
    href: '#top',
    label: 'What is StyleTTS?',
  },
]

</script>

<template>
  <Article :items="navItems" id="top">

    <p class="text-3xl">What is StyleTTS?</p>

    <p>
      <External href="https://www.gymlibrary.dev/environments/atari/breakout/">2019 paper</External>.
    </p>


    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>