<script setup lang="ts">
import type { NavItems as TNavItems } from '@/@types'
import NavItems from '@/components/NavItems.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { computed, ref } from 'vue'

interface Props {
  items: TNavItems[]
}

const isVisible = ref(false)

const showJumpToTop = computed(() => {
  return window.scrollY > 10
})

defineProps<Props>();

</script>

<template>
  <div id="nav" :class="`flex w-full lg:w-64 shrink-0 ${$attrs.class} ${isVisible ? '' : 'hidden lg:flex'}`">
    <NavItems :items="items"
      :class="`!flex-col gap-4 fixed lg:w-64 w-full h-screen p-8 lg:p-4 !pb-32 mt-8 lg:mt-0 lg:border-r border-gray-200 text-xl lg:text-base z-20 bg-white overflow-y-scroll`" />
  </div>
  <Button text @click="isVisible = !isVisible"
    :class="`fixed w-screen lg:hidden bg-white hover:bg-white border-gray-200 border-b z-20 !p-2 !rounded-none`">
    <Icon :name="isVisible ? 'close' : 'hamburger'" :preload="['close', 'hamburger']" class="w-8"></Icon>
  </Button>
  <a v-show="showJumpToTop"
    class="fixed lg:hidden bg-white rounded-full p-2 left-2 bottom-2 border-gray-200 border z-10 cursor-pointer"
    href="#nav">
    <Icon name="chevron-left" class="rotate-90 w-8 mb-0.5" />
  </a>
</template>
