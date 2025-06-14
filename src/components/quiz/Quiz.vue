<script setup lang="ts">
import { isTextQuestion, isMultiChoiceQuestion, type MultiChoiceQuestion as MultiChoiceQuestionType, type MatchupQuestion as MatchupQuestionType, isMatchupQuestion } from "@/@types/quiz"
import Button from "@/components/Button.vue"
import MatchupQuestion from "@/components/quiz/MatchupQuestion.vue"
import MultiChoiceQuestion from '@/components/quiz/MultiChoiceQuestion.vue'
import TextQuestion from '@/components/quiz/TextQuestion.vue'
import Timer from '@/components/quiz/Timer.vue'
import { getArraySample } from "@/ts/utils"
import { ref, computed, reactive, type ComputedRef, nextTick } from "vue"
import BackButton from "../BackButton.vue"

type SupportedQuestion = MultiChoiceQuestionType | MatchupQuestionType

const props = defineProps<{
  // TODO: support TextQuestion (make this type QuizQuestion)
  questions: SupportedQuestion[],
  subsetSize?: number,
  timeout?: number
}>()

const emit = defineEmits(['end'])

const currentQuestionIndex = ref(0)
const currentQuestion: ComputedRef<SupportedQuestion | null> = computed(() => currentQuestionIndex.value < questions.value.length ? props.questions[currentQuestionIndex.value] : null)
const results: { answerIdx: number | null, correctRatio: number, numSubquestions: number }[] = reactive([])
const elapsedSeconds = ref(0)
const isViewingResult = ref(false)
const isQuizFinished = computed(() => (results.length === props.questions.length) && !isViewingResult.value)

const questions: ComputedRef<SupportedQuestion[]> = computed(() => (
  (props.subsetSize === undefined || props.subsetSize <= 0)
    ? props.questions
    : getArraySample(props.questions, props.subsetSize)
))

function answerAndViewResult(correctRatio: number) {
  if (isViewingResult.value) {
    return
  }
  isViewingResult.value = true

  results.push({
    answerIdx: currentQuestionIndex.value,
    numSubquestions: (Array.isArray(currentQuestion.value!.answers[0])
      ? currentQuestion.value!.answers.length
      : 1
    ),
    correctRatio,
  })
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

  // this is a weird little hack to basically reset the data in the child component
  // otherwise state from the previous question carries over
  const nextIdx = currentQuestionIndex.value
  currentQuestionIndex.value = questions.value.length
  nextTick(() => {
    currentQuestionIndex.value = nextIdx
  })
}

function onEnd() {
  emit('end')
}

</script>

<template>
  <BackButton href="/" />
  <div :class="`p-4 py-12 max-h-screen flex flex-col ${isQuizFinished ? 'items-center' : ''}`">
    <div :class="`flex flex-col gap-y-2 items-center ${isQuizFinished ? '' : 'hidden'}`">
      <div class="text-6xl font-mont font-bold">
        Finished
      </div>
      <div class="text-3xl font-bold">
        Score: {{(results.reduce((acc, r) => acc + r.correctRatio, 0) / results.length * 100).toFixed(1)}}%
      </div>
    </div>
    <template v-if="currentQuestion && !isQuizFinished">
      <Timer v-if="timeout" v-model="elapsedSeconds" :duration="timeout" @end.stop="answerAndViewResult"
        :is-running="!isViewingResult" />
      <TextQuestion v-if="isTextQuestion(currentQuestion)" :question="currentQuestion"
        @answer-submitted="answerAndViewResult" />
      <MultiChoiceQuestion v-else-if="isMultiChoiceQuestion(currentQuestion)" :question="currentQuestion"
        @answer-submitted="(multiChoiceResult) => answerAndViewResult(multiChoiceResult.correctRatio)" />
      <MatchupQuestion v-else-if="isMatchupQuestion(currentQuestion)" :question="currentQuestion"
        @answer-submitted="answerAndViewResult">
        <Button class="w-max" :disabled="!isViewingResult" @click="finishViewingResult">Next</Button>
      </MatchupQuestion>
    </template>
    <div class="flex gap-2 mx-4 mt-4 pb-16">
      <Button v-show="!isQuizFinished" class="w-max" :disabled="!isViewingResult"
        @click="finishViewingResult">Next</Button>
      <Button v-show="isQuizFinished" class="w-max" @click.stop="onEnd">{{ 'Done' }}</Button>
    </div>
  </div>
</template>