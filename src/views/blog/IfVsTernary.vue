<script setup lang="ts">
import Expand from '@/components/Expand.vue'
import Header from '@/components/Header.vue';

</script>

<template>

  <Header />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h2>Don't worry, the compiler will optimise it.</h2>

    <p>I've recently been diving into some performance optimisation resources such as <a target="_blank" href="https://en.algorithmica.org/">Algorithmica</a> and <a target="_blank" href="https://github.com/dendibakh/perf-ninja">Perf. Ninja</a>. The option of those who work in high performance computing seems to be that while a modern compiler will usually do a good job of optimising away unnecessary instructions, you can't always rely on this behaviour. Also you can't always know what assembly will be generated for some given source code since it depends on the compiler, architecture, and compiler configuration. That's why libraries such as <a href="https://github.com/xianyi/OpenBLAS/">OpenBLAS</a> exist - aiming to implement entire libraries directly in assembly, which means reimplementing every single function for windows, mac, and linux separately, as well as for ARM and Intel architectures.
    </p>

    <Expand class="ml-4 my-2" label="Read more" expanded-label="Read less">
      
    </Expand>

    <h2>Canva: CMS → Rendering Service Sync</h2>

    <ul>
      <li>Building relationships with content managers revealed that there is no retry or management process for errors when syncing data from the CMS to the landing page rendering service</li>
      <li>Set up communication with CMS team, SEO and Landing Page teams to define goals</li>
      <li>Deployed a message queue to contain sync operations between CMS and rendering service.</li>
      <li>Added error reporting using a dead letter queue and UI tools to inspect and retry failed sync operations</li>
      <li>Success metrics: Able to sync millions of rows of landing page data without intervention from engineers if there are conflicts between edits or data consistency issues</li>
    </ul>

    <h2>This site!</h2>

    <ul>
      <li>Built and deployed in a few hours with Vue 3 + Vite + Netlify</li>
      <li>See the code on <a target="_blank" href="https://github.com/andrew-p-dev/resume">GitHub</a></li>
    </ul>
  </article>
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
