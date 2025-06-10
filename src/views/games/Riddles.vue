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
    hints: ['I am an object you can see and touch', 'I am commonly found outside', 'Hummingbirds like me'],
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
    hints: ['I am an object you can see and touch', 'I am commonly found inside', 'I am commonly found in churches'],
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
  {
    title: 'A ruffian four',
    body: [
      "Look within, look with out",
      "Who brings news, from my high redoubt",
      "At the fringes aft and fore",
      "You will find a ruffian four",
    ],
    answers: ['lout'],
    hints: ['This riddle wouldn\'t work in a different language', 'Look at the words and letters in the riddle', 'The first two lines make a word, the second two transform it'],
  },
  {
    title: 'A feared behemoth',
    body: [
      "Steer ye full headward",
      "Yester long gone",
      "Where is he, boatman?",
      "I answer, a behemoth",
    ],
    answers: ['dreadful whale'],
    hints: ['This riddle wouldn\'t work in a different language', 'Look at the words and letters in the riddle', 'The first two lines make two words, the last two are clues'],
  },
  {
    title: 'Light: I',
    body: [
      "I came before lamplight",
      "I came before firelight",
      "Yet both come before me",
      "I'm not first",
      "And I'm even after last",
      "Whatever could I be?",
    ],
    answers: ['sunlight', 'moonlight'],
    hints: ['This riddle wouldn\'t work in a different language', 'I\'m something ancient', 'Fire came before lamps, and fire comes before lamp'],
  },
  {
    title: 'Light: II',
    body: [
      "You see me when you turn to me",
      "And my reflection when you turn away",
      "If you saw me last night",
      "Then you'll miss me in the day",
      "What am I?",
    ],
    answers: ['the sun', 'sun', 'sunlight', 'moonlight'],
    hints: ['You\'ll turn toward me and away again', 'Unless you travel far and forever', 'Or so far as outer space'],
  },
  {
    title: 'Light: III',
    body: [
      "I'm born in darkness",
      "For light will surely destroy me",
      "But fully matured, I bathe in brilliant rays",
      "And it is those who observe that are swathed in dark",
      "What am I?",
    ],
    answers: ['film', 'camera film', 'roll of film', 'a rolle of film', 'film roll', 'camera roll'],
    hints: ['I don\'t cost much', 'But my price is rising', 'Perhaps I\'m not needed any more'],
  },
  {
    title: 'Fatal to the touch',
    body: [
      "First I swim",
      "And then I fly",
      "I'm softer than silk",
      "But if we meet you'll die",
      "What am I?",
    ],
    answers: ['a cloud', 'cloud', 'clouds', 'raincloud'],
    hints: ['I don\'t live as long as you', 'After flying I might swim again', 'I\'ll be there when you\'re sad'],
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
        <TextQuestion :question="riddle" @answer-submitted="onSolve" :hide-body="true" :whimsical="true"
          :denials="['Not quite', 'No, try again', 'Ponder a little longer', 'The answer remains elusive', 'Something else perhaps', 'No, but keep trying']"
          class="w-full" />
      </div>
    </div>


    <div class="py-16"></div>
  </div>
</template>