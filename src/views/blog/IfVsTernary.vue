<script setup lang="ts">
import Codeblock from '@/components/Codeblock.vue'
import Expand from '@/components/Expand.vue'
import Header from '@/components/Header.vue'
import { type Ref, ref } from 'vue'

const expanded: Ref<boolean> = ref(false)

function test() {
  console.log('ah')
  expanded.value = true
}

</script>

<template>

  <Header />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h1 class="mb-2">Don't worry, the compiler will optimise it.</h1>

    <p>I've recently been diving into some performance optimisation resources such as <a target="_blank" href="https://en.algorithmica.org/">Algorithmica</a> and <a target="_blank" href="https://github.com/dendibakh/perf-ninja">Perf. Ninja</a>.
      The opinion of those who work in high performance computing seems to be that while a modern compiler will usually do a good job of optimising away unnecessary instructions, you can't always rely on this behaviour.
    </p>
    <p>
      You can't always know what assembly will be generated for some given source code since it depends on the compiler, architecture, and compiler configuration. That's why libraries such as <a href="https://github.com/xianyi/OpenBLAS/">OpenBLAS</a> exist - aiming to implement their entire functionality directly in assembly, which means reimplementing every single function for windows, mac, and linux separately, as well as for ARM and Intel architectures.
    </p>
    <p>
      Below are two implementations of finding the maximum of two integers in <code>C++</code>. <b>Question:</b> Will the assembly generated for these two functions be any different? If so, how?
    </p>

    <br />

    <Codeblock label="find_max.cpp" language="cpp" :code="`int max(int x, int y) {
  if (x &lt; y) {
    return y;
  }
  return x;
}
int max2(int x, int y) {
  return x &lt; y ? y : x;
}`" />

<br />

<Expand class="my-2" label="find_max.s" @expand="test">
  <pre v-highlightjs><code class="assembly br-1">.section	__TEXT,__text,regular,pure_instructions
    .build_version macos, 13, 0	sdk_version 13, 3
    .globl	__Z3maxii                       ; -- Begin function _Z3maxii
    .p2align	2
  __Z3maxii:                              ; @_Z3maxii
    .cfi_startproc
  ; %bb.0:
    cmp	w0, w1
    csel	w0, w1, w0, lt
    ret
    .cfi_endproc
                                          ; -- End function
    .globl	__Z4max2ii                      ; -- Begin function _Z4max2ii
    .p2align	2
  __Z4max2ii:                             ; @_Z4max2ii
    .cfi_startproc
  ; %bb.0:
    cmp	w0, w1
    csel	w0, w1, w0, lt
    ret
    .cfi_endproc
                                          ; -- End function
    .globl	_main                           ; -- Begin function main
    .p2align	2
  _main:                                  ; @main
    .cfi_startproc
  ; %bb.0:
    mov	w0, #0
    ret
    .cfi_endproc
                                          ; -- End function
  .subsections_via_symbols
  </code></pre>
</Expand>

<br />

<div v-show="expanded">

  <h2 class="mb-2">What if it actually did though?</h2>

  <p>That's a lot of assembly for such a small amount of source, let's focus on the implementations of <code>max</code> and <code>max2</code>.</p>

  <br />

  <Codeblock v-for="i in [1, 2]" :key="'max' + i" :label="`max${i > 1 ? '2' : ''}.s`" language="assembly" :code="`cmp	w0, w1
csel	w0, w1, w0, lt
ret`" class="mb-8" />

  <p>You may notice that the implementations are exactly the same! In this case, the compiler decided that both functions could be implemented by a <code>cmp</code> followed by a <code>csel</code>. This makes sense, because <code>cmp</code> compares two values, and sets the Carry, Parity, Zero and Sign flags based on the two values, similar to how a subtraction works except that <code>cmp</code> doesn't modify the source registers. Then the role of the <code>lt</code> argument in <code>csel</code> is to check the Sign and Overflow flags, and if they differ, set the destination register (w0 in our case) to the first source register (also w0) or else the second (w1).</p>

  <h2 class="mb-2 mt-8">So what is the point understanding all this?</h2>

  <p>All of that is to say that we asked the computer to return the smaller value in both cases, and the assembly reflects that these operations are fundamentally the same despite differences in the source code. This doesn't mean that the compiler will always perform this way. In the above example, I used C++ Standard 20 with the flags: <code>-O3 -ffast-math -mcpu=apple-m1</code>.</p>
  
  <p>Depending on optimization level, and choice of compiler, architecture, and many other variables, the results may be different case by case, which is why all performance textbooks recommend you benchmark and test rather than rely completely on doctrines or prior knowledge.</p>

  <p>If you'd like to understand more about ARM flags, I recommend <a target="_blank" href="https://www.dmulholl.com/notes/arm-condition-flags.html">this post</a> by Darren Mulholland, and <a target="_blank" href="https://en.m.wikipedia.org/wiki/FLAGS_register">this reference table</a> on Wikipedia.</p>
</div>

  <div class="my-16 py-16"></div>

  </article>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2rem;
}

h3 {
  font-size: 1.2rem;
}

</style>
