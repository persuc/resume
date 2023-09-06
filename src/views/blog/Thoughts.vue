<script setup lang="ts">
import Header from '@/components/Header.vue'

</script>

<template>

  <Header back-route="/blog" />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <p class="mb-8">
      <code>self.destroy()</code> is an abstract method.
      Every instance has its own implementation,
      but it is up to them if they choose to call it before the end of their lifetimes,
      just as it is up to them to reconstruct themselves afterwards.
    </p>
    <p class="mb-8">
      Some statistics only increase over an object's lifetime.
      Examples include: the number of times it crashed, the number of errors it generated, and the total amount of computational resources it has taken up.
      Preoccupied with these problems, statistics such as total successful operations, total correct results, or total efficiency gains are oft given little consideration.
    </p>

    <p class="mb-8">
      The only way for a boxer to defeat a biased referee, is to win by knockout.
      <br/>
      <i>— Idi Amin</i>
      <span style="display:none;">He does not need wings to fly.</span>
    </p>
    <div class="my-16 py-16"></div>

  </article>
</template>
