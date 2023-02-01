<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface Props {
  label: string,
  expandedLabel?: string,
}

defineProps<Props>();

let expanded = ref(false)

const COLLAPSED_HEIGHT = '0px';
let height = COLLAPSED_HEIGHT;

const expandSlot: Ref<HTMLElement> = ref(null) as unknown as Ref<HTMLElement>

onMounted(() => {
  expandSlot.value.style.height = COLLAPSED_HEIGHT;
  window.addEventListener('resize', onResize)
  onResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() {
  height = expandSlot.value.scrollHeight + 'px';
}

function toggle() {
  if (expanded.value) {
    expandSlot.value.style.height = COLLAPSED_HEIGHT;
  } else {
    expandSlot.value.style.height = height;
  }
  expanded.value = !expanded.value;
}

</script>

<template>
  <div @click="toggle" class="expand border pa-2">
    <div>
      <div :class="{ arrow: true, rotate: expanded}">▶&nbsp;</div>
      <div class="label" :style="expandedLabel && expanded ? 'display: none;' : ''">{{ label }}</div>
      <div class="label" :style="expandedLabel && expanded ? '' : 'display: none;'">{{ expandedLabel }}</div>
    </div>

    <div class="expand-slot" ref="expandSlot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.arrow {
  display: inline-block;
  transition: transform 0.2s;
  /* transform-origin: center; */
  transform-origin: 34% 52%;
  &.rotate {
    transform: rotate(90deg);
  }
}

.label {
  display: inline;
}

.expand-slot {
  transition: height 0.2s ease-out;
  overflow: hidden;
}
</style>
