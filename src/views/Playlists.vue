<script setup lang="ts">
import Button from '@/components/Button.vue'

const playlists = [
  "https://open.spotify.com/embed/playlist/2XRGhOOzfHrmcycoz2AjuA",
  "https://open.spotify.com/embed/playlist/3ubzEgNER9FzfLQMNOAfQJ",
  "https://open.spotify.com/embed/playlist/5BPF1eHj3UayE6NBNsItC1",
  "https://open.spotify.com/embed/playlist/1sPnMnW623zxnCFriYimmN",
  "https://open.spotify.com/embed/playlist/1swJ9zGgLpwAJZ5Ui92VUY",
  "https://open.spotify.com/embed/playlist/0GrSrfQOUDDyl7PXtFi84K",
  "https://open.spotify.com/embed/playlist/3mhvZ0Q2vZsa7ONEJsdZFk",
  "https://open.spotify.com/embed/playlist/2jIe7dou2Atj9DEb6Q9Nv4",
  "https://open.spotify.com/embed/playlist/39eTkPahqikwSrcDDWfVli",
]

</script>

<template>
  <a href="/" class="plain absolute left-0 top-1 z-10">
    <Button text no-hover>
      <span>← Back</span>
    </Button>
  </a>

  <div class="blog px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">

    <p class="text-3xl mb-4">Playlists by me and my friends</p>

    <iframe v-for="url in playlists" :key="url" style="border-radius:12px" :src="url" width="100%" height="352"
      frameBorder="0" allowfullscreen=""
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
