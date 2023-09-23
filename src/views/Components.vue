<script setup lang="ts">

import Component from '@/components/Component.vue'
import Button from '@/components/Button.vue'
import Codeblock from '@/components/Codeblock.vue'
import CopyButton from '@/components/CopyButton.vue'
import Expand from '@/components/Expand.vue'
import Header from '@/components/Header.vue'
import Icon from '@/components/Icon.vue'
import ImageAndText from '@/components/ImageAndText.vue'
import JobTitle from '@/components/JobTitle.vue'
import Note from '@/components/Note.vue'
import Panel from '@/components/Panel.vue'
import Quote from '@/components/Quote.vue'
import TrafficLight from '@/components/TrafficLight.vue'
import StudyItem from '@/components/StudyItem.vue'

import faceImage from '@/assets/face.png'

const components = [
Button,
[Codeblock, {
  label: 'hello.js',
  language: 'javascript',
  code: 'function hello() {}'
}, ''],
[CopyButton, { value: 'the string to copy' }],
[Expand, {
  label: 'collapsed',
  expandedLabel: 'expanded',
}],
Header,
[Icon, { name: 'download' }, 'h-12'],
[ImageAndText, {
  image: faceImage,
  rounded: true,
}, ''],
[JobTitle, {
  company: "Canva",
  role: "Senior Software Engineer (Full Stack)",
  dateFrom: "2022",
  dateTo: "Current",
  tech: [ 'TypeScript', 'React', 'Java', 'Terraform', 'AWS', 'GraphQL', 'Protobuf', 'PostgreSQL', 'DynamoDB' ],
}, ''],
Note,
Panel,
[Quote, {
  quotation: 'He does not need wings to fly',
  author: 'DJ Bennie'
}],
TrafficLight,
[StudyItem,     {
  link: "https://flexboxfroggy.com/",
  title: "Flexbox Froggy",
  svg: "flexbox-froggy",
  description: "Game for learning how to make website layouts with CSS flexbox",
  category: "UI / webpage layout",
},],
]

console.log(Note)

</script>

<template>

  <Header back-route="/" />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">

    <p class="text-xl">Components Library</p>

    <Component
      v-for="component in components"
      :component="Array.isArray(component) ? component[0] : component"
      :defaults="Array.isArray(component) ? component[1] : {}"
      class="mb-4"
      :classes="Array.isArray(component) ? component[2] : ''"
    >Slot</Component>

    <div class="my-16 py-16"></div>
    
  </article>
</template>
