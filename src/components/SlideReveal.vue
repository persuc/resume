<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'

const isRevealed = ref(false)

const toggleReveal = () => {
  isRevealed.value = !isRevealed.value
}
</script>

<template>
  <div class="relative overflow-hidden w-fit px-[1rem]">
    <div class="w-fit">
      <slot></slot>
    </div>
    <div class="absolute inset-0 transition-transform duration-300 ease-in-out"
      :class="[isRevealed ? 'translate-x-[110%]' : '-translate-x-[0.5rem]']" @click="toggleReveal">
      <Button class="h-full" style="width: calc(100% - 2rem)">
        <div class="w-full text-center">{{ isRevealed ? 'Hide' : 'Reveal' }}</div>
      </Button>
    </div>
  </div>
</template>