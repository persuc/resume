<script setup lang="ts">
import Header from '@/components/Header.vue'
import TrafficLight from '@/components/TrafficLight.vue'
import friendSongTimelineImage from '@/assets/FriendSongTimeline.png'

type Difficulty = 'easy' | 'medium' | 'hard'

const leetcodes: {
  link: string,
  title: string,
  difficulty: Difficulty
}[] = [
  { link: "https://leetcode.com/problems/number-of-recent-calls/", title: "Number of recent calls", difficulty: "easy" },
  { link: "https://leetcode.com/problems/design-hashmap/", title: "Design hashmap", difficulty: "easy" },
  { link: "https://leetcode.com/problems/ransom-note/", title: "Ransom note", difficulty: "easy" },
  { link: "https://leetcode.com/problems/total-distance-traveled/", title: "Total distance traveled", difficulty: "easy" },
  { link: "https://leetcode.com/problems/binary-search-tree-iterator/", title: "Binary search tree iterator", difficulty: "medium" },
  { link: "https://leetcode.com/problems/linked-list-cycle/", title: "Linked list cycle", difficulty: "medium" },
  { link: "https://leetcode.com/problems/design-a-stack-with-increment-operation/", title: "Design a stack with increment operation", difficulty: "medium" },
  { link: "https://leetcode.com/problems/flatten-nested-list-iterator/", title: "Flatten nested list iterator", difficulty: "medium" },
  { link: "https://leetcode.com/problems/product-of-the-last-k-numbers/", title: "Product of the last k numbers", difficulty: "medium" },
  { link: "https://leetcode.com/problems/min-stack/", title: "Min stack", difficulty: "medium" },
  { link: "https://leetcode.com/problems/peeking-iterator/", title: "Peeking iterator", difficulty: "medium" },
  { link: "https://leetcode.com/problems/insert-delete-getrandom-o1/", title: "Insert, delete, getRandom O(1)", difficulty: "medium" },
  { link: "https://leetcode.com/problems/implement-magic-dictionary/", title: "Implement magic dictionary", difficulty: "medium" },
  { link: "https://leetcode.com/problems/design-front-middle-back-queue/", title: "Design front middle back queue", difficulty: "medium" },
  { link: "https://leetcode.com/problems/online-stock-span/", title: "Online stock span", difficulty: "medium" },
  { link: "https://leetcode.com/problems/asteroid-collision/", title: "Asteroid collision", difficulty: "medium" },
  { link: "https://leetcode.com/problems/lru-cache/", title: "LRU cache", difficulty: "medium" },
  { link: "https://leetcode.com/problems/max-chunks-to-make-sorted-ii/", title: "Max chunks to make sorted II", difficulty: "hard" },
  { link: "https://leetcode.com/problems/reconstruct-itinerary/", title: "Reconstruct itinerary", difficulty: "hard" },
  { link: "https://leetcode.com/problems/candy/", title: "Candy", difficulty: "hard" },
  { link: "https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/", title: "Count all valid pickup and delivery options", difficulty: "hard" },
  { link: "https://leetcode.com/problems/painting-the-walls/", title: "Painting the walls", difficulty: "hard" },
  { link: "https://leetcode.com/problems/number-of-ways-to-earn-points/", title: "Number of ways to earn points", difficulty: "hard" },
  { link: "https://leetcode.com/problems/robot-collisions/", title: "Robot collisions", difficulty: "hard" },
]

const difficultyColor: Record<Difficulty, string> = {
  'easy': 'text-teal-500',
  'medium': 'text-amber-400',
  'hard': 'text-red-500',
}

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
        <a target="_blank" href="https://drive.google.com/file/d/1C_3Wbdi2T_PbJxckv90IDEjIBJDdgiBs/view?usp=sharing">Algorithms &amp; Data Structures Notes</a>
        <p>Algorithms &amp; data structures are useful in the daily life of any programmer, and also for passing interviews. Usually FAANG companies focus on these, and knowing them helps understand how to write performant code, and how computers work internally</p>
      </div>
      <div>Notes</div>
      <div>
        <a target="_blank" href="https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/">Leetcode.com</a>
        <p>A site dedicated to practice questions for algorithms &amp; data structures. Many big companies use these questions.</p>
      </div>
      <div>Practical Exercises</div>
      <div>
        <a target="_blank" href="https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU">Blind75</a>
        <p>A curated list of commonly asked LeetCode questions.</p>
      </div>
      <div>LeetCode compendium</div>
      <div>
        <a target="_blank" href="https://www.techinterviewhandbook.org/grind75">Grind75</a>
        <p>A curated list of commonly asked LeetCode questions.</p>
      </div>
      <div>LeetCode compendium</div>

      <div><p class="text-xl mt-8 font-sans">System Design and Computer Architecture</p></div>
      <div></div>

      <div>
        <a target="_blank" href="https://drive.google.com/file/d/1rTt0WPdLmhctQIDHVG4mlWHbdLM4fGPd/view?usp=sharing">Designing Data Intensive Applications by Marting Kleppman</a>
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

      <div>
        <p class="text-xl mt-8 font-sans">My Practice Questions</p>
        <p>Questions I have encountered myself, or come up with to test the concepts covered above</p>
      </div>
      <div></div>

      <div>
        <a target="_blank" href="https://app.coderpad.io/PQQXDRQX">Custom: Implement Reactivity</a>
        <p>Learn how modern web frameworks like React.js and Vue.js work by implementing reactivity yourself!</p>
        <pre v-highlightjs><code class="javascript rounded">function reactive()
function watch()
function ref()
function computed()
function render()</code></pre>
      </div>
      <div>Frontend - 60 mins</div>

      <div>
        <a target="_blank" href="https://app.coderpad.io/PQQXDRQX">Spotify: Traffic Light Component</a>
        <p>Design a toy component as below to display a traffic light (in plain JavaScript)</p>
        <TrafficLight />
      </div>
      <div>Frontend - 60 mins</div>

      <div>
        <a target="_blank" href="https://app.coderpad.io/PQQXDRQX">Spotify: Design Friends Timeline</a>
        <p>Systems design question for a feed of your friends' most recently listened songs</p>
        <img :src="friendSongTimelineImage" class="h-80" />
      </div>
      <div>System Design - 90 mins</div>

      <div>
        <a target="_blank" href="https://app.coderpad.io/PQQXDRQX">Microsoft: E-Tag Middleware</a>
        <p>Design node.js middleware to cache resources using <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag">E-Tags</a></p>
      </div>
      <div>Web Backend - 60 mins</div>
    </div>

    <p class="text-xl mt-8 font-sans">My LeetCode Questions</p>
    <p>I have run these questions with other people in the past and they seem suited for an interview environment.</p>

    <div v-for="l in leetcodes" >
      <a target="_blank" :href="l.link">{{ l.title }}</a>
      <span :class="`capitalize ml-2 rounded-full px-2 py-0.5 bg-gray-100 ${difficultyColor[l.difficulty]}`">{{ l.difficulty }}</span>
    </div>

    <div class="my-16 py-16"></div>
    
  </article>
</template>
