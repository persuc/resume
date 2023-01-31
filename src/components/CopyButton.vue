<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import { reactive } from 'vue'

interface Props {
  value: string,
}

defineProps<Props>();

const { toClipboard } = useClipboard()

const copyRegister: Record<string, number> = {}

const showCopied = reactive({} as Record<string, boolean>)

async function copy(text: string) {
  await toClipboard(text)
  copyRegister[text] = new Date().getTime() + 2000
  showCopied[text] = true
  setTimeout(() => {
    if (copyRegister[text] < new Date().getTime() + 20) {
      showCopied[text] = false
    }
  }, 2000)
}

</script>

<template>
  <p class="mb-0" @click="copy(value)" style="cursor: pointer;"><slot></slot>
    <span style="position: relative;">📄
      <span style="position: absolute; top: .12em; left: 0.2em; z-index: -1;">📄</span>
    </span>
    <span :style="`transition: opacity 0.2s; opacity: ${showCopied[value] ? '1' : '0'}`" class="green">Copied!</span>
  </p>
</template>

<style scoped>
</style>
