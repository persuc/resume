<script setup lang="ts">
import { useRouter } from 'vue-router'
import booksImage from '@/assets/books.png'
import bgImage from '@/assets/lee_ufan.jpeg'
import ImageAndText from '@/components/ImageAndText.vue'

const router = useRouter()

function goResume() {
  router.replace('/resume')
}

</script>

<template>
  <div class="home" :style="`background-image: url(${bgImage}); min-height: 100vh; min-width: 100vw; background-position: center;`">
    <div class="absolute pa-4 br-1" style="max-width: 30rem; left: 50vw; top: 6rem; background-color: var(--color-background);">
      <h1>Hey, I'm Andrew!</h1>
  
      <ImageAndText class="border br-1" @click="goResume" style="cursor: pointer;" :image="booksImage">
        <h2>Resume</h2>
        <p>See a record of my past experience and summary of my skills</p>
      </ImageAndText>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
}
</style>
