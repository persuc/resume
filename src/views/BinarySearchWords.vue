<script setup lang="ts">
  import { saveAs } from 'file-saver';
  import corncob from '@/assets/corncob_caps'
  import lemmas from '@/assets/lemmas'
  import wordlist from '@/assets/wordlist'
  import { type Ref, ref, onMounted, onUnmounted } from 'vue'
  const MAX_LENGTH = 20;
  const MIN_LENGTH = 3;
  const FREQUENCY_CUTOFF = 150;

  const words: string[][] = []
  
  for (let i = MIN_LENGTH; i <= MAX_LENGTH; i++) {
    words.push([])
  }

  for (const word of wordlist) {
    if (word[1] < FREQUENCY_CUTOFF || word[0].length < MIN_LENGTH || word[0].length > MAX_LENGTH) {
      continue;
    }
    words[word[0].length - MIN_LENGTH].push(word[0].toUpperCase())
  }

  for (let i = MIN_LENGTH; i <= MAX_LENGTH; i++) {
    words[i - MIN_LENGTH].sort() 
  }

  function getPercentage(index: number) {
    return Math.round(index / words[length.value - MIN_LENGTH].length * 100000) / 1000
  }

  let length: Ref<number> = ref(5)
  let currentWord: Ref<string> = ref('')
  let index = 0
  let currentPercentage = 0
  let closestBelow = ref(-1)
  let closestAbove = ref(-1)

  function pick() {
    revealed.value = ''
    closestBelow.value = -1
    closestAbove.value = -1
    message.value = ''
    index = Math.floor(Math.random() * words[length.value - MIN_LENGTH].length)
    currentWord.value = words[length.value - MIN_LENGTH][index]
    currentPercentage = getPercentage(index)
  }

  let message = ref('')
  let guess = ref('')

  function check() {
    const guessUpper = guess.value.toUpperCase()
    guess.value = ''

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
    }

    if (!guessUpper.length) {
      return
    }
    if (guessUpper.length != length.value) {
      message.value = `⚠️ Your guess "${guessUpper}" must be a ${length.value} letter word`
      return
    }

    if (guessUpper === currentWord.value) {
      message.value = `💯 Well done you win`
      revealed.value = currentWord.value
      closestBelow.value = -1
      closestAbove.value = -1
      return
    }

    const guessIndex = words[length.value - MIN_LENGTH].indexOf(guessUpper)
    if (guessIndex === -1) {
      message.value = `⚠️ Your guess "${guessUpper}" was not in the dictionary`
      return
    }

    if (guessIndex < index && guessIndex > closestBelow.value) {
      closestBelow.value = guessIndex
    } else if (guessIndex > index && (closestAbove.value === -1 || guessIndex < closestAbove.value)) {
      closestAbove.value = guessIndex
    }

    let prefixMatch = 0;
    for (
      prefixMatch = 0;
      Math.min(closestBelow.value, closestAbove.value) >= 0 &&
      prefixMatch < length.value - 1 &&
        words[length.value - MIN_LENGTH][closestBelow.value].charAt(prefixMatch) === words[length.value - MIN_LENGTH][closestAbove.value].charAt(prefixMatch);
      prefixMatch++
    );
    if (prefixMatch > revealed.value.length) {
      revealed.value = currentWord.value.substring(0, prefixMatch)
    }

    const guessPercentage = getPercentage(guessIndex)
    console.log(`Guess "${guessUpper}" is ${guessPercentage}% through the ${length.value}-letter words.\
 Answer is ${currentPercentage}% of the way through.`)
    message.value = `Your guess "${guessUpper}" was ${guessPercentage}% of the way through the ${length.value}-letter words.\
 The answer is ${currentPercentage}% of the way through.`
  }

  let revealed = ref('');

  function reveal() {
    if (revealed.value.length < currentWord.value.length) {
      revealed.value += currentWord.value.charAt(revealed.value.length)
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
      check()
    } 
  }

  onMounted(() => document.addEventListener( "keyup", onKeyUp ))

  onUnmounted(() => document.removeEventListener( "keyup", onKeyUp ))

  function saveWordlist() {
    const cornset = new Set(corncob)
    const printList: string[] = ['export default <[string, number][]>[\n']
    const negative: string[] = ['export default <[string, number][]>[\n']

    for (const word of lemmas) {
      if (cornset.has(word[0].toUpperCase())) {
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
  <div class="binary px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <p>The game is to guess the word. Set the length below and click <b>Generate</b> to set the target word.</p>
    <p>Only lemmas are allowed. E.g. "Avail" is allowed, but not "Avails" or "Availed"</p>
    <p>Type in your guess and click <b>Check</b> to get a hint about how close you were.</p>
    <p>Keep narrowing down your guesses until you find the target word.</p>
    <div class="flex">
      <div>
        <input type="number" v-model="length" :min="MIN_LENGTH" :max="MAX_LENGTH" />
        <button class="ml-2" @click="pick">Generate</button>
        <br class="my-1" />
        <input type="text" v-model="guess" />
        <button class="ml-2" @click="check">Check</button>
      </div>
      <span class="mx-2 rule"></span>
      <div>
        <p> {{ closestBelow >= 0 ? `Your closest guess before the target was "${
            words[length - MIN_LENGTH][closestBelow]
          }" (${ 
            getPercentage(closestBelow)
          }%)` : '&nbsp;' }}
        </p>
        <p> {{ closestAbove >= 0 ? `Your closest guess after the target was "${
            words[length - MIN_LENGTH][closestAbove]
          }" (${ 
            getPercentage(closestAbove)
          }%)` : '&nbsp;' }}
        </p>
      </div>
    </div>
    <h3 v-html="message"></h3>
    <i style="font-size: 0.75rem;">If you are stuck, click the button below to reveal a letter. Letters will automatically be revealed as they are confirmed by your guesses.</i>
    <br />
    <button @click="reveal">Reveal letter</button>
    <h1>{{ revealed }}</h1>

    <!-- <button @click="saveWordlist">Save word list</button> -->
  </div>
</template>

<style scoped>
</style>
