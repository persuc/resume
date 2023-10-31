<script setup lang="ts">
import { useRouter } from 'vue-router'
import booksImage from '@/assets/books.png'
import hornImage from '@/assets/postal_horn.png'
import linkedInImage from '@/assets/linkedin.png'
import starImage from '@/assets/glowing_star.png'
import ImageAndText from '@/components/ImageAndText.vue'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import { EMAIL } from '@/ts/constants'
import { blogPosts } from '@/ts/blog'
import { games } from '@/ts/games'
import type { PreviewCard as TPreviewCard } from '@/@types'
import PreviewCard from '@/components/PreviewCard.vue'
import HomeGrid from '@/components/home/HomeGrid.vue'

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

const randomPages: TPreviewCard[] = [
  { path: 'components', title: 'Stories' },
  { path: 'study', title: 'Study' },
  { path: 'blog/thoughts', title: 'Thoughts' },
]

</script>

<template>
  <div class="flex flex-col gap-y-8 mx-8 max-w-6xl mx-auto items-center px-8 pb-16">
    <div class="flex flex-col mt-48 items-center justify-end">
      <p class="text-3xl">Andrew Persic</p>
      <div class="rounded bg-white">
        <p>I am great at <b>identifying opportunities</b> for improvement and seeing through the technical implementation
          to <b>deliver value across teams</b>. I do this by building relationships and understanding individual needs,
          before establishing partnerships to tackle immediate, widespread concerns. Then I provide the drive to define
          goals, and provide the technical knowhow to help deliver them.</p>
        <p>Thanks for coming to hear about me! Here are some more things to check out:</p>
      </div>
    </div>

    <!-- https://docs.google.com/document/d/1u5JzHT5a9x57gD80HSfMfd-QpcKk9FMyavCyFo0glc4/edit?usp=sharing -->
    <iframe class="w-full h-96"
      src="https://docs.google.com/document/d/1u5JzHT5a9x57gD80HSfMfd-QpcKk9FMyavCyFo0glc4/edit?usp=sharing"></iframe>
    <!-- <iframe src="https://docs.google.com/document/d/e/2PACX-1vQ5SBzAfxslwIHreQtZFt3mfezBBGA-T8CBBa9f8EGr9lOV1f5TgofO-JDF4hJX1rHQmzen6wRcyu79/pub?embedded=true"></iframe> -->

    <div class="grid lg:grid-cols-[auto_minmax(0px,_1fr)] gap-4 w-fit">
      <HomeGrid title="For Recruiters">
        <ImageAndText class="w-64 border rounded cursor-pointer" slim @click="goResume" :image="booksImage" size="2rem">
          <div class="flex justify-between items-center h-12">
            <span class="text-xl pl-1">Resume</span>
            <a href="/andrew_persic_resume.pdf" download @click.stop class="plain">
              <Button text slim class="ml-2 py-2 text-sm">
                <Icon name="download" class="mr-2 opacity-80 w-5" />Save
              </Button>
            </a>
          </div>
        </ImageAndText>

        <ImageAndText class="w-64 border rounded" @click="goTalents" style="cursor: pointer;" :image="starImage"
          size="2rem">
          <div class="w-full text-xl pl-1 pr-2">What I'm Good At</div>
        </ImageAndText>

        <ImageAndText class="w-64 border rounded" @click="goAccomplishments" style="cursor: pointer;" :image="hornImage"
          size="2rem">
          <div class="w-full text-xl pl-1 pr-2">What I've Done</div>
        </ImageAndText>
      </HomeGrid>

      <HomeGrid title="Blogs">
        <PreviewCard v-for="post in blogPosts.slice(0, 2)" :card="post" />
        <PreviewCard :card="{ title: 'More...', path: '/blog' }" />
      </HomeGrid>

      <HomeGrid title="Games">
        <PreviewCard v-for="game in games" :card="game" />
      </HomeGrid>

      <HomeGrid title="Random">
        <PreviewCard v-for="page in randomPages" :card="page" :bound-height="false" />
      </HomeGrid>
    </div>

    <div class="py-16"></div>
  </div>

  <div class="fixed bottom-0 right-0 flex justify-end p-2 bg-white w-screen">
    <div class="flex items-center flex-row">
      <span class="mr-2">{{ EMAIL }}</span>
      <span class="ml-1 mr-2 border-l border-slate-400 h-4"></span>
      <a class="plain mr-1" target="_blank" href="https://www.github.com/persuck/" style="height: 1.5rem">
        <img src="https://github.com/fluidicon.png" style="width: 1.5rem;" />
      </a>
      <span class="ml-1 mr-2 border-l border-slate-400 h-4"></span>
      <a class="plain ml-1" target="_blank" href="https://www.linkedin.com/in/andrew-persic/" style="height: 1.5rem">
        <img :src="linkedInImage" style="width: 1.5rem;" />
      </a>
    </div>
  </div>
</template>