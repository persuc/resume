<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import Codeblock from '@/components/Codeblock.vue'
import Article from '@/components/Article.vue'

</script>

<template>
  <BackButton />
  <Article class="pt-16">

    <p class="text-3xl">How to write a homebrew formula</p>

    <p>This post explores what proximal policy optimisation is, and my learning process when implementing it to train an
      agent to play the Atari game Breakout using an <External
        href="https://www.gymlibrary.dev/environments/atari/breakout/">emulated environment</External>.</p>


    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>