<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import Codeblock from '@/components/Codeblock.vue'

</script>

<template>
  <BackButton />
  <Article>

    <p class="text-3xl">What is StyleTTS?</p>

    <p>This post explores what proximal policy optimisation is, and my learning process when implementing it to train an
      agent to play the Atari game Breakout using an <External
        href="https://www.gymlibrary.dev/environments/atari/breakout/">emulated environment</External>.</p>


    <Codeblock label="PPOArgs" language="python" :code="'PPOArgs()'" />

    <br />

    <p class="my-16 py-16"></p>


  </Article>
</template>