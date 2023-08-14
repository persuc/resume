<script setup lang="ts">
  import { saveAs } from 'file-saver'
  import corncob from '@/assets/corncob_caps'
  import propset from '@/assets/proper_nouns'
  import lemmas from '@/assets/lemmas'
  import wordlist from '@/assets/wordlist'
  import { type Ref, ref, onMounted, onUnmounted } from 'vue'
  const MAX_LENGTH = 20;
  const MIN_LENGTH = 3;
  const FREQUENCY_CUTOFF = 150;

  const targets: string[][] = []
  const validWords: string[][] = []
  
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

  let loading = ref(true)
  let lengthInput = 5
  let length: Ref<number> = ref(5)
  let currentWord: Ref<string> = ref('')
  let index = 0
  let currentPercentage = ref(0)
  let closestBelow = ref(-1)
  let closestAbove = ref(-1)
  let message = ref('')
  let guess = ref('')
  let revealed = ref('');

  function pick() {
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
    let prefixMatch = 0;
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
    document.addEventListener( "keyup", onKeyUp )
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

  onUnmounted(() => document.removeEventListener( "keyup", onKeyUp ))

  const defaultState = {
    length: 5,
    index: 0,
    closestBelow: -1,
    closestAbove: -1,
    revealed: ''
  }
  type StateType = typeof defaultState;

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
    loading.value = true
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
    loading.value = false
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

    var blob = new Blob(printList, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "wordlist.ts");
    // var blob = new Blob(negative, {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "negative.ts");
  }

</script>

<template>
  <div v-show="!loading" class="word-pinpoint px-8 pt-8 mx-auto" style="max-width: 60rem;">
    <p>The game is to guess the word. Set the length below and click <b>Generate</b> to set the target word.</p>
    <p>
      You can guess whatever words you like, but the target will always be a dictionary word.
      E.g. "Avail" is allowed, but not "Avails" or "Availed".
      British spelling is preferred to American. E.g. "Vapour" is allowed, but not "Vapor".
    </p>
    <p>Type in your guess and click <b>Check</b> to get a hint about how close you were.</p>
    <p>Keep narrowing down your guesses until you find the target word.</p>
    <p>Letters will automatically be revealed as they are confirmed by your guesses. If you are stuck, click <b>Reveal Letter</b> to reveal a letter.</p>
    <div class="flex" style="flex-wrap: wrap">
      <div class="inputs grow">
        <div class="flex items-center justify-between mb-1">
          <input type="number" v-model="lengthInput" :min="MIN_LENGTH" :max="MAX_LENGTH" style="width: 11.5rem"/>
          <button @click="pick">Generate</button>
        </div>
        <div class="flex items-center justify-between mb-1">
          <input type="text" v-model="guess" style="width: 11.5rem"/>
          <button @click="check">Check</button>
        </div>
        <div class="flex items-center justify-end mb-1">
          <button style="float: right" @click="reveal">Reveal letter</button>
        </div>
      </div>
      <div id="guessTracker" class="flex border rounded px-2">
        <div>
          <div></div>
          <div class="mr-1">Target:</div>
          <div></div>
        </div>
        <div>
          <div class="mr-1">
            {{ closestBelow >= 0 ? validWords[length - MIN_LENGTH][closestBelow]: '' }}
          </div>
          <div class="mr-1">
            {{ `${revealed}${'?'.repeat(length - revealed.length)}` }}
          </div>
          <div class="mr-1">
            {{ closestAbove >= 0 ? validWords[length - MIN_LENGTH][closestAbove] : '' }}
          </div>
        </div>
        <div>
          <div>{{ closestBelow >= 0 ? `(${getPercentage(closestBelow)}%)` : '' }}</div>
          <div>({{currentPercentage}}%)</div>
          <div>{{ closestAbove >= 0 ? `(${getPercentage(closestAbove)}%)` : '' }}</div>
        </div>
      </div>
    </div>
    <div v-show="message !== ''" class="rounded py-1 px-3 mt-3 bg-sky-100" v-html="message"></div>
    <!-- <button @click="saveWordlist">Save word list</button> -->
    <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a>
  </div>
</template>

<style scoped lang="postcss">

@media screen and (-webkit-min-device-pixel-ratio:0) { 
  select,
  textarea,
  input {
    font-size: 16px;
  }
}

.word-pinpoint {
  font-size: 16px;
  & button {
    font-size: 16px;
  }
}

#guessTracker {
  height: 5.75rem;
  width: calc(100% - 20.5rem);
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  margin-left: 0.5rem;
  & > div {
    display: flex;
    flex-direction: column;
    & > div {
      flex: 1;
    }
  }
}

.inputs {
  & .flex {
    width: 20rem;
    height: 1.75rem;
    & button {
      width: 8rem;
    }
  }
}

@media (max-width: 1024px) {
  #guessTracker {
    width: 100%;
    margin-left: 0;
    margin-top: 0.5rem;
  }
  .inputs {
    & .flex {
      width: 100%;
    }
  }
}
</style>
