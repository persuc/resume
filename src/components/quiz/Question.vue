<script setup lang="ts">
import type { QuizQuestion } from '@/@types/quiz'
import { computed, ref } from 'vue'

const props = defineProps<{
  question: QuizQuestion,
}>()

const picked = ref(-1)
const emit = defineEmits(['answer-picked'])

function answerPicked(answerIdx: number) {
  picked.value = answerIdx
  emit('answer-picked', answerIdx)
}

const answerClass = computed(() => {
  return props.question.answers.map((_, i) => {
    if (picked.value < 0) {
      return ''
    }

    if (props.question.correctIndices.includes(picked.value)) {
      return picked.value === i ? 'bg-green-300' : ''
    }

    if (picked.value === i) {
      return 'bg-red-300'
    }

    if (props.question.correctIndices.includes(i)) {
      return 'bg-green-300'
    }

    return ''
  })
})

</script>
<template>
  <div class="capitalize p-4">
    <div class="content-box w-full mx-auto">
      <h1 class="text-xl font-mont font-bold">{{ props.question.body }}</h1>
      <ul class="mt-8">
        <li v-for="answer, answerIdx of props.question.answers"
          :class="`text-xl font-ssp mt-4 p-2 cursor-pointer border-2 border-transparent hover:border-black ${answerClass[answerIdx]}`">
          <span @click="answerPicked(answerIdx)" v-html="answer" />
        </li>
      </ul>
    </div>
  </div>
</template>