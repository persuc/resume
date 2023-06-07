<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import { reactive } from 'vue'
import Icon from '@/components/Icon.vue'

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
  <div class="copy" @click="copy(value)" style="cursor: pointer;">
    <slot></slot>
    <Icon class="no-print" style="position: relative;" name="copy"></Icon>

    <span :style="`transition: opacity 0.2s; opacity: ${showCopied[value] ? '1' : '0'}`" class="green copy-confirmation">Copied!</span>
  </div>
</template>

<style scoped lang="postcss">
.copy {
  display: inline-flex;
  & .copy-confirmation {
    position: absolute;
    left: 100%;
  }
}
</style>
