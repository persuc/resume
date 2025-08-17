<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Icon from './Icon.vue'


interface Props {
  value: string,
  isOpen: boolean
  class?: string
  hideEditIcon: boolean
}
const props = withDefaults(defineProps<Props>(), {
  hideEditIcon: false
})

const emit = defineEmits<{
  (event: 'open'): void
  (event: 'close', value: string): void
}>()

</script>

<template>
  <div @click.stop v-show="props.isOpen" class="flex items-center gap-1 border border-1 rounded" :class="class">
    <input :value="value" class="px-2 outline-none" style="width: inherit" />
    <div @click.stop="emit('close', props.value)">
      <Icon name="check" class="h-4 w-4"></Icon>
    </div>
  </div>
  <div v-show="!props.isOpen" class="flex items-center gap-1" :class="class">
    <div>
      {{ value }}
    </div>
    <div v-show="!hideEditIcon" @click.stop="emit('open')">
      <Icon name="pencil" class="h-4 w-4"></Icon>
    </div>
  </div>
</template>