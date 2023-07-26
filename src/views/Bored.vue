<script setup lang="ts">
import Header from '@/components/Header.vue'

</script>

<template>

  <Header />

  <div class="talents px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <h2>Here are some games to pass the time</h2>

    <a href="/missing-word">Missing word</a>
    <br />
    <a href="/word-pinpoint">Word pinpoint</a>
    <br />
    <a href="/blackout">Blackout Poem</a>
    <br/>
    <a href="/solitaire">Stone Solitaire</a>
    <br/>
    <a href="/draw">Super sicko draw mode</a>
    <span class="ml-4" style="color: var(--color-subheading)">Clone of the popular drawing puzzle game <a target="_blank" href="https://store.steampowered.com/app/2246110/Q_REMASTERED/">"Q"</a>. Not mobile friendly.</span>
    <br/>
    <br />

    I also recommend <a target="_blank" href="https://youtu.be/DMQ_HcNSOAI">this video</a>.

  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2rem;
}

h3 {
  font-size: 1.2rem;
}

</style>
