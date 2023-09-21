<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue'

interface Props {
  title: string,
  postTitle?: string,
  link: string,
  description?: string,
  category: string,
  image?: string,
  svg?: string
}

const props = defineProps<Props>()

const svgImage = props.svg ? defineAsyncComponent(() =>
  import(`../assets/${props.svg}.svg`)
) : null

</script>

<template>
  <div class="flex mb-2">
    <div class="flex-1 mr-4">
      <div>
        <component v-if="svg" :is="svgImage" class="inline mr-2 h-8" />
        <img v-if="image" :src="image" class="inline mr-2 h-8" />
        <a class="font-mono" target="_blank" :href="link">{{ title }}</a>
        <span class="font-mono" v-html="postTitle" />
        
        <div class="font-mono sm:hidden my-1">
          
          <span class="rounded-full bg-gray-100 px-2 py-0.5">
            {{ category }}
          </span>
        </div>
        <div v-if="description" v-html="description"></div>
        <slot></slot>
      </div>
    </div>
    <div class="w-64 font-mono hidden sm:inline">
      <span class="rounded-full bg-gray-100 px-2 py-0.5">
        {{ category }}
      </span>
    </div>
  </div>
</template>

