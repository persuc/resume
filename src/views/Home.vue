<script setup lang="ts">
import { useRouter } from 'vue-router'
import booksImage from '@/assets/books.png'
import conicalFlaskImage from '@/assets/conical-flask.png'
import hornImage from '@/assets/postal_horn.png'
import linkedInImage from '@/assets/linkedin.png'
import bgImage from '@/assets/walter-de-maria-naoshima.jpg'
import starImage from '@/assets/glowing_star.png'
import ImageAndText from '@/components/ImageAndText.vue'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import { EMAIL, PHONE } from '@/ts/constants'

const router = useRouter()

function goResume() {
  router.push('/resume')
}

function goTalents() {
  router.push('/talents')
}

function goAccomplishments() {
  router.push('/accomplishments')
}

function goBlog() {
  router.push('/blog')
}

</script>

<template>
  <div class="home flex flex-col" :style="`background-image: url(${bgImage})`">
    <div class="content grow">
      <div class="p-4 rounded mx-5 bg-white">
        <p class="text-3xl">Hey, I'm Andrew!</p>
  
        <p>I am great at <b>identifying opportunities</b> for improvement and seeing through the technical implementation to <b>deliver value across teams</b>. I do this by building relationships and understanding individual needs, before establishing partnerships to tackle immediate, widespread concerns. Then I provide the drive to define goals, and provide the technical knowhow to help deliver them.</p>
  
        <p>Thanks for coming to hear about me! Here are some more things to check out:</p>
    
        <ImageAndText class="border rounded mb-2" @click="goResume" style="cursor: pointer;" :image="booksImage">
          <div class="flex justify-between items-center">
            <span class="text-xl">Resume</span>
            <a href="/andrew_persic_resume.pdf" download @click.stop class="plain"> 
              <Button text>
                <Icon name="download" class="mr-2 opacity-80 w-5" />Download
              </Button>
            </a>
          </div>
        </ImageAndText>
  
        <ImageAndText class="border rounded mb-2" @click="goTalents" style="cursor: pointer;" :image="starImage">
          <span class="text-xl">What I'm good at</span>
        </ImageAndText>
  
        <ImageAndText class="border rounded mb-2" @click="goAccomplishments" style="cursor: pointer;" :image="hornImage">
          <span class="text-xl">What I've done</span>
        </ImageAndText>

        <ImageAndText class="border rounded mb-2" @click="goBlog" style="cursor: pointer;" :image="conicalFlaskImage">
          <div class="text-xl">Blog</div><span>This is a work in progress don't expect anything, ok?</span>
        </ImageAndText>
      </div>
    </div>
    <div class="footer flex items-center justify-between px-4 py-2 mt-8 bg-white">
      <a href="/bored">I'm bored</a>
      <div class="contact flex flex-col grow items-end sm:flex-row sm:grow-0 sm:items-center">
        <span class="sm:mr-2">{{ EMAIL }}</span>
        <span class="ml-1 mr-2 border-l border-slate-400 h-4 hidden sm:inline-block"></span>
        <span class="sm:mr-2">{{ PHONE }}</span>
        <span class="ml-1 mr-2 border-l border-slate-400 h-4 hidden sm:inline-block"></span>
        <a class="plain ml-1" target="_blank" href="https://www.linkedin.com/in/andrew-persic/" style="height: 1.5rem">
          <img :src="linkedInImage" style="width: 1.5rem;" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">

.home {
  height: 100vh;
  min-width: 100vw;
  background-position: center;
  background-size: cover;
}

.content {
  margin: 2rem auto 0 auto;
  z-index: 2;
}

@media (min-width: 1024px) {
  .content {
    margin: 2rem 0 0 50%;
    max-width: 40rem; 
  }
}
</style>
