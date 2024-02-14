<script setup lang="ts">
import Header from '@/components/Header.vue'
import bodeVocoder from '@/assets/bode_vocoder.png'
import deltap from '@/assets/deltap.jpg'

</script>

<template>
  <Header back-route="/" />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">

    <p class="mb-8">
      <code>self.destroy()</code> is an abstract method.
      Every instance has its own implementation, but only some choose to call it early.
    </p>

    <p class="mb-8">
      The only way for a boxer to defeat a biased referee, is to win by knockout.
      <br />
      <i>— Idi Amin</i>
      <span style="display:none;">He does not need wings to fly.</span>
    </p>

    <p class="mb-8">
      "The Australian mountain forests are funereal, secret, stern. Their solitude is desolation. They seem to stifle in
      their black gorges a story of sullen despair. No tender sentiment is nourished in their shade… The very animal life
      of these frowning hills is either grotesque or ghostly. Great grey kangaroos hop noiselessly over the coarse grass.
      Flights of white cockatoos stream out shrieking like evil souls. The sun suddenly sinks, and mopokes burst out into
      horrible peals of semi-human laughter… All is fear-inspiring and gloomy."
      <br />
      <i>- Marcus Clarke, 1876</i>
    </p>

    <a target="_blank" href="https://youtu.be/5kc-bhOOLxE">
      <div class="border-gray-200 border rounded p-4 w-fit mb-8">
        <p class="mb-4">
          What are the vocoder tricks???
        </p>
        <img :src="bodeVocoder" class="max-w-2xl" />
      </div>
    </a>

    <p class="mb-8">
      "It is difficult to estimate the misery inflicted upon thousands of persons, and the absolute pecuniary penalty
      imposed upon multitudes of intellectual workers by the loss of their time, destroyed by organ-grinders and other
      similar nuisances."
      <br />
      <i>- Charles Babbage, 1864</i>
    </p>

    <p class="mb-8">
      ANTONY Sir, it's shaped like itself and is as wide as it has width. It is only as high as it is and moves with its
      own legs. It lives on what nourishes it, and when the four elements leave it, its soul moves into another body.

      LEPIDUS What color is it?

      ANTONY Of its own color too.

      ANTONY Its own color.

      LEPIDUS It's a strange snake.

      ANTONY 'Tis so. And the tears of it are wet.

      <br />
      <i>- William Shakespeare, "Antony and Cleopatra"</i>
    </p>

    <!-- <a target="_blank" href="https://youtu.be/AEtbFm_CjE0">
      <div class="border-gray-200 border rounded p-4 w-fit">
        <p class="mb-4">
          What is delta p?
        </p>
        <img :src="deltap" class="max-w-2xl" />
      </div>
    </a> -->

    <div class="py-16"></div>

  </article>
</template>
