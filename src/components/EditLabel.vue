<script setup lang="ts">
import { ref, watch } from 'vue'
import Icon from './Icon.vue'


interface Props {
  value: string,
  isOpen: boolean
  class?: string
  hideEditIcon: boolean
  placeholder?: string
}
const props = withDefaults(defineProps<Props>(), {
  hideEditIcon: false
})

const emit = defineEmits<{
  (event: 'open'): void
  (event: 'close', value: string): void
}>()

const draft = ref(props.value)

watch(() => props.value, (value) => {
  draft.value = value
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) draft.value = props.value
})

</script>

<template>
  <div @click.stop v-show="props.isOpen" class="flex items-center gap-1 border border-1 rounded" :class="class">
    <input :value="draft" @input="draft = ($event.target as HTMLInputElement).value"
      @keyup.enter="emit('close', draft)" :placeholder="placeholder" class="px-2 outline-none flex-1 min-w-0" />
    <div @click.stop="emit('close', draft)">
      <Icon name="check" class="h-4 w-4"></Icon>
    </div>
  </div>
  <div v-show="!props.isOpen" class="flex items-center gap-1" :class="class">
    <div :class="{ 'text-gray-400': !value && placeholder }" class="truncate">
      {{ value || placeholder }}
    </div>
    <div v-show="!hideEditIcon" @click.stop="emit('open')">
      <Icon name="pencil" class="h-4 w-4"></Icon>
    </div>
  </div>
</template>
