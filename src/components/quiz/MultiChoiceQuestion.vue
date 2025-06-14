<script setup lang="ts">
import type { MultiChoiceQuestion } from '@/@types/quiz'
import { computed, ref } from 'vue'

const props = defineProps<{
  question: MultiChoiceQuestion,
}>()

const picked = ref(-1)
const emit = defineEmits(['answer-submitted'])

function answerSubmitted(answerIdx: number) {
  if (picked.value >= 0) {
    // already made their selection
    return
  }

  picked.value = answerIdx
  const correct = props.question.answers[answerIdx].correct === true
  emit('answer-submitted', { index: answerIdx, correctRatio: correct ? 1 : 0 })
}

const answerClass = computed(() => {
  return props.question.answers.map((_, i) => {
    if (picked.value < 0) {
      return ''
    }

    if (props.question.answers[picked.value].correct) {
      return picked.value === i ? 'bg-green-300' : ''
    }

    if (picked.value === i) {
      return 'bg-red-300'
    }

    if (props.question.answers[i].correct) {
      return 'bg-green-300'
    }

    return ''
  })
})

</script>
<template>
  <div class="p-4">
    <div class="w-full mx-auto">
      <h1 class="text-xl font-mont font-bold select-none" v-html="props.question.body" />
      <div class="flex max-w-[40rem] max-h-[40rem] mt-4" v-if="props.question.image">
        <img :src="props.question.image" />
      </div>
      <div v-show="picked >= 0 && !!props.question.revealedBody" class="flex items-start">
        {{ props.question.revealedBody }}
      </div>
      <ul class="mt-8">
        <li v-for="answer, answerIdx of props.question.answers" @click="answerSubmitted(answerIdx)"
          :class="`text-xl font-ssp mt-4 p-2 cursor-pointer border-2 border-transparent hover:border-black ${answerClass[answerIdx]}`">
          <span v-html="picked >= 0 ? answer.revealedAnswer ?? answer.answer : answer.answer" class="select-none" />
        </li>
      </ul>
    </div>
  </div>
</template>