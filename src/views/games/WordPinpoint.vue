<script setup lang="ts">
import { saveAs } from 'file-saver'
import corncob from '@/assets/corncob_caps'
import propset from '@/assets/proper_nouns'
import lemmas from '@/assets/lemmas'
import wordlist from '@/assets/wordlist'
import Article from '@/components/Article.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { type Ref, ref, onMounted, onUnmounted, computed } from 'vue'
const MAX_LENGTH = 20
const MIN_LENGTH = 3
const FREQUENCY_CUTOFF = 150

const targets: string[][] = []
const validWords: string[][] = []

enum VIEW {
  LOADING,
  SETUP,
  PLAY
}

for (let i = MIN_LENGTH; i <= MAX_LENGTH; i++) {
  targets.push([])
  validWords.push([])
}

for (const cob of corncob) {
  if (cob.length >= MIN_LENGTH && cob.length <= MAX_LENGTH) {
    validWords[cob.length - MIN_LENGTH].push(cob.toUpperCase())
  }
}

for (const word of wordlist) {
  if (word[0].length >= MIN_LENGTH && word[0].length <= MAX_LENGTH) {
    validWords[word[0].length - MIN_LENGTH].push(word[0].toUpperCase())
    if (word[1] >= FREQUENCY_CUTOFF) {
      targets[word[0].length - MIN_LENGTH].push(word[0].toUpperCase())
    }
  }
}

for (let i = MIN_LENGTH; i <= MAX_LENGTH; i++) {
  validWords[i - MIN_LENGTH].sort()
}

function getPercentage(index: number) {
  return Math.round(index / validWords[length.value - MIN_LENGTH].length * 100000) / 1000
}

const view: Ref<VIEW> = ref(VIEW.LOADING)
const showHelp = ref(false)
let lengthInput = 5
const length = ref(5)
const currentWord = ref('')
let index = 0
const currentPercentage = ref(0)
const closestBelow = ref(-1)
const closestAbove = ref(-1)
const message = ref('')
const guess = ref('')
const revealed = ref('')

const exampleWord = computed(() => {
  let word = currentWord.value
  while (word === currentWord.value) {
    word = targets[length.value - MIN_LENGTH][Math.floor(Math.random() * targets[length.value - MIN_LENGTH].length)]
  }
  return word
})

function pick() {
  view.value = VIEW.PLAY
  revealed.value = ''
  closestBelow.value = -1
  closestAbove.value = -1
  message.value = ''
  guess.value = ''
  length.value = lengthInput
  const target = targets[length.value - MIN_LENGTH][Math.floor(Math.random() * targets[length.value - MIN_LENGTH].length)]
  index = validWords[length.value - MIN_LENGTH].indexOf(target)
  currentWord.value = validWords[length.value - MIN_LENGTH][index]
  currentPercentage.value = getPercentage(index)
}

function check() {
  const guessUpper = guess.value.toUpperCase()
  guess.value = revealed.value

  if (currentWord.value.length === 0) {
    pick()
  }

  if (guessUpper === 'GRACE') {
    message.value = `❤️ You guessed my special person.`
    return
  } else if (guessUpper === 'PRINCE') {
    message.value = `👑 What's a mob to a king?`
    return
  } else if (guessUpper === 'DOOYEON') {
    message.value = '🌲 In the dappled lee of a linden tree'
    return
  } else if (guessUpper === 'SASKIA') {
    message.value = '🍣 Teach a girl to fish'
    return
  }

  if (!guessUpper.length) {
    return
  }

  saveState()

  if (guessUpper.length !== length.value) {
    message.value = `⚠️ "${guessUpper}" has ${guessUpper.length} letter${guessUpper.length > 1 ? 's' : ''}, but the target word is ${guessUpper.length > length.value ? 'only ' : ''} ${length.value} letters long`
    return
  }

  if (guessUpper === currentWord.value) {
    message.value = `💯 Well done you win`
    revealed.value = currentWord.value
    closestBelow.value = -1
    closestAbove.value = -1
    return
  }

  const guessIndex = validWords[length.value - MIN_LENGTH].indexOf(guessUpper)
  if (guessIndex === -1) {
    message.value = `⚠️ Your guess "${guessUpper}" was not in the dictionary`
    return
  }

  if (guessIndex < index && guessIndex > closestBelow.value) {
    closestBelow.value = guessIndex
  } else if (guessIndex > index && (closestAbove.value === -1 || guessIndex < closestAbove.value)) {
    closestAbove.value = guessIndex
  }

  autoReveal()
  guess.value = revealed.value

  const guessPercentage = getPercentage(guessIndex)

  if (Math.abs(guessPercentage - currentPercentage.value) < 0.001) {
    message.value = `😎 Your guess "${guessUpper}" is almost right! Both "${guessUpper}" and the target are <b>${guessPercentage}%</b> of the way through the ${length.value}-letter words.`
  }

  message.value = `"${guessUpper}" is <b>${guessPercentage}%</b> of the way through the ${length.value}-letter words.`
  saveState()
}

