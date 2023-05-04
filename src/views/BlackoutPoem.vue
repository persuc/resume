<script setup lang="ts">
  import books from '@/assets/books'
  import { type Ref, ref, onMounted, onUnmounted, reactive } from 'vue'
  const VISIBILITY = 1600
  const HALF_VISIBILITY = Math.floor(VISIBILITY / 2)

  const author: Ref<number> = ref(0)
  const black: Set<number> = reactive(new Set())
  const nullBook: typeof books[0]['books'][0] = { title: '', url: ''}
  const currentBook: Ref<typeof books[0]['books'][0]> = ref(nullBook)
  const words: string[] = reactive([])
  const loading = ref(false)
  const debugSnippet = ref('')

  async function pick(): Promise<void> {
    loading.value = true
    const booksOfAuthor = books[author.value]
    currentBook.value = booksOfAuthor.books[Math.floor(Math.random() * booksOfAuthor.books.length)]
    const text = await (await fetch(currentBook.value.url)).text()
    const index = Math.floor(Math.random() * (text.length - VISIBILITY - 30) ) + HALF_VISIBILITY + 15

    const snippet = text.substring(index - HALF_VISIBILITY, index + HALF_VISIBILITY)
    debugSnippet.value = snippet
    words.splice(0)
    words.push(...snippet
      .replace(/\-(?:\r\n|\r|\n)/g, '-')
      .replace(/-/g, '&#x2011;')
      .replace(/([\?\!\.\"”])\s?\n/g, '$1LINE_BREAK_SYMBOL')
      // .replace(/\n/g, ' ')
      .replace(/(?:\r\n|\r|\n)/g, ' ')
      .replace(/LINE_BREAK_SYMBOL/g, '<br></br>')
      .split(' ').map(s => s)
    )
    black.clear()
    loading.value = false
  }

  // function reset() {
  // }

  // function onKeyUp(e: KeyboardEvent) {
  //   if (e.key === 'Space' || e.key === 'Enter') {
  //     e.preventDefault()
  //   } 
  // }

  // onMounted(() => document.addEventListener( "keyup", onKeyUp ))

  // onUnmounted(() => document.removeEventListener( "keyup", onKeyUp ))

</script>

<template>
  <div class="blackout-poem px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <div v-show="words.length === 0">
      <p>This is a freeform game where you are given a snippet of text by a famous author, and the goal is to create your own poem by "blacking out" or removing some of the words.</p>
    </div>
    <div class="mt-3" v-show="words.length === 0">
      <select v-model="author" style="width: 14rem">
        <option v-for="(book, i) in books" :value="i">{{ book.author }}</option>
      </select>
      <button @click="pick" class="ml-2 px-2">Play</button>
    </div>
    <div v-show="loading">
      Loading...
    </div>
    <div v-show="words.length > 0 && !loading">
      <div class="border br-1 py-1 px-3 mb-3" style="word-wrap: break-word;">
        <div class="flex" style="align-items: baseline;"><h3>{{ currentBook.title }}</h3>&nbsp;<i>by {{ books[author].author }}</i></div>
        <span @click="() => black.has(i) ? black.delete(i) : black.add(i)" :class="{ word, black: black.has(i) }" v-for="(word, i) in words" :key="word + i" v-html="word + '&nbsp;'"></span>
        <!-- <template v-for="(word, i) in words" :key="word + i">
          <span v-for="(broken, j) in word.split('\n')" :key="word + 'broken' + j" >{{ broken  }}<br v-if="j > 0" /></span>
          <span>&nbsp;</span>
        </template> -->
      </div>
      <!-- <div v-show="currentWord !== revealed">
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
      </div> -->
    </div>
    <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a>
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

.word {
  word-break: initial;
  /* white-space: nowrap; */
  &:hover { background-color: var(--vt-c-divider-light-2) !important; }
  &.black { background-color: black; }
}

@media screen and (-webkit-min-device-pixel-ratio:0) { 
  select,
  textarea,
  input {
    font-size: 16px;
  }
}
</style>
