<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'

const playlists = [
  "https://open.spotify.com/embed/playlist/4SoPjoHiuWD1GwBFTGYkWC", // Liv: B sides
  "https://open.spotify.com/embed/playlist/2XRGhOOzfHrmcycoz2AjuA", // Liv: Monologs songs
  "https://open.spotify.com/embed/playlist/3ubzEgNER9FzfLQMNOAfQJ", // Liv: Auditory evoked potentials
  "https://open.spotify.com/embed/playlist/5BPF1eHj3UayE6NBNsItC1", // Jerome: edgy 13yo songs
  "https://open.spotify.com/embed/playlist/1sPnMnW623zxnCFriYimmN", // Jerome: leaving home
  "https://open.spotify.com/embed/playlist/1swJ9zGgLpwAJZ5Ui92VUY", // Jerome: songs to play tekken to (epic battle songs)
  "https://open.spotify.com/embed/playlist/0GrSrfQOUDDyl7PXtFi84K", // Grace: yoshimitsu sex
  "https://open.spotify.com/embed/playlist/4Npl3rCfsNhL8n66ACf8RN", // Grace: commie songs only
  "https://open.spotify.com/embed/playlist/3mhvZ0Q2vZsa7ONEJsdZFk", // Andrew: Ska
  "https://open.spotify.com/embed/playlist/2jIe7dou2Atj9DEb6Q9Nv4", // Andrew: Prog Rock
  "https://open.spotify.com/embed/playlist/39eTkPahqikwSrcDDWfVli", // Andrew: Min, Maj7, Maj6
]

</script>

<template>
  <BackButton />

  <div class="px-8 pt-16" style="max-width: 60rem; margin: 0 auto;">

    <p class="text-3xl mb-4">Playlists by me and my friends</p>

    <iframe v-for="url in playlists" :key="url" style="border-radius:12px" :src="url" width="100%" height="352"
      frameBorder="0" :allowfullscreen="false"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
      class="my-4"></iframe>

    <!-- <div class="border-t border-gray-200">
      <a :href="`${post.path}`" class="flex justify-between items-center plain" style="color: var(--color-text)">
        <div class="mb-2">
          <div class="mt-2 text-xl">{{ post.title }}</div>
          <span class="text-slate-500">{{ post.subtitle }}</span>
        </div>
        <span>→</span>
      </a>
    </div> -->

  </div>
</template>
