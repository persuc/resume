<script setup lang="ts">
import type { MatchupQuestion } from '@/@types/quiz'
import { shuffleArray } from '@/ts/utils'
import Button from '@/components/Button.vue'
import { computed, ref, type Ref } from 'vue'

// Note: Everything in this file is 1-indexed

const props = defineProps<{
  question: MatchupQuestion,
}>()

const selected_item: Ref<number | null> = ref(null)
const emit = defineEmits(['answer-submitted'])

const answers: Ref<number[]> = ref(new Array(props.question.answers.length + 1).fill(-1))
const hasSubmitted = ref(false)

const shuffledChoices = shuffleArray(new Array(props.question.answers.length).fill(null).map((_, i) => i + 1))
const numCorrect = computed(() => answers.value.slice(1).reduce((acc, val, i) => acc + ((i + 1) === val ? 1 : 0), 0))

const showSubmitConfim = ref(false)


function submitAnswers() {

  if (answers.value.slice(1).some(a => a === -1) && showSubmitConfim.value === false) {
    showSubmitConfim.value = true
    return
  }

  showSubmitConfim.value = false

  emit('answer-submitted', numCorrect.value / answers.value.length)
  hasSubmitted.value = true
}

function select(index: number) {
  if (selected_item.value === index) {
    selected_item.value = null
    return
  }

  if (selected_item.value === null || (index < 0) === (selected_item.value < 0)) {
    selected_item.value = index
    return
  }

  if (index < 0) {
    const existing = answers.value.indexOf(selected_item.value)
    if (existing !== -1) {
      answers.value[existing] = -1
    }
    answers.value[-index] = selected_item.value
  } else {
    const existing = answers.value.indexOf(index)
    if (existing !== -1) {
      answers.value[existing] = -1
    }
    answers.value[-selected_item.value] = index
  }
  selected_item.value = null
}

const answerClass = computed(() => {
  return answers.value.map((_, i) => {
    if (hasSubmitted.value === false) {
      return ''
    }

    return answers.value[i] === i ? 'bg-green-300 border-green-300' : 'bg-red-300 border-red-300'
  })
})
</script>
<template>
  <div v-if="showSubmitConfim"
    class="fixed top-0 left-0 h-full w-full bg-opacity-60 bg-black z-10 flex justify-center items-center">
    <div class="max-w-[40rem] p-8 bg-white rounded-lg m-8">
      <h1 class="text-xl font-mont font-bold select-none">Are you sure?</h1>
      <div>You haven't answered all questions yet, are you sure you want to submit?</div>
      <div class="flex gap-10 mt-8">
        <Button class="z-20 ml-3 mr-0" @click="submitAnswers">Yes</Button>
        <Button class="z-20 ml-0" @click="showSubmitConfim = false">No</Button>
      </div>
    </div>
  </div>
  <div class="mx-auto py-8 max-w-[40rem] relative">
    <h1 class="text-xl font-mont font-bold select-none">{{ props.question.body }}</h1>
    <div class="italic mb-8">Match the item on the left with its pair on the right. Click any item to select it, and
      then click on the corresponding pair. You will be able to change your answers until you click Submit.</div>
    <div class="flex mx-auto gap-x-2 w-fit">
      <div class="flex flex-col gap-y-2 max-w-[20rem]">
        <template v-for="left, i of props.question.answers">
          <div v-if="answers[i + 1] === -1" :class="[
            'p-1',
            'rounded',
            'border-2',
            'select-none',
            'cursor-pointer',
            answerClass[i + 1], (-i - 1) === selected_item ? 'border-black' : 'border-gray-300'
          ]" @click="select(-i - 1)">
            <span v-html="left[0]" class="select-none" />
          </div>
        </template>
      </div>
      <div class="flex flex-col gap-y-2 max-w-[20rem]">
        <div v-for="i of shuffledChoices.filter(c => !answers.includes(c))" :class="[
          'p-1',
          'rounded',
          'border-2',
          'select-none',
          'cursor-pointer',
          answerClass[i], i === selected_item ? 'border-black' : 'border-gray-300'
        ]" @click="select(i)">
          <span v-html="props.question.answers[i - 1][1]" class="select-none" />
        </div>
      </div>
    </div>

    <h1 v-show="answers.slice(1).some(a => a !== -1)" class="pt-16 pb-2 text-xl font-mont font-bold select-none">Your
      answers
    </h1>

    <template v-for="left, i of props.question.answers">
      <div v-if="answers[i + 1] !== -1" class="flex items-center mx-auto mb-1 gap-x-2 w-fit">
        <div :class="[
          'p-1',
          'max-w-[20rem]',
          'rounded',
          'border-2',
          'select-none',
          'cursor-pointer',
          (-i - 1) === selected_item ? 'border-black' : 'border-gray-300',
          answerClass[i + 1],
        ]" @click="select(-i - 1)" v-html="left[0]" />
        <div :class="[
          'p-1',
          'max-w-[20rem]',
          'rounded',
          'border-2',
          'select-none',
          'cursor-pointer',
          answers[i + 1] === selected_item ? 'border-black' : 'border-gray-300',
          answerClass[answers[i + 1]]
        ]" @click="select(answers[i + 1])" v-html="props.question.answers[answers[i + 1] - 1][1]" />
      </div>
    </template>

    <h1 v-show="hasSubmitted" class="pt-16 pb-2 text-xl font-mont font-bold select-none">Score for this question
    </h1>
    <div v-if="hasSubmitted" class="flex justify-center text-xl font-mont">
      {{ numCorrect }} / {{ answers.length }}
    </div>

    <div :class="['flex', 'p-4 pb-32', hasSubmitted ? 'justify-end' : 'justify-between']">
      <Button v-show="!hasSubmitted" @click="submitAnswers">Confirm</Button>
      <slot></slot>
    </div>

  </div>
</template>