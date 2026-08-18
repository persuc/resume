<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'
import Icon from './Icon.vue'
import External from './External.vue'

const showHelp = ref(false)
</script>

<template>
  <Button class="z-10" variant="outline" @click="showHelp = true">
    <span class="font-semibold text-xl">?</span>
  </Button>

  <div v-if="showHelp" class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600/[.5] p-4"
    @click="showHelp = false">
    <div class="relative bg-white border max-w-2xl border-gray-300 p-8 h-fit select-none" @click.stop>
      <Icon name="close" class="w-10 absolute right-2 top-2 cursor-pointer p-2" @click="showHelp = false"></Icon>

      <p>This page is for creating guitar tablatures using the VexTab markup language. You can find tutorials
        on the VexTab language at
        <External href="https://vexflow.com/vextab/tutorial.html">https://vexflow.com/vextab/tutorial.html</External>.
      </p>

      <p>
        Anything after <code class="font-mono bg-gray-100 px-1">//</code> on a line is a comment - it is ignored when
        the tab is drawn and played, so you can annotate your markup freely.
      </p>

      <p>
        <code class="font-mono bg-gray-100 px-1">#_#</code> is a hidden rest - it takes up time and keeps the voices
        aligned like a normal <code class="font-mono bg-gray-100 px-1">##</code> rest, but is not drawn. Use it for
        bars where a secondary voice is silent.
      </p>

      <p>
        <code class="font-mono bg-gray-100 px-1">5&lt;17&gt;/3</code> is an artificial harmonic - fret 5 on string 3
        with the picking hand touching fret 17. It is drawn as the fretted note marked
        <code class="font-mono bg-gray-100 px-1">&lt;17&gt;</code>, and plays back at the harmonic that touch point
        produces.
      </p>

      <p>
        <code class="font-mono bg-gray-100 px-1">options tempo=90</code> sets the tempo. It can appear more than once -
        each one takes effect from the tabstave that follows it, so you can change tempo partway through a song.
      </p>

      <p>
        Press Play to hear the tab. Click any note in the rendered score to move the playhead there, then use the
        spacebar to play and pause.
      </p>

      <p>
        This is a beta version of the editor - please export your files regularly for safekeeping!
      </p>
    </div>
  </div>
</template>
