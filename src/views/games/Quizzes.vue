<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import quizzes from '@/ts/quiz/quizzes'
import { getQuizId, type MultiChoiceQuestion as MultiChoiceQuestionType } from '@/@types/quiz'
import Button from '@/components/Button.vue'
import Quiz from '@/components/quiz/Quiz.vue'
import MultiChoiceQuestion from '@/components/quiz/MultiChoiceQuestion.vue'

const router = useRouter()
const route = useRoute()

function setUnsetQuizFromId(id: string | string[]) {
  if (id) {
    const quizIdx = quizzes.findIndex(q => getQuizId(q) === id)
    if (quizIdx >= 0) {
      chosen.value = quizIdx
    } else {
      router.push('/quiz')
    }
  } else {
    chosen.value = -1
  }
}

watch(
  () => route.params.id,
  (newId, oldId) => {
    setUnsetQuizFromId(newId)
  }
)

onMounted(() => {
  setUnsetQuizFromId(route.params.id)
})

const chosen = ref(-1)
const whichQuiz: MultiChoiceQuestionType = {
  body: 'Choose your quiz',
  answers: quizzes.map((q, i) => ({
    answer: `${(i + 1).toString().padStart(3, '0')}: ${q.name}`
  }))
}

function onChooseQuiz(answerIdx: number) {
  chosen.value = answerIdx
  router.push(`/quiz/${getQuizId(quizzes[answerIdx])}`)
}

function endQuiz() {
  chosen.value = -1
  router.push('/quiz')
}

</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center p-8 overflow-y-scroll">
    <div v-if="chosen < 0" class="h-full justify-center flex flex-col pb-4">
      <MultiChoiceQuestion :question="whichQuiz"
        @answer-submitted="multichoiceResult => onChooseQuiz(multichoiceResult.index)" />
      <Button class="mx-4 w-max mt-2" @click="() => router.push('/')">Back</Button>
    </div>
    <Quiz v-else :questions="quizzes[chosen].questions" @end="endQuiz" />
  </div>
</template>