<script setup lang="ts">
import Header from '@/components/Header.vue'

</script>

<template>

  <Header back-route="/" />

  <article class="article px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">

    <p class="text-xl">Study resources for enterprising individuals with big brains</p>

    <p>Don't feel overwhelmed, these are just some resources to read through to get a feel for the different topics you can go deeper into. If you find something you like, let me know and I can tailor a study plan for you and explain what the field is about a little. Don't try to master everything at once, hehe. Also the best way to learn is by practical example, so if you want to do some particular project (chrome extension, discord bot, blog website are all good first-project choices) I can walk you through and help you where you get stuck. That way it's not all just boring theory.</p>

    <div class="font-mono grid gap-4" style="grid-template-columns: auto 16rem;">
      <div><p class="text-xl mt-8 font-sans">Frontend Web</p></div>
      <div></div>

      <div>
        <a target="_blank" href="https://flexboxfroggy.com/">Flexbox Froggy</a>
        <p>Game for learning how to make website layouts with CSS flexbox</p>
      </div>
      <div>UI / webpage layout</div>
      <div>
        <a target="_blank" href="https://www.w3schools.com/js/default.asp">W3 Schools JS tutorial</a>
        <p>Beginner resource for JavaScript (web) programming</p>
      </div>
      <div>Web programming</div>
      <div>
        <a target="_blank" href="https://www.11ty.dev/docs/getting-started/">11ty.js</a>
        <p>A framework for building static websites. It might be fun to follow their getting started tutorial and make your own blog!</p>
      </div>
      <div>Frameworks / Personal Site</div>
      <div>
        <a target="_blank" href="https://legacy.reactjs.org/tutorial/tutorial.html">React.js</a>
        <p>A more advanced framework for building static websites. It might be fun to follow their getting started tutorial and make your own blog!</p>
      </div>
      <div>Frameworks / Personal Site</div>
      <div>
        <a target="_blank" href="https://developers.cloudflare.com/pages/framework-guides/deploy-anything/">Cloudflare Pages</a>
        <p>Once you have your first website, you can use this to make it available on the public internet</p>
      </div>
      <div>Frameworks / Personal Site</div>

      <div><p class="text-xl mt-8 font-sans">Algorithms &amp; Data Structures</p></div>
      <div></div>

      <div>
        <a target="_blank" href="https://drive.google.com/file/d/1C_3Wbdi2T_PbJxckv90IDEjIBJDdgiBs/view?usp=sharing">Algorithms &amp; Data Structures notes</a>
        <p>Algorithms &amp; data structures are useful in the daily life of any programmer, and also for passing interviews. Usually FAANG companies focus on these, and knowing them helps understand how to write performant code, and how computers work internally</p>
      </div>
      <div>Notes</div>
      <div>
        <a target="_blank" href="https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/">Leetcode.com</a>
        <p>A site dedicated to practice questions for algorithms &amp; data structures. Many big companies use these questions.</p>
      </div>
      <div>Practical Exercises</div>

      <div><p class="text-xl mt-8 font-sans">System Design and Computer Architecture</p></div>
      <div></div>

      <div>
        <a target="_blank" href="https://drive.google.com/file/d/1rTt0WPdLmhctQIDHVG4mlWHbdLM4fGPd/view?usp=sharing">Designing Data Intensice Applications by Marting Kleppman</a>
        <p>Amazing resource to understand databases. Advanced text, so I can walk you through it if you like</p>
      </div>
      <div>Databases</div>
      <div>
        <a target="_blank" href="https://en.algorithmica.org/">Algorithmica.org</a>
        <p>Deep analyses of how computer programs are executed. Useful to understand how to achieve good performance, and understand computer architecture. Also an advanced text</p>
      </div>
      <div>Compilers &amp; Performance</div>
      <div>
        <a target="_blank" href="https://www.youtube.com/channel/UCbvDQKzAJ5GwCjTrv4FWkxg">Jordan has no life</a>
        <p>Great YouTube channel for system design and databases content</p>
      </div>
      <div>System Design</div>
      <div>
        <a target="_blank" href="https://www.youtube.com/@SystemDesignInterview">System Design Interview</a>
        <p>Great YouTube channel for system design content</p>
      </div>
      <div>System Design</div>
      <div>
        <a target="_blank" href="https://github.com/dendibakh/perf-ninja">Perf Ninja</a>
        <p>A series of take-home exercises for learning performance programming in <code>C++</code></p>
      </div>
      <div>Compilers &amp; Performance</div>
    </div>

    <div class="my-16 py-16"></div>
    
  </article>
</template>
