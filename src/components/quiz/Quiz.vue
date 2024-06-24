<script setup lang="ts">
import { type QuizQuestion, isTextQuestion, isMultiChoiceQuestion, type MultiChoiceQuestion as MultiChoiceQuestionType } from "@/@types/quiz"
import Button from "@/components/Button.vue"
import MultiChoiceQuestion from '@/components/quiz/MultiChoiceQuestion.vue'
import TextQuestion from '@/components/quiz/TextQuestion.vue'
import Timer from '@/components/quiz/Timer.vue'
import { getArraySample } from "@/ts/utils"
import { ref, computed, reactive, type ComputedRef } from "vue"

const props = defineProps<{
  // TODO: support TextQuestion (make this type QuizQuestion)
  questions: MultiChoiceQuestionType[],
  subsetSize?: number,
  timeout?: number
}>()

const emit = defineEmits(['end'])

const currentQuestionIndex = ref(0)
const results: { answerIdx: number | null, correct: boolean }[] = reactive([])
const elapsedSeconds = ref(0)
const isViewingResult = ref(false)
const isQuizFinished = computed(() => (results.length === props.questions.length) && !isViewingResult.value)

const questions: ComputedRef<MultiChoiceQuestionType[]> = computed(() => (
  (props.subsetSize === undefined || props.subsetSize <= 0)
    ? props.questions
    : getArraySample(props.questions, props.subsetSize)
))

function loadNextQuestion(answerIdx: number | null) {
  if (isViewingResult.value) {
    return
  }
  isViewingResult.value = true

  const result = {
    answerIdx,
    correct: answerIdx === null ? false : (questions.value[currentQuestionIndex.value].answers[answerIdx].correct === true)
  }
  results.push(result)
}

function finishViewingResult() {
  if (!isViewingResult.value) {
    return
  }

  elapsedSeconds.value = 0
  isViewingResult.value = false

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value += 1
  }
}

function onEnd() {
  emit('end')
}

</script>

<template>
  <div :class="`p-2 flex flex-col ${isQuizFinished ? 'items-center' : ''}`">
    <div :class="`flex flex-col gap-y-2 items-center ${isQuizFinished ? '' : 'hidden'}`">
      <div class="text-6xl font-mont font-bold">
        Finished
      </div>
      <div class="text-3xl font-bold">
        Score: {{ results.reduce((acc, r) => acc + (r.correct ? 1 : 0), 0) }} / {{ results.length
        }}
      </div>
    </div>
    <div :class="isQuizFinished ? 'hidden' : ''">
      <template v-for="question, i of questions" :key="question.id">
        <div :class="{ hidden: i !== currentQuestionIndex }">
          <Timer v-if="timeout" v-model="elapsedSeconds" :duration="timeout" @end.stop="loadNextQuestion"
            :is-running="!isViewingResult" />
          <TextQuestion v-if="isTextQuestion(question)" :question="question" @answerPicked="loadNextQuestion" />
          <MultiChoiceQuestion v-else-if="isMultiChoiceQuestion(question)" :question="question"
            @answerPicked="loadNextQuestion" />
        </div>
      </template>
    </div>
    <div class="flex gap-2 mx-4 mt-4">
      <Button class="w-max" @click.stop="onEnd">{{ isQuizFinished ? 'Done' : 'Give Up' }}</Button>
      <Button class="w-max" :class="{ hidden: isQuizFinished }" :disabled="!isViewingResult"
        @click="finishViewingResult">Next</Button>
    </div>
  </div>
</template>