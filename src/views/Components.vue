<script setup lang="ts">
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { ThemeConfig } from 'tailwindcss/types/config'

import type { NavItems } from '@/@types'
import faceImage from '@/assets/face.png'
import Article from '@/components/Article.vue'
import Story from '@/components/Story.vue'

type DefaultsType = Record<string, string | boolean | number>
const components: (string | [string, DefaultsType] | [string, DefaultsType, string])[] = [
  'Button',
  ['Codeblock', {
    label: 'hello.js',
    language: 'javascript',
    code: 'function hello() {}'
  }, ''],
  ['CopyButton', { value: 'the string to copy' }],
  ['Expand', {
    label: 'collapsed',
    expandedLabel: 'expanded',
  }],
  'Header',
  ['Icon', { name: 'download' }, 'h-12'],
  ['ImageAndText', {
    image: faceImage,
    rounded: true,
  }, ''],
  // ['JobTitle', {
  //   company: "Canva",
  //   role: "Senior Software Engineer (Full Stack)",
  //   dateFrom: "2022",
  //   dateTo: "Current",
  //   tech: [ 'TypeScript', 'React', 'Java', 'Terraform', 'AWS', 'GraphQL', 'Protobuf', 'PostgreSQL', 'DynamoDB' ],
  // }, ''],
  'Note',
  'Panel',
  'ProgressLinear',
  ['Quote', {
    quotation: 'He does not need wings to fly',
    author: 'VJ Emmie'
  }],
  'TrafficLight',
  ['StudyItem', {
    link: "https://flexboxfroggy.com/",
    title: "Flexbox Froggy",
    svg: "flexbox-froggy",
    description: "Game for learning how to make website layouts with CSS flexbox",
    category: "UI / webpage layout",
  },],
]

const fullConfig = resolveConfig(tailwindConfig)
const theme: ThemeConfig = fullConfig.theme! as ThemeConfig

const fonts = Object.entries(fullConfig.theme!.fontFamily as Record<string, string[]>).map(e => ({
  title: e[0],
  families: e[1],
}))

const colors = Object.entries(theme.colors).filter(e => !['inherit', 'current', 'transparent', 'black', 'white'].includes(e[0]))

const navItems: NavItems[] = [
  { href: "/", label: "Back", classes: "lg:mb-3" },
  {
    href: "#components",
    label: "Components Library",
    classes: 'mb-3',
    items: components.map(c => Array.isArray(c) ? c[0] : c).map(c => ({
      label: c,
      href: '#' + c,
    }))
  },
  {
    href: "#colors", label: "Colours", items: colors.map(c => ({
      label: c[0],
      href: '#' + c[0]
    }))
  },
  {
    href: "#fonts", label: "Fonts", items: fonts.map(f => ({
      label: f.title,
      href: '#' + f.title
    }))
  },
]


</script>

<template>
  <Article :items="navItems">
    <p class="text-2xl mt-12" id="components">Components Library</p>

    <Story v-for="component in components" :path="Array.isArray(component) ? component[0] : component"
      :defaults="Array.isArray(component) ? component[1] : {}" class="mb-4"
      :classes="Array.isArray(component) ? component[2] : ''" />

    <p class="text-2xl mt-12" id="colors">Colours</p>

    <div class="grid grid-cols-[repeat(auto-fit, minmax(8rem,1fr))] gap-x-2 gap-y-8 sm:grid-cols-1 p-4">
      <div class="2xl:contents" v-for="[key, color] in colors">
        <div :id="key" class="text-sm font-semibold text-slate-900 col-end-1 mt-5">
          {{ key }}
        </div>
        <div class="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2">
          <div v-for="[step, hex] in Object.entries(color)">
            <div class="h-12 w-12 rounded sm:w-full" :style="`background-color: ${hex}`">
            </div>
            <div class="px-0.5">
              <div class="w-6 font-medium text-xs text-slate-900 2xl:w-full dark:text-white">
                {{ step }}
              </div>
              <div
                class="text-slate-500 text-xs font-mono lowercase dark:text-slate-400 sm:text-[0.625rem] md:text-xs lg:text-[0.625rem] 2xl:text-xs">
                {{ hex }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="text-2xl mt-12 mb-4" id="fonts">Fonts</p>
    <div class="grid grid-cols-[1fr_minmax(0,_40rem)] gap-4 items-center">
      <template v-for="font in fonts" :id="font.title" class="mb-4 mx-4 p-2 rounded-lg border border-gray-200 max-w-xl">
        <div>
          <span class="capitalize text-md font-bold mr-2">{{ font.title }}</span>
          <br />
          <span class="text-md">( {{ font.families[0] }} )</span>
        </div>
        <div class="text-lg" :style="`font-family: ${font.families}`">Sphinx of black
          quartz,
          judge my vow.</div>
      </template>
    </div>
  </Article>
</template>
