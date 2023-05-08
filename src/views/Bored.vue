<script setup lang="ts">
import Header from '@/components/Header.vue';

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
