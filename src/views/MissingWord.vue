<script setup lang="ts">
  import books from '@/assets/books'
  import corncob from '@/assets/corncob_caps'
  import { type Ref, ref, onMounted, onUnmounted } from 'vue'
  const MAX_LENGTH = 20
  const MIN_LENGTH = 3
  const VISIBILITY = 200

  const cornset = new Set(corncob)
  let length: Ref<number> = ref(0)
  let currentWord: Ref<string> = ref('')
  let author: Ref<number> = ref(0)
  let revealed = ref('');
  const nullBook: typeof books[0]['books'][0] = { title: '', url: ''}
  const currentBook: Ref<typeof books[0]['books'][0]> = ref(nullBook)
  let before = ref('')
  let after = ref('')
  let message = ref('')
  let guess = ref('')
  let guessSingle = ref('')

  async function pick(): Promise<void> {
    const booksOfAuthor = books[author.value]
    currentBook.value = nullBook

    currentBook.value = booksOfAuthor.books[Math.floor(Math.random() * booksOfAuthor.books.length)]
    const text = await (await fetch(currentBook.value.url)).text()
    const halfVisibility = Math.floor(VISIBILITY / 2)
    const index = Math.floor(Math.random() * (text.length - VISIBILITY - 30) ) + halfVisibility + 15

    let start = index
    while (/[a-zA-Z\-]/.test(text.charAt(start - 1))) {
      start--
    }
    let end = index
    while (/[a-zA-Z\-]/.test(text.charAt(end))) {
      end++
    }
    length.value = end - start

    if (length.value < MIN_LENGTH || length.value > MAX_LENGTH) {
      return pick()
    }

    currentWord.value = text.substring(start, end)

    if (!cornset.has(currentWord.value.toUpperCase())) {
      return pick()
    }
    before.value = text.substring(start - halfVisibility, start)
    after.value = text.substring(end, end + halfVisibility)
    revealed.value = '_'.repeat(length.value)
    guessSingle.value = '-'
    checkLetter()
    message.value = ''
  }

  function checkLetter() {
    if (!guessSingle.value.length) {
      return
    }

    guess.value = guessSingle.value.charAt(0).repeat(length.value)
    check()
    guessSingle.value = ''
  }

  function check() {
    const guessLower = guess.value.toLowerCase()
    guess.value = ''

    if (currentWord.value.length === 0) {
      pick()
    }

    if (!guessLower.length) {
      return
    }

    if (guessLower.length !== length.value) {
      message.value = `⚠️ "${guessLower}" has ${guessLower.length} letter${guessLower.length > 1 ? 's' : ''}, but the target word is ${guessLower.length > length.value ? 'only ' : ''} ${length.value} letters long`
      return
    }

    let correctCharacters = 0
    for (let i = 0; i < guessLower.length; i++) {
      if (guessLower.charAt(i) === currentWord.value.toLowerCase().charAt(i)) {
        correctCharacters++
        revealed.value = revealed.value.substring(0, i) + currentWord.value.charAt(i) + revealed.value.substring(i + 1)
      }
    }

    if (revealed.value.indexOf('_') === -1) {
      message.value = `💯 Well done you win`
      return
    }

    message.value = `Your guess "${guessLower}" contained ${correctCharacters} correct character${correctCharacters === 1 ? '' : 's'}.`
  }

  function concede() {
    revealed.value = currentWord.value
    message.value = ''
  }

  function reset() {
    currentWord.value = ''
    message.value = ''
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
      check()
    } 
  }

  onMounted(() => document.addEventListener( "keyup", onKeyUp ))

  onUnmounted(() => document.removeEventListener( "keyup", onKeyUp ))

</script>

<template>
  <div class="missing-word px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <p>The game is to guess the missing word from a sentence by a famous author.</p>
    <p>
      You can guess whatever words you like. Remember that some authors might prefer British over American spelling, or vice versa.
    </p>
    <p v-show="currentWord === ''">Choose an author and click <b>Generate</b> to play.</p>
    <p v-show="currentWord !== ''">Type in your guess and click <b>Check</b>.</p>
    <p v-show="currentWord !== ''">If you are stuck, click <b>Reveal Letter</b> to reveal a letter of the missing word.</p>
    <div v-show="currentWord === ''">
      <select v-model="author" style="width: 11.5rem">
        <option v-for="(book, i) in books" :value="i">{{ book.author }}</option>
      </select>
      <button @click="pick" class="ml-2">Generate</button>
    </div>
    <div v-show="currentWord !== ''">
      <div v-show="currentWord !== revealed">
        <input type="text" v-model="guess" style="width: 11.5rem" />
        <button @click="check" class="ml-2">Check</button>
        <br />
        <input type="text" v-model="guessSingle" class="mt-2" style="width: 11.5rem" maxlength="1" minlength="0" />
        <button @click="checkLetter" class="ml-2">Check letter</button>
        <br />
        <button @click="concede" class="mt-2">Give up</button>
      </div>
      <div v-show="currentWord === revealed">
        <button @click="reset">Play again</button>
      </div>
      <p class="mt-2">Missing word: {{ revealed }} ({{ length }} letters)</p>
      <h3>{{ currentBook.title }} by {{ books[author].author }}</h3>
      <p>{{ before }}{{ revealed }}{{ after }}</p>
    </div>
    <h3 v-html="message"></h3>
  </div>
</template>

<style scoped lang="postcss">
@media (max-width: 1024px) {}
</style>
