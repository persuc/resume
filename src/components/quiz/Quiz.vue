<script setup lang="ts">
import type { QuizQuestion, QuizQuestionData } from "@/@types/quiz"
import Question from '@/components/quiz/Question.vue'
import Timer from '@/components/quiz/Timer.vue'
import { getArraySample } from "@/ts/utils"
import { ref, computed, reactive, type ComputedRef } from "vue"

const props = defineProps<{
  questions: QuizQuestionData[],
  subsetSize?: number,
  timeout?: number
}>()

const currentQuestionIndex = ref(0)
const quizFinished = ref(false)
const results: { answerIdx: number | null, correct: boolean }[] = reactive([])
const score = ref(0)
const elapsedSeconds = ref(0)

const questions: ComputedRef<QuizQuestion[]> = computed(() => (
  (props.subsetSize === undefined || props.subsetSize <= 0)
    ? props.questions
    : getArraySample(props.questions, props.subsetSize)
)
  .map(q => ({
    ...q,
    correctIndices: q.correctIndices ?? [0]
  }))
)

function isCorrectAnswer(question: QuizQuestion, answerIdx: number | null) {
  if (answerIdx === null) {
    return false
  }
  return (question.correctIndices ?? [0]).includes(answerIdx)
}

function restartQuiz() {
  currentQuestionIndex.value = 0
  quizFinished.value = false
  results.splice(0)
  score.value = 0
}

function loadNextQuestion(answerIdx: number | null) {
  const isCorrect = isCorrectAnswer(questions.value[currentQuestionIndex.value], answerIdx)
  if (isCorrect) {
    score.value += 1
  }
  results.push({
    answerIdx,
    correct: isCorrect
  })

  if (currentQuestionIndex.value === questions.value.length) {
    quizFinished.value = true
    return
  }
  currentQuestionIndex.value += 1
  elapsedSeconds.value = 0
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="quizFinished" class="p-2 flex flex-col items-center">
      <h1 class="text-6xl font-mont font-bold capitalize">
        <span>finished</span>
      </h1>
      <h2 class="text-3xl font-ssp font-bold capitalize mt-2">
        <span class="px-2">score: {{ score }} / 5</span>
      </h2>
      <div class="mt-4 px-2">
        <ul>
          <li class="mt-8" v-for="result, i in results">
            <h1 class="text-4xl font-mont font-bold">{{ questions[i].body }}</h1>
            <div class="text-2xl font-ssp capitalize mt-4">
              <div class="feedback flex items-center">
                <span>{{ result.answerIdx === null ? 'no answer' : questions[i].answers[result.answerIdx] }}</span>
                <span
                  class="px-3.5 py-3 m-2 bg-black text-white rounded-full flex justify-center items-center max-w-[3rem]"><i
                    :class="['pi', result.correct ? 'pi-check' : 'pi-times']"></i></span>
              </div>
              <div v-if="!result.correct">
                <span class="font-bold">right answer{{
                  questions[i].correctIndices.length > 1 ? 's' : ''
                }} {{ questions[i].correctIndices.length > 1 ? 'are' : 'is' }}
                </span>
                <span v-for="answerIdx in questions[i].correctIndices" class="font-regular">
                  {{ questions[i].answers[answerIdx] }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="mt-4">
        <button class="text-4xl font-ssp font-bold bg-black text-white capitalize px-4 py-2" @click="restartQuiz">
          restart quiz
        </button>
      </div>
    </div>
    <div v-else id="question-box" class="relative overflow-hidden">
      <template v-for="question of questions" :key="question.id">
        <transition name="fade" mode="out-in">
          <div>
            <Timer v-if="timeout" v-model="elapsedSeconds" :duration="timeout" @onEnd="loadNextQuestion" />
            <Question :question="question" @answerPicked="loadNextQuestion" />
          </div>
        </transition>
      </template>
    </div>
  </transition>
</template>