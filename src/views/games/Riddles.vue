<script setup lang="ts">
import type { TextQuestion as TextQuestionType } from '@/@types/quiz'
import TextQuestion from '@/components/quiz/TextQuestion.vue'
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'
import { onMounted, reactive, ref, type Ref } from 'vue'
import SlideReveal from '@/components/SlideReveal.vue'

type Riddle = (TextQuestionType & { title: string })

const riddles: Riddle[] = [
  {
    title: 'That which seeps',
    body: ['Life I give and life I take', 'Covet me hastily, and sink within to never wake', 'Covet me patiently and you\'ll never be alone', 'At first I seep and then I\'m stone'],
    answers: ['amber', 'sap', 'tree sap', 'treesap', 'tree resin', 'resinite', 'ambrite'],
    hints: ['I am an object you can see and touch', 'I am found commonly outside', 'Hummingbirds like me'],
    nearMisses: {
      'cement': 'Never alone with cement?'
    }
  },
  {
    title: 'That which holds',
    body: [
      "I have limbs but I have no leaves",
      "I'm a pretty prize for lurking thieves",
      "Many I hold, but never embrace",
      "You'll often find me in a dark place",
    ],
    answers: ['candelabra', 'menorah', 'candelabras', 'menorahs', 'a candelabra', 'a menorah'],
    hints: ['I am an object you can see and touch', 'I am found commonly inside', 'I am commonly found in churches'],
  },
  {
    title: 'That which bites',
    body: [
      "Though I always take, and never give back",
      "Those who use me, for warmth shall not lack",
      "Though I have a cold and killing bite",
      "You'll find I'm quite pleasant if you use me right",
      "Those I nip might fuss and fret",
      "But they just don't know my good side yet",
    ],
    answers: ['shears', 'sheep shears', 'clippers', 'sheep clippers', 'blade shears', 'fleecing scissors', 'shearing scissors', 'wool shears', 'wool scissors'],
    hints: ['I am an object you can see and touch', 'I have special significance for Aussies', 'I am commonly found on farms'],
  },
]

const riddle: Ref<Riddle | null> = ref(null)
const isSolved = ref(false)
const solution = ref('')
const solvedRiddles: Set<string> = reactive(new Set<string>())
const STATE_KEY = 'RiddlesState'

onMounted(() => {
  const serializedState = localStorage.getItem(STATE_KEY)
  if (serializedState === null) {
    return
  }
  for (let s of serializedState.split(';')) {
    solvedRiddles.add(s)
  }
})

function chooseRiddle(choice: Riddle) {
  isSolved.value = isRiddleSolved(choice)
  solution.value = ''
  riddle.value = choice
}

function onSolve(guess: string) {
  isSolved.value = true
  solution.value = guess
  if (riddle.value) {
    solvedRiddles.add(riddle.value.title + "|" + riddle.value.answers[0])
    localStorage.setItem(STATE_KEY, [...solvedRiddles.values()].join(';'))
  }
}

function isRiddleSolved(riddle: Riddle) {
  return [...solvedRiddles.values()].some(s => {
    const [title, answer] = s.split('|')
    return title === riddle.title && riddle.answers.includes(answer)
  })
}

function onBack() {
  if (riddle.value) {
    riddle.value = null
    return true
  }
  return false
}

</script>

<template>
  <BackButton :handler="onBack" />
  <div class="flex flex-col gap-y-8 max-w-6xl mx-auto items-center px-8 pb-16">
    <div class="flex flex-col mt-16 md:mt-48 items-center justify-end">
      <p class="text-3xl">
        {{ riddle === null ? 'Riddles' : riddle.title }}
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3 grid-cols-2" v-show="riddle === null">
      <div v-for="riddle in riddles" :key="riddle.title" @click="chooseRiddle(riddle)"
        class="w-32 h-32 text-center border border-slate-300 hover:border-slate-500 rounded-md flex items-center p-4 cursor-pointer">
        <div class="absolute top-1 right-1 h-5 w-5" v-show="isRiddleSolved(riddle)">
          *
        </div>
        {{ riddle.title }}
      </div>
    </div>

    <div v-if="riddle !== null">
      <p v-for="line in riddle.body">
        {{ line }}
      </p>

      <div class="pb-8"></div>

      <!-- <Expand v-if="!solution && isSolved" class="my-8" label="Reveal answer" expanded-label="Hide answer">
        {{ riddle.answers[0] }}
      </Expand> -->
      <div v-for="(hint, i) in riddle.hints ?? []" :key="hint" class="flex justify-start items-start mb-2">
        <div>Hint #{{ i + 1 }}:</div>
        <SlideReveal>
          {{ hint }}
        </SlideReveal>
      </div>

      <p v-show="solution" class="text-lg my-8">{{ solution }}...&nbsp;&nbsp;&nbsp;a wise answer.</p>

      <Button v-show="solution" @click="onBack" class="mx-auto">Return</Button>

      <div v-show="!solution" class="flex gap-4 items-center mt-8">
        <TextQuestion :question="riddle" @solved="onSolve" :hide-body="true" :whimsical="true"
          :denials="['Not quite', 'No, try again', 'Ponder a little longer', 'The answer remains elusive', 'Something else perhaps', 'No, but keep trying']"
          class="w-full" />
      </div>
    </div>


    <div class="py-16"></div>
  </div>
</template>