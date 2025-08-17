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
  { path: 'wall', title: 'Google Doc?' },
  { path: 'playlists', title: 'Playlists' },
  { path: 'tablature', title: 'Tablature' },
]

</script>

<template>
  <div class="flex flex-col gap-y-8 max-w-6xl mx-auto items-center px-8 pb-16">
    <div class="flex flex-col mt-16 md:mt-48 items-center justify-end">
      <p class="text-3xl">Andrew Persic</p>
      <div>
        <p>Heya! </p>
        <p>Thanks for coming to hear about me! Please explore, and have fun!</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-[auto_minmax(0px,_1fr)] gap-4 w-fit">
      <HomeGrid title="For Recruiters">
        <ImageAndText class="w-64 bg-gray-950 text-slate-50 px-4 cursor-pointer" slim @click="goResume"
          :image="booksImage" size="2rem">
          <div class="flex justify-between items-center h-12">
            <span class="text-xl pl-1">Resume</span>
            <a href="/andrew_persic_resume.pdf" download @click.stop class="plain">
              <Button variant="text" class="ml-2 py-2 text-sm">
                <Icon name="download" class="mr-2 opacity-90 w-5" />
                <div>Save</div>
              </Button>
            </a>
          </div>
        </ImageAndText>

        <ImageAndText class="w-64 bg-gray-950 text-slate-50 px-4" @click="goTalents" style="cursor: pointer;"
          :image="starImage" size="2rem">
          <div class="w-full text-xl pl-1 pr-2">What I'm Good At</div>
        </ImageAndText>

        <ImageAndText class="w-64 bg-gray-950 text-slate-50 px-4" @click="goAccomplishments" style="cursor: pointer;"
          :image="hornImage" size="2rem">
          <div class="w-full text-xl pl-1 pr-2">What I've Done</div>
        </ImageAndText>
      </HomeGrid>

      <HomeGrid title="Blogs">
        <PreviewCard v-for="post in blogPosts.slice(0, 5)" :card="post" />
        <PreviewCard :card="{ title: 'More...', path: '/blog' }" class="max-md:!h-16" />
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

  <div class="fixed bottom-0 right-0 w-fit justify-end z-10 rhomboid bg-slate-800 text-white pr-2">
    <div class="flex items-center flex-row">
      <span class="mr-2">{{ EMAIL }}</span>
      <span class="ml-1 mr-2 border-l border-slate-400 h-4"></span>
      <a class="plain h-6 mr-1" target="_blank" href="https://www.github.com/persuck/">
        <img src="https://github.com/fluidicon.png" class="w-6" />
      </a>
      <span class="ml-1 mr-2 border-l border-slate-400 h-4"></span>
      <a class="plain h-6 ml-1" target="_blank" href="https://www.linkedin.com/in/andrew-persic/">
        <img :src="linkedInImage" class="h-[1.25rem] bg-white mt-0.5 rounded-sm" />
      </a>
    </div>
  </div>
</template>