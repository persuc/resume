<script setup lang="ts">
  import books from '@/assets/books'
  import corncob from '@/assets/corncob_caps'
  import { type Ref, ref, onMounted, onUnmounted } from 'vue'
  const MAX_LENGTH = 20
  const MIN_LENGTH = 3
  const VISIBILITY = 200
  const HIDDEN_CHAR = '_'

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

  function hasWon() {
    return revealed.value.indexOf(HIDDEN_CHAR) === -1
  }

  async function pick(): Promise<void> {
    const booksOfAuthor = books[author.value]
    currentBook.value = nullBook

    currentBook.value = booksOfAuthor.books[Math.floor(Math.random() * booksOfAuthor.books.length)]
    const text = await (await fetch(currentBook.value.url)).text()
    const halfVisibility = Math.floor(VISIBILITY / 2)
    const index = Math.floor(Math.random() * (text.length - VISIBILITY - 30) ) + halfVisibility + 15

    let start = index
    while (/[a-zA-Z\-'’]/.test(text.charAt(start - 1))) {
      start--
    }
    let end = index + 1
    while (/[a-zA-Z\-'’]/.test(text.charAt(end))) {
      end++
    }
    length.value = end - start

    if (length.value < MIN_LENGTH || length.value > MAX_LENGTH) {
      return pick()
    }

    currentWord.value = text.substring(start, end)
    
    let stripped = ''
    let weirdCount = 0
    for (let i = 0; i < currentWord.value.length; i++) {
      if (currentWord.value.charAt(i) !== '\'' && currentWord.value.charAt(i) !== '-') {
        stripped += currentWord.value.charAt(i).toUpperCase()
      } else {
        weirdCount++
      }
    }

    if (weirdCount > 1 || !cornset.has(stripped)) {
      return pick()
    }
    
    before.value = text.substring(start - halfVisibility, start)
    after.value = text.substring(end, end + halfVisibility)
    revealed.value = HIDDEN_CHAR.repeat(length.value)
    guessSingle.value = '-'
    checkLetter()
    guessSingle.value = '\''
    checkLetter()
    guessSingle.value = '’'
    checkLetter()
    message.value = ''
  }

  function checkLetter() {
    if (!guessSingle.value.length) {
      return
    }

    guess.value = guessSingle.value.charAt(0).repeat(length.value)
    check()
    if (!hasWon()) {
      message.value = `🔎 All ${guessSingle.value}'s were revealed.`
    }
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

    if (hasWon()) {
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
    <div v-show="currentWord === ''">
      <p>The game is to guess the missing word from a sentence by a famous author.</p>
      <p>
        You can guess whatever you like, it doesn't have to be a real word. Remember that some authors might prefer British over American spelling, or vice versa.
      </p>
    </div>
    <div class="mt-3" v-show="currentWord === ''">
      <select v-model="author" style="width: 14rem">
        <option v-for="(book, i) in books" :value="i">{{ book.author }}</option>
      </select>
      <button @click="pick" class="ml-2 px-2">Play</button>
    </div>
    <div v-show="currentWord !== ''">
      <div class="border br-1 py-1 px-3 mb-3">
        <h3>{{ currentBook.title }} by {{ books[author].author }}</h3>
        <p class="italic">{{ before }}{{ revealed }}{{ after }}</p>
        <p class="mt-2">Missing word: {{ revealed }} ({{ length }} letters)</p>
      </div>
      <div v-show="currentWord !== revealed">
        <input type="text" v-model="guess" style="width: 11.5rem" placeholder="Guess a whole word" />
        <button @click="check" class="ml-2">Guess</button>
        <br />
        <input type="text" v-model="guessSingle" class="mt-2" style="width: 11.5rem" maxlength="1" minlength="0" placeholder="Reveal one letter" />
        <button @click="checkLetter" class="ml-2">Guess letter</button>
        <br />
        <button @click="concede" class="ml-2 mt-2" style="margin-left: 12rem">Give up</button>
      </div>
      <div v-show="currentWord === revealed">
        <button @click="reset">Play again</button>
      </div>
    </div>
    <div v-show="message !== ''" class="br-1 py-1 px-3 mt-3 bg-cerulean-superlight" v-html="message"></div>
  </div>
</template>

<style scoped lang="postcss">
@media (max-width: 1024px) {}

.missing-word {
  font-size: 16px;
  & button {
    font-size: 16px;
  }
}

@media screen and (-webkit-min-device-pixel-ratio:0) { 
  select,
  textarea,
  input {
    font-size: 16px;
  }
}
</style>