function autoReveal() {
  let prefixMatch = 0
  for (
    prefixMatch = 0;
    Math.min(closestBelow.value, closestAbove.value) >= 0 &&
    prefixMatch < length.value - 1 &&
    validWords[length.value - MIN_LENGTH][closestBelow.value].charAt(prefixMatch) === validWords[length.value - MIN_LENGTH][closestAbove.value].charAt(prefixMatch);
    prefixMatch++
  );
  if (prefixMatch > revealed.value.length) {
    revealed.value = currentWord.value.substring(0, prefixMatch)
  }
}

function reveal() {
  if (currentWord.value.length === 0) {
    pick()
  }
  if (revealed.value.length < currentWord.value.length) {
    revealed.value += currentWord.value.charAt(revealed.value.length)
    saveState()
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'Space' || e.key === 'Enter') {
    e.preventDefault()
    check()
  }
}

onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
  loadState()
  // test code
  // lengthInput = 10
  // length.value = 10
  // pick()
  // closestBelow.value = 0
  // closestAbove.value = validWords[length.value - MIN_LENGTH].length - 1
  // guess.value = 'fool'
  // check()
})

onUnmounted(() => document.removeEventListener("keyup", onKeyUp))

const defaultState = {
  length: 5,
  index: 0,
  closestBelow: -1,
  closestAbove: -1,
  revealed: ''
}
type StateType = typeof defaultState

function loadSerialized(serialized: string) {
  const loadedState: StateType = JSON.parse(serialized)
  index = loadedState.index
  lengthInput = loadedState.length
  length.value = loadedState.length
  currentWord.value = validWords[length.value - MIN_LENGTH][index]
  currentPercentage.value = getPercentage(index)
  closestBelow.value = loadedState.closestBelow
  closestAbove.value = loadedState.closestAbove
  revealed.value = loadedState.revealed
  guess.value = revealed.value
}

function loadState() {
  view.value = VIEW.LOADING
  const defaultSerialized = JSON.stringify(defaultState)
  const serializedState: string = localStorage.getItem('searchWordState') ?? defaultSerialized
  try {
    loadSerialized(serializedState)
  } catch (e) {
    console.error(
      'Error loading state from local storage:',
      e,
      'falling back to default state'
    )
    console.warn('Serialized state:', serializedState)
    localStorage.removeItem('searchWordState')
    loadSerialized(defaultSerialized)
  }
  autoReveal()
  view.value = VIEW.SETUP
}

function saveState() {
  const savedState: StateType = {
    index,
    length: length.value,
    closestBelow: closestBelow.value,
    closestAbove: closestAbove.value,
    revealed: revealed.value,
  }
  localStorage.setItem('searchWordState', JSON.stringify(savedState))
}

function saveWordlist() {
  const printList: string[] = ['export default <[string, number][]>[\n']
  const negative: string[] = ['export default <[string, number][]>[\n']
  const cornset = new Set(corncob)
  for (const word of lemmas) {
    if (cornset.has(word[0].toUpperCase()) && !propset.has(word[0].toUpperCase())) {
      printList.push(`['${word[0]}',${word[1]}],\n`)
    } else {
      negative.push(`['${word[0]}',${word[1]}],\n`)
    }
  }
  printList.push(']')
  negative.push(']')

  console.log(printList.join('\n'))
  console.log(negative.join('\n'))

  var blob = new Blob(printList, { type: "text/plain;charset=utf-8" })
  saveAs(blob, "wordlist.ts")
  // var blob = new Blob(negative, {type: "text/plain;charset=utf-8"});
  // saveAs(blob, "negative.ts");
}

</script>

