<script setup lang="ts">
import { onMounted, onUpdated, ref, type Ref } from "vue"
import * as MathLive from 'mathlive'
import '@/../node_modules/mathlive/dist/mathlive-fonts.css'

// https://cortexjs.io/mathlive/reference/commands/

interface Props {
  value: string,
  inline?: boolean,
}

const { value } = defineProps<Props>()

const staticmath = ref() as Ref<HTMLElement>

onMounted(() => {
  MathLive.renderMathInElement(staticmath.value)
})

// TODO: only used during development
onUpdated(() => {
  MathLive.renderMathInElement(staticmath.value)
})
</script>

<template>
  <div ref="staticmath" :class="{ 'flex justify-center text-xl my-4': inline !== true, 'inline-block': inline === true }">
    $${{ value }}$$
  </div>
</template>