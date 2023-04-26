<script setup lang="ts">
  import { saveAs } from 'file-saver';
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

  let lengthInput = 5
  let length: Ref<number> = ref(5)
  let currentWord: Ref<string> = ref('')
  let index = 0
  let currentPercentage = ref(0)
  let closestBelow = ref(-1)
  let closestAbove = ref(-1)

  function pick() {
    revealed.value = ''
    closestBelow.value = -1
    closestAbove.value = -1
    message.value = ''
    length.value = lengthInput
    const target = targets[length.value - MIN_LENGTH][Math.floor(Math.random() * targets[length.value - MIN_LENGTH].length)]
    index = validWords[length.value - MIN_LENGTH].indexOf(target)
    currentWord.value = validWords[length.value - MIN_LENGTH][index]
    currentPercentage.value = getPercentage(index)
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
      message.value = `⚠️ "${guessUpper}" is not a ${length.value} letter word`
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

    const guessPercentage = getPercentage(guessIndex)

    if (Math.abs(guessPercentage - currentPercentage.value) < 0.001) {
      message.value = `😎 Your guess was almost exactly a match for the target word! Both your guess and the target are ${guessPercentage}% of the way through the ${length.value}-letter words.`
    }

    message.value = `Your guess "${guessUpper}" was ${guessPercentage}% of the way through the ${length.value}-letter words.`
  }

  let revealed = ref('');

  function reveal() {
    if (currentWord.value.length === 0) {
      pick()
    }
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
  <div class="binary px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
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
      <div class="inputs">
        <div class="flex center space-between">
          <input type="number" v-model="lengthInput" :min="MIN_LENGTH" :max="MAX_LENGTH" style="width: 11.5rem" initial-scale=1 maximum-scale=1 />
          <button @click="pick">Generate</button>
        </div>
        <div class="flex center space-between">
          <input type="text" v-model="guess" style="width: 11.5rem" initial-scale=1 maximum-scale=1 />
          <button @click="check">Check</button>
        </div>
        <div class="flex center end">
          <button style="float: right" @click="reveal">Reveal letter</button>
        </div>
      </div>
      <span class="mx-2 rule"></span>
      <div>
        <div style="height: 1.75rem;">
          {{ closestBelow >= 0 ? `Closest guess < target: "${
            validWords[length - MIN_LENGTH][closestBelow]
          }" (${ 
            getPercentage(closestBelow)
          }%)` : '&nbsp;' }}
        </div>
        <div style="height: 1.75rem;">Target: {{ `${revealed}${'?'.repeat(length - revealed.length)} (${ 
            currentPercentage
          }%)` }}
        </div>
        <div style="height: 1.75rem;"> {{ closestAbove >= 0 ? `Closest guess > target: "${
            validWords[length - MIN_LENGTH][closestAbove]
          }" (${ 
            getPercentage(closestAbove)
          }%)` : '&nbsp;' }}
        </div>
      </div>
    </div>
    <h3 v-html="message"></h3>
    <!-- <button @click="saveWordlist">Save word list</button> -->
  </div>
</template>

<style scoped lang="postcss">
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
  .inputs {
    flex-grow: 1;
    flex-basis: 100%;
  }
  .rule {
    display: none;
  }
}
</style>