<template>
  <a v-if="view !== VIEW.PLAY && !showHelp" href="/" class="plain absolute left-0 top-1 z-10">
    <Button text no-hover>
      <span>← Back</span>
    </Button>
  </a>

  <Button v-show="view === VIEW.PLAY && !showHelp" text no-hover class="absolute left-0 top-1 z-10"
    @click="view = VIEW.SETUP">
    <span>← {{ revealed === currentWord ? 'Done' : 'Give Up' }}</span>
  </Button>

  <Button v-show="view !== VIEW.LOADING && !showHelp" class="absolute right-4 top-4 border border-gray-300 z-10" text
    no-hover @click="() => showHelp = true">
    <span v-show="!showHelp" class="bold">?</span>
  </Button>
  <Article class="pt-0">
    <div v-show="view === VIEW.LOADING">Loading...</div>
    <div v-show="view !== VIEW.LOADING && showHelp" class="bg-white border border-gray-300 p-8 absolute z-10 mx-8">
      <Icon v-show="showHelp" name="close" class="w-10 absolute right-2 top-2 cursor-pointer p-2"
        @click="() => showHelp = false"></Icon>
      <p>The game is to guess the word. Choose what length the mytery word will be (shorter words are easier) and click
        <b>Play</b>.
      </p>
      <p>Now start guessing! Type in your guess and click <b>Guess</b> to get a hint about how close you were.</p>
      <p>Keep narrowing down your guesses until you find the mystery word!</p>
      <p>Letters will automatically be revealed as they are confirmed by your guesses. If you are stuck, click <b>Reveal
          Letter</b> to reveal a letter.
      </p>
      <p>
        You can guess whatever words you like, but the mystery word will always be a dictionary word.
        E.g. "Avail" could be the mystery word, but not "Avails" or "Availed".
        British spelling is preferred to American. E.g. "Vapour" is allowed, but not "Vapor".
      </p>
    </div>
    <div v-show="view === VIEW.SETUP" class="h-screen flex items-center justify-center mx-8">
      <div class="flex flex-col gap-4 items-center">
        <div class="font-display text-xl font-bold text-center">
          How long should the mystery word be?
        </div>
        <div class="text-2xl">
          <input type="number" v-model="lengthInput" :min="MIN_LENGTH" :max="MAX_LENGTH"
            class="border-b border-gray-500 max-w-[3rem] after:content-['*']" /> letters
        </div>
        <Button @click="pick" class="w-fit text-lg font-bold">Play</Button>
      </div>
    </div>
    <div v-show="view === VIEW.PLAY" class="flex items-center justify-center h-screen">
      <div class="flex flex-col items-center justify-center relative">
        <div class="grid grid-cols-[6rem_14rem] mb-12 font-mono text-xl">
          <div>{{ closestBelow >= 0 ? `${getPercentage(closestBelow)}%` : '&nbsp;' }}</div>
          <div class="mr-1 text-end">
            {{ closestBelow >= 0 ? validWords[length - MIN_LENGTH][closestBelow] : '&nbsp;' }}
          </div>
          <div>{{ currentPercentage }}%</div>
          <div class="mr-1 text-end">
            {{ `${revealed}${'?'.repeat(length - revealed.length)}` }}
          </div>
          <div>{{ closestAbove >= 0 ? `${getPercentage(closestAbove)}%` : '&nbsp;' }}</div>
          <div class="mr-1 text-end">
            {{ closestAbove >= 0 ? validWords[length - MIN_LENGTH][closestAbove] : '&nbsp;' }}
          </div>
        </div>
        <div class="flex justify-between w-80" v-show="revealed !== currentWord">
          <input type="text" v-model="guess" style="width: 11.5rem"
            class="border-b border-gray-500 uppercase text-xl font-mono outline-none"
            :placeholder="'E.g.' + exampleWord" />
          <Button @click="check" class="text-lg">Guess</Button>
        </div>
        <Button text @click="reveal" v-show="revealed !== currentWord"
          class="text-lg w-80 mt-8 border border-gray-300 hover:bg-gray-200">Reveal
          letter
        </Button>
        <div class="flex justify-between w-80" v-show="revealed === currentWord">
          <Button @click="view = VIEW.SETUP" class="text-lg w-80">Next Game</Button>
        </div>
        <div v-show="message !== ''" class="absolute max-w-lg -bottom-32 rounded py-1 px-3 mt-8 bg-sky-100 text-lg"
          v-html="message">
        </div>
      </div>
    </div>
    <!-- <button @click="saveWordlist">Save word list</button> -->
  </Article>
</template>