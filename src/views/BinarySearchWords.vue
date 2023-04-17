<script setup lang="ts">
  import wordlist from '@/assets/lemmas'
  import { type Ref, ref } from 'vue'
  const MAX_LENGTH = 20;
  const MIN_LENGTH = 3;
  const FREQUENCY_CUTOFF = 200;

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


  let length: Ref<number> = ref(5)
  let currentWord: Ref<string> = ref('')
  let index = 0
  let currentPercentage = 0

  function pick() {
    index = Math.floor(Math.random() * words.length)
    currentWord.value = words[length.value - MIN_LENGTH][index]
    currentPercentage = Math.round(index / words[length.value - MIN_LENGTH].length * 100000) / 1000
  }

  let message = ref('')
  let guess = ref('')

  function check() {
    const guessUpper = guess.value.toUpperCase()
    if (!guess.value.length) {
      return
    }
    if (guess.value.length != length.value) {
      message.value = `⚠️ Your guess "${guessUpper}" must be a ${length.value} letter word`
      return
    }

    if (guessUpper === currentWord.value) {
      message.value = `💯 Well done you win`
      return
    }

    const guessIndex = words[length.value - MIN_LENGTH].indexOf(guessUpper)
    if (guessIndex === -1) {
      message.value = `⚠️ Your guess "${guessUpper}" was not in the dictionary`
      return
    }
    const guessPercentage = Math.round(guessIndex / words[length.value - MIN_LENGTH].length * 100000) / 1000
    message.value = `Your guess "${guessUpper}" was ${guessPercentage}% of the way through the ${length.value}-letter words.
 The answer is ${currentPercentage}% of the way through.`
  }

</script>

<template>
  <div class="binary px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <input type="number" v-model="length" :min="MIN_LENGTH" :max="MAX_LENGTH" />
    <button @click="pick">Generate</button>
    <br />
    <input type="text" v-model="guess" />
    <button @click="check">Check</button>
    <h3>{{ message }}</h3>
    <h1 style="color: white">{{ currentWord }}</h1>
  </div>
</template>

<style scoped>
</style>
