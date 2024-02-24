<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import bodeVocoder from '@/assets/bode_vocoder.png'
import deltap from '@/assets/deltap.jpg'
import disaster from '@/assets/disaster-etymology.png'

</script>

<template>
  <BackButton />

  <article class="px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">

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

    <div class="mb-8">
      <p>ANTONY It is shaped, sir, like itself, and it is as broad as it hath breadth. It is just so high as it is, and
        moves with its own organs. It lives by that which nourisheth it, and, the elements once out of it, it expires.
      </p>

      <p>LEPIDUS What color is it?</p>

      <p>ANTONY Of its own color too.</p>

      <p>LEPIDUS It's a strange snake.</p>

      <p>ANTONY 'Tis so. And the tears of it are wet.</p>

      <i>- William Shakespeare, "Antony and Cleopatra"</i>
    </div>

    <!-- <a target="_blank" href="https://youtu.be/AEtbFm_CjE0">
      <div class="border-gray-200 border rounded p-4 w-fit">
        <p class="mb-4">
          What is delta p?
        </p>
        <img :src="deltap" class="max-w-2xl" />
      </div>
    </a> -->

    <div class="border-gray-200 border rounded p-4 w-fit mb-8">
      <img :src="disaster" class="mx-auto" />
    </div>

    <!-- <p class="mb-8">
      

    </p> -->

    <div class="py-16"></div>

  </article>
</template>
