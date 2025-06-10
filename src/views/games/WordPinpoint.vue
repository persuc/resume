<script setup lang="ts">
import { saveAs } from 'file-saver'
import corncob from '@/assets/corncob_caps'
import propset from '@/assets/proper_nouns'
import wordlist from '@/assets/wordlist'
import Article from '@/components/Article.vue'
import Button from '@/components/Button.vue'
import CopyButton from '@/components/CopyButton.vue'
import Icon from '@/components/Icon.vue'
import createVignere from '@/ts/pinpoint/vignere'
import { type Ref, ref, onMounted, onUnmounted, computed, type ComputedRef } from 'vue'
const MAX_LENGTH = 20
const MIN_LENGTH = 3
const EASY_FREQUENCY_CUTOFF = 950
const MEDIUM_FREQUENCY_CUTOFF = 150
const HARD_FREQUENCY_CUTOFF = 1

enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD,
  RANDOM,
}

enum VIEW {
  LOADING,
  SETUP,
  CUSTOM,
  PLAY,
}

const targets: Record<string, string[][]> = {
  [DIFFICULTY.EASY]: [],
  [DIFFICULTY.MEDIUM]: [],
  [DIFFICULTY.HARD]: [],
}

const validWords: string[][] = []

for (let i = 0; i <= MAX_LENGTH - MIN_LENGTH; i++) {
  for (const a of Object.values(targets).concat([validWords])) {
    a.push([])
  }
}

for (const cob of corncob) {
  if (cob.length >= MIN_LENGTH && cob.length <= MAX_LENGTH) {
    validWords[cob.length - MIN_LENGTH].push(cob)
  }
}

