<template>
  <div class="h-8 overflow-hidden relative">
    <TransitionGroup tag="div" class="absolute inset-x-0 flex flex-col"
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-500 ease-out absolute w-full"
      enter-from-class="opacity-0 translate-y-full" leave-to-class="opacity-0 -translate-y-full">
      <div v-for="(msg, index) in messages" :key="`${index}-${updateKey}`"
        class="h-8 leading-8 whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0">
        {{ msg }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  message: string
}

const props = defineProps<Props>()

const previousMessage = ref('')
const updateKey = ref(0)

const messages = computed(() => [previousMessage.value, props.message])

watch(() => props.message, (newMessage, oldMessage) => {
  if (newMessage !== oldMessage) {
    updateMessages()
  }
})

function updateMessages() {
  previousMessage.value = props.message
  updateKey.value++
}

function forceUpdate() {
  updateMessages()
}

defineExpose({ forceUpdate })
</script>