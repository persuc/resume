<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import quizzes from '@/ts/quiz/quizzes'
import type { MultiChoiceQuestion as MultiChoiceQuestionType } from '@/@types/quiz'
import Button from '@/components/Button.vue'
import Quiz from '@/components/quiz/Quiz.vue'
import MultiChoiceQuestion from '@/components/quiz/MultiChoiceQuestion.vue'

const chosen = ref(-1)
const router = useRouter()
const whichQuiz: MultiChoiceQuestionType = {
  body: 'Choose your quiz',
  answers: quizzes.map((q, i) => ({
    answer: `${(i + 1).toString().padStart(3, '0')}: ${q.name}`
  }))
}

function onChooseQuiz(answerIdx: number) {
  chosen.value = answerIdx
}

function endQuiz() {
  chosen.value = -1
}

</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center p-8 overflow-y-scroll">
    <div v-if="chosen < 0">
      <MultiChoiceQuestion :question="whichQuiz"
        @answer-submitted="multichoiceResult => onChooseQuiz(multichoiceResult.index)" />
      <Button class="mx-4 w-max mt-2" @click="() => router.push('/')">Back</Button>
    </div>
    <Quiz v-else :questions="quizzes[chosen].questions" @end="endQuiz" />
  </div>
</template>