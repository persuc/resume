<script setup lang="ts">
import { useRouter } from 'vue-router'
import booksImage from '@/assets/books.png'
import hornImage from '@/assets/postal_horn.png'
import linkedInImage from '@/assets/linkedin.png'
import bgImage from '@/assets/lee_ufan.jpeg'
import starImage from '@/assets/glowing_star.png'
import ImageAndText from '@/components/ImageAndText.vue'
import IconDownload from '@/components/icons/IconDownload.vue';
import { EMAIL, PHONE } from '@/ts/constants'

const router = useRouter()

function goResume() {
  router.push('/resume')
}

function goAccomplishments() {
  router.push('/accomplishments')
}

function goTalents() {
  router.push('/talents')
}

function goWant() {
  router.push('/want')
}

</script>

<template>
  <div class="home flex" :style="`background-image: url(${bgImage}); flex-direction: column; height: 100vh; min-width: 100vw; background-position: center;`">
    <div class="content" style="flex-grow: 1">
      <div class="pa-4 br-1 mx-5" style="background-color: var(--color-background);">
        <h1>Hey, I'm Andrew!</h1>
  
        <p>I am great at <b>identifying opportunities</b> for improvement and seeing through the technical implementation to <b>deliver value across teams</b>. I do this by forming relationships and understanding individual needs, before establishing partnerships to tackle immediate, widespread concerns. Then I provide the drive to define goals, and provide the technical knowhow to help deliver them.</p>
  
        <p>Thanks for coming to hear about me! Here are some more things to check out:</p>
    
        <ImageAndText class="border br-1 mb-2" @click="goResume" style="cursor: pointer;" :image="booksImage">
          <div class="flex space-between">
            <h2>Resume</h2>
            <a href="/andrew_persic_resume.pdf" download @click.stop class="plain"> 
              <div class="button text">
                <IconDownload class="mr-2" style="opacity: 0.8;" />Download
              </div>
            </a>
          </div>
        </ImageAndText>
  
        <ImageAndText class="border br-1 mb-2" @click="goTalents" style="cursor: pointer;" :image="starImage">
          <h2>What I'm good at</h2>
        </ImageAndText>
  
        <ImageAndText class="border br-1 mb-2" @click="goAccomplishments" style="cursor: pointer;" :image="hornImage">
          <h2>What I've done</h2>
        </ImageAndText>
      </div>
    </div>
    <div class="footer flex center px-4 py-2" style="background-color: var(--color-background); justify-content: end;">
      <span class="mr-2">{{ EMAIL }}</span>
      <span class="ml-1 mr-2" style="border-left: 1pt solid var(--color-border-hover); display: inline-block; width: 1pt; height: 1.5rem;"></span>
      <span class="mr-2">{{ PHONE }}</span>
      <span class="ml-1 mr-2" style="border-left: 1pt solid var(--color-border-hover); display: inline-block; width: 1pt; height: 1.5rem;"></span>
      <a class="plain ml-1" target="_blank" href="https://www.linkedin.com/in/andrew-persic/" style="height: 1.5rem">
        <img :src="linkedInImage" style="width: 1.5rem;" />
      </a>
    </div>
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

.content {
  margin: 2rem auto 0 auto;
}

@media (min-width: 1024px) {
  .content {
    margin: 2rem 0 0 50%;
    max-width: 512px; 
  }
}
</style>
