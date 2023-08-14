<script setup lang="ts">
  import books from '@/assets/books'
  import { type Ref, ref, onMounted, onUnmounted, reactive } from 'vue'
  const VISIBILITY = 1600
  const HALF_VISIBILITY = Math.floor(VISIBILITY / 2)
  const LINE_BREAK_SYMBOL = 'LINE_BREAK_SYMBOL'

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
    for (const word of snippet
      .replace(/\-(?:\r\n|\r|\n)/g, '-')
      .replace(/-/g, '&#x2011;')
      .replace(/([\?\!\.\"”])\s?\n/g, '$1' + LINE_BREAK_SYMBOL)
      .replace(/(?:\r\n|\r|\n)/g, ' ')
      .split(' ').map(s => s)
    ) {
      const lines = word.split(LINE_BREAK_SYMBOL)
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
          words.push(LINE_BREAK_SYMBOL)
        }
        words.push(lines[i])
      }
    }
    black.clear()
    loading.value = false
  }

  function reset() {
    const response = confirm("Are you sure you want to finish? Your poem will be discarded.");

    if (response) {
      black.clear()
      words.splice(0)
    }
  }

  function clear() {
    black.clear()
  }

  function onMouseUp(e: MouseEvent) {
    const selection = window.getSelection()
    if (selection === null || selection.type !== 'Range') {
      return
    }

    const anchorNode = selection.anchorNode?.nodeType === 3 ? selection.anchorNode.parentNode! : selection.anchorNode
    const focusNode = selection.focusNode?.nodeType === 3 ? selection.focusNode.parentNode! : selection.focusNode
    const parentNodes: HTMLElement[] = Array.prototype.slice.call(anchorNode!.parentNode!.children)
    const focusIndex = parentNodes.indexOf(focusNode as HTMLElement)
    const anchorIndex = parentNodes.indexOf(anchorNode as HTMLElement)
    let idx = Math.min(focusIndex, anchorIndex)

    if (idx < 1) {
      return
    }
    let node = anchorIndex > focusIndex ? focusNode : anchorNode
    const target = anchorIndex > focusIndex ? anchorNode : focusNode
    const selected = [idx - 1]
    while (node !== null && node !== target) {
      if (node.nodeName === 'SPAN') {
        selected.push(idx)
      }
      idx++
      do {
        node = node!.nextSibling
      } while (node!.nodeName === '#text')
    }

    const whiten = selected.some(s => black.has(s))
    for (const s of selected) {
      if (whiten) {
        black.delete(s)
      } else {
        black.add(s)
      }
    }
    selection.empty()
  }

  onMounted(() => document.addEventListener( "mouseup", onMouseUp ))

  onUnmounted(() => document.removeEventListener( "mouseup", onMouseUp ))

</script>

<template>
  <div class="blackout-poem px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <div v-show="words.length === 0">
      <p>This is a freeform game where you are given a snippet of text by a famous author, and the goal is to create your own poem by "blacking out" or removing some of the words.</p>
    </div>
    <div class="mt-3 flex items-center" v-show="words.length === 0">
      <select v-model="author" style="width: 14rem">
        <option v-for="(book, i) in books" :value="i">{{ book.author }}</option>
      </select>
      <button @click="pick" class="ml-2">Play</button>
    </div>
    <div v-show="loading">
      Loading...
    </div>
    <div v-show="words.length > 0 && !loading">
      <div class="border rounded py-1 px-3 mb-3">
        <div class="flex" style="align-items: baseline;"><p class="text-lg">{{ currentBook.title }}</p>&nbsp;<i>by {{ books[author].author }}</i></div>
        <template v-for="(word, i) in words" :key="word + i">
          <span
            v-if="word !== LINE_BREAK_SYMBOL"
            v-html="word + '&nbsp;'"
            @click="() => black.has(i) ? black.delete(i) : black.add(i)"
            :class="{ word, black: black.has(i) }"
          ></span>
          <template v-else>
            <br class="my-4" />
          </template>
        </template>
      </div>
    </div>
    <button v-if="words.length > 0" @click="clear" class="mt-4 mb-16 mr-2">Clear</button>
    <button v-if="words.length > 0" @click="reset" class="mt-4 mb-16">Finish</button>
    <a v-else href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a>
  </div>
</template>

<style scoped lang="postcss">
@media (max-width: 1024px) {}

.word {
  display:inline-block;
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