for (const word of wordlist) {
  if (word[0].length >= MIN_LENGTH && word[0].length <= MAX_LENGTH) {
    validWords[word[0].length - MIN_LENGTH].push(word[0].toUpperCase())
    let targetList = (() => {
      if (word[1] >= EASY_FREQUENCY_CUTOFF) {
        return targets[DIFFICULTY.EASY]
      } else if (word[1] >= MEDIUM_FREQUENCY_CUTOFF) {
        return targets[DIFFICULTY.MEDIUM]
      } else if (word[1] >= HARD_FREQUENCY_CUTOFF) {
        return targets[DIFFICULTY.HARD]
      }
    })()
    if (targetList) {
      targetList[word[0].length - MIN_LENGTH].push(word[0].toUpperCase())
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
const difficulty: Ref<DIFFICULTY> = ref(DIFFICULTY.MEDIUM)
const showHelp = ref(false)
let lengthInput = 5
const customInput = ref('')
const length = ref(5)
const currentWord = ref('')
let index = 0
const currentPercentage = ref(0)
const closestBelow = ref(-1)
const closestAbove = ref(-1)
const message = ref('')
const guess = ref('')
const revealed = ref('')
const vignere = createVignere("THISISDHEERAJSFAULT")

const exampleWord = computed(() => {
  let word = currentWord.value
  while (word === currentWord.value) {
    word = targets[DIFFICULTY.EASY][length.value - MIN_LENGTH][Math.floor(Math.random() * targets[DIFFICULTY.EASY][length.value - MIN_LENGTH].length)]
  }
  return word
})

const seedUrl: ComputedRef<string | undefined> = computed(() => {
  const custom = customInput.value.toUpperCase()
  const current = currentWord.value.toUpperCase()
  const plaintext = view.value === VIEW.CUSTOM ? custom : current
  if (plaintext.length < MIN_LENGTH || plaintext.length > MAX_LENGTH) {
    return undefined
  }
  try {
    return `https://persic.cloud/word-pinpoint?seed=${vignere.encipher(plaintext)}`
  } catch {
    return undefined
  }
})

function pick() {

  const parsedLength = parseInt(lengthInput as unknown as string)

  if (Number.isNaN(parsedLength) || parsedLength < MIN_LENGTH || parsedLength > MAX_LENGTH) {
    message.value = `⚠️ Please choose a length between ${MIN_LENGTH} and ${MAX_LENGTH} letters`
    return
  }

  view.value = VIEW.PLAY
  revealed.value = ''
  closestBelow.value = -1
  closestAbove.value = -1
  message.value = ''
  guess.value = ''
  length.value = parsedLength
  const target = (() => {
    if (difficulty.value === DIFFICULTY.RANDOM) {
      let idx = Math.floor(Math.random() * Object.values(targets).map(t => t[length.value - MIN_LENGTH]).reduce((a, v) => a + v.length, 0))
      let difficulty = DIFFICULTY.EASY
      if (idx >= targets[difficulty][length.value - MIN_LENGTH].length) {
        idx -= targets[difficulty][length.value - MIN_LENGTH].length
        difficulty = DIFFICULTY.MEDIUM
      }
      if (idx >= targets[difficulty][length.value - MIN_LENGTH].length) {
        idx -= targets[difficulty][length.value - MIN_LENGTH].length
        difficulty = DIFFICULTY.HARD
      }
      return targets[difficulty][length.value - MIN_LENGTH][idx]
    } else {
      return targets[difficulty.value][length.value - MIN_LENGTH][Math.floor(Math.random() * targets[difficulty.value][length.value - MIN_LENGTH].length)]
    }
  })()
  index = validWords[length.value - MIN_LENGTH].indexOf(target)
  currentWord.value = validWords[length.value - MIN_LENGTH][index]
  currentPercentage.value = getPercentage(index)

  saveState()

  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set("seed", vignere.encipher(currentWord.value))
  window.location.search = searchParams.toString()
}

function setCustom(target: string) {
  view.value = VIEW.PLAY
  revealed.value = ''
  closestBelow.value = -1
  closestAbove.value = -1
  message.value = ''
  guess.value = ''
  length.value = target.length
  index = validWords[length.value - MIN_LENGTH].findIndex(word => target <= word)
  if (index === -1) {
    index = validWords.length
  }
  currentWord.value = target
  currentPercentage.value = getPercentage(index)
}

function check() {
  const guessUpper = guess.value.toUpperCase()
  guess.value = revealed.value
  if (!guessUpper.length) {
    return
  }

  if (guessUpper === 'GRACE') {
    message.value = `❤️ You guessed my special person.`
    return
  } else if (guessUpper === 'DOOYEON') {
    message.value = '🌲 In the dappled lee of a linden tree'
    return
  } else if (guessUpper === 'SASKIA') {
    message.value = '🍣 Teach a girl to fish'
    return
  } else if (guessUpper === 'DHEERAJ') {
    message.value = '🧔🏾 persic.cloud perf test when?'
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

function reset() {
  message.value = ''
  revealed.value = currentWord.value
  saveState()
  view.value = VIEW.SETUP
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete("seed")
  window.location.search = searchParams.toString()
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'Space' || e.key === 'Enter') {
    e.preventDefault()
    check()
  }
}

function onTouchEnd(e: TouchEvent) {
  if (e.target === document.getElementById('guessButton')) {
    e.preventDefault()
    check()
    return
  }
  const guessInput = document.getElementById('guessInput')
  if (guessInput && e.target === guessInput) {
    setTimeout(() => {
      // document.getElementById('guessGrid')?.scrollIntoView()
      window.scrollTo(0, 80)
    }, 100)
    return
  }

}

onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
  document.addEventListener('touchend', onTouchEnd)
  loadState()

  const parsedUrl = new URL(window.location.href)
  const seed = parsedUrl.searchParams.get("seed")
  if (seed) {
    const target = vignere.decipher(seed)
    if (currentWord.value !== target) {
      setCustom(target)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener("keyup", onKeyUp)
  document.removeEventListener("touchend", onTouchEnd)
})

const defaultState = {
  length: 5,
  index: 0,
  closestBelow: -1,
  closestAbove: -1,
  revealed: validWords[5 - MIN_LENGTH][0]
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
  if (revealed.value != currentWord.value) {
    view.value = VIEW.PLAY
  } else {
    view.value = VIEW.SETUP
  }
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
  for (const word of wordlist) {
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
  <Article class="pt-0 h-screen flex flex-col" :footer="false">

    <div class="z-10 flex justify-between w-full pb-2">
      <Button variant="text" class="" @click="() => view === VIEW.SETUP ? $router.push('/') : reset()">
        <span>← {{ view === VIEW.SETUP ? 'Back' : revealed === currentWord ? 'Done' : 'Give Up' }}</span>
      </Button>

      <Button v-show="view !== VIEW.LOADING" class="z-10 mr-4 mt-4" @click="() => showHelp = true">
        <span class="font-semibold text-xl">?</span>
      </Button>
    </div>

    <div v-show="view === VIEW.LOADING">Loading...</div>
    <div v-show="view !== VIEW.LOADING && showHelp" class="absolute bg-white border border-gray-300 p-8 z-10 mx-8 mt-4">
      <Icon v-show="showHelp" name="close" class="w-10 absolute right-2 top-2 cursor-pointer p-2"
        @click="() => showHelp = false"></Icon>
      <p>The game is to guess the word. Choose what length the mystery word will be (shorter words are easier) and click
        <b>Play</b>.
      </p>
      <p>Now start guessing! The only you information you have about the word you are trying to guess is how far it is
        through the dictionary, as a percentage. I.e. if we play with 8 letters, "aardvark" is 0% of the way through,
        and "midfield" is 54% of the way through. Type in your guess and click <b>Guess</b> to get a hint about how
        close you were.</p>
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
    <div v-show="view === VIEW.SETUP" class="flex items-center justify-center mx-8">
      <div class="flex flex-col gap-1 items-center flex-wrap">
        <div class="font-display text-xl font-bold text-center">
          How long should the mystery word be?
        </div>
        <div class="text-2xl mb-8">
          <input type="number" v-model="lengthInput" :min="MIN_LENGTH" :max="MAX_LENGTH"
            class="border-b border-gray-500 max-w-[3rem] after:content-['*']" /> letters
        </div>
        <div class="font-display text-xl font-bold text-center">
          Difficulty?
        </div>
        <div class="flex justify-center gap-4 mb-8 flex-wrap">
          <Button variant="text" @click="difficulty = DIFFICULTY.EASY" color="lime"
            class="w-fit text-lg font-bold border !text-lime-500"
            :class="{ 'border-2 border-lime-500': difficulty === DIFFICULTY.EASY }">
            Easy
          </Button>
          <Button variant="text" @click="difficulty = DIFFICULTY.MEDIUM" color="yellow"
            class="w-fit text-lg font-bold border !text-yellow-500"
            :class="{ 'border-2 border-yellow-500': difficulty === DIFFICULTY.MEDIUM }">
            Medium
          </Button>
          <Button variant="text" @click="difficulty = DIFFICULTY.HARD" color="red"
            class="w-fit text-lg font-bold border !text-red-500"
            :class="{ 'border-2 border-red-500': difficulty === DIFFICULTY.HARD }">
            Hard
          </Button>
          <Button variant="text" @click="difficulty = DIFFICULTY.RANDOM" class="w-fit text-lg font-bold border"
            :class="{ 'border-2 border-gray-500': difficulty === DIFFICULTY.RANDOM }">
            RANDOM
          </Button>
        </div>
        <Button @click="pick" class="w-fit text-lg font-bold mx-0">Play</Button>
        <Button v-show="view === VIEW.SETUP" class="z-10 mt-4 mx-0" @click="() => view = VIEW.CUSTOM">
          <span class="font-semibold text-xl">Custom</span>
        </Button>
      </div>
    </div>
    <div v-show="view === VIEW.CUSTOM" class="flex flex-col items-center justify-center gap-4">
      <div class="font-display text-xl font-bold text-center">
        Enter your chosen target word:
      </div>
      <div class="text-2xl">
        <input type="text" v-model="customInput" :min="MIN_LENGTH" :max="MAX_LENGTH"
          class="border-b border-gray-500 w-96 after:content-['*']" />
      </div>
      <div v-show="seedUrl === undefined" class="w-80 rounded py-1 px-3 mx-8 bg-sky-100 text-lg">
        ⚠️ Word must be only letters, at least {{ MIN_LENGTH }} and at most {{ MAX_LENGTH }} characters
      </div>
      <CopyButton v-if="seedUrl !== undefined" :value="seedUrl" style="line-height: 1.5em;">
        <span class="p-2 bg-gray-200 break-words mr-30">{{ seedUrl }}</span>
      </CopyButton>
    </div>
    <div v-show="view === VIEW.PLAY" class="flex items-center justify-center">
      <div class="flex flex-col items-center justify-center relative">
        <div class="grid grid-cols-[6rem_14rem] mb-12 font-mono text-xl" id="guessGrid">
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
          <input id="guessInput" type="text" v-model="guess" style="width: 11.5rem"
            class="border-b border-gray-500 uppercase text-xl font-mono outline-none"
            :placeholder="'E.g.' + exampleWord" />
          <Button @click="check" class="text-lg" id="guessButton">Guess</Button>
        </div>
        <Button text @click="reveal" v-show="revealed !== currentWord" class="text-lg w-80 my-8">Reveal
          letter
        </Button>
        <div class="w-80 rounded py-1 px-3 mx-8 bg-sky-100 text-lg" v-show="message !== ''" v-html="message">
        </div>
        <div class="flex justify-center w-80 mt-8" v-show="revealed === currentWord">
          <Button @click="reset" class="text-lg w-80">Next Game</Button>
        </div>
      </div>
    </div>
    <!-- <button @click="saveWordlist">Save word list</button> -->
  </Article>
</template>