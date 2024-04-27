<script setup lang="ts">
import ProgressLinear from '@/components/ProgressLinear.vue'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number,
  duration: number,
  isRunning: boolean,
}>(), {
  modelValue: 0,
  isRunning: true,
})
const emit = defineEmits(['end', 'update:modelValue'])
const timerInterval: Ref<NodeJS.Timer | undefined> = ref(undefined)

onMounted(() => {
  timerInterval.value = setInterval(() => {
    if (!props.isRunning) return

    emit('update:modelValue', props.modelValue + 1)
    if (props.modelValue === props.duration) {
      clearInterval(timerInterval.value)
      emit('end')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timerInterval.value))
</script>

<template>
  <div class="px-8">
    <h1 class="font-mont font-light text-8xl text-white flex justify-center">
      <div class="inline-block p-20 leading-none rounded-full bg-black relative">
        <span class="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">{{ modelValue }}</span>
      </div>
    </h1>
    <div class="mt-8">
      <h1 class="font-mont font-bold text-4xl text-center capitalize" v-show="modelValue >= duration">
        time out !!!
      </h1>
      <ProgressLinear v-show="modelValue < duration" :value="modelValue" :max="duration" />
    </div>
  </div>
</template>