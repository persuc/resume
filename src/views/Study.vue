<script setup lang="ts">
import Header from '@/components/Header.vue'
import TrafficLight from '@/components/TrafficLight.vue'
import friendSongTimelineImage from '@/assets/FriendSongTimeline.png'
import StudyItem from '@/components/StudyItem.vue'

type Difficulty = 'easy' | 'medium' | 'hard'

type Resource = {
  link: string
  title: string
  description: string
  category: string
}

const resources: Record<string, Resource[]> = {
  "Frontend Web": [
    {
      link: "https://flexboxfroggy.com/",
      title: "Flexbox Froggy",
      description: "Game for learning how to make website layouts with CSS flexbox",
      category: "UI / webpage layout",
    },
    {
      link: "https://www.w3schools.com/js/default.asp",
      title: "W3 Schools JS tutorial",
      description: "Beginner resource for JavaScript (web) programming",
      category: "Web programming",
    },
    {
      link: "https://www.11ty.dev/docs/getting-started/",
      title: "11ty.js",
      description: "A framework for building static websites. It might be fun to follow their getting started tutorial and make your own blog!",
      category: "Frameworks / Personal Site",
    },
    {
      link: "https://legacy.reactjs.org/tutorial/tutorial.html",
      title: "React.js",
      description: "A more advanced framework for building static websites. It might be fun to follow their getting started tutorial and make your own blog!",
      category: "Frameworks / Personal Site",
    },
    {
      link: "https://developers.cloudflare.com/pages/framework-guides/deploy-anything/",
      title: "Cloudflare Pages",
      description: "Once you have your first website, you can use this to make it available on the public internet",
      category: "Frameworks / Personal Site",
    },
  ],
  "Algorithms & Data Structures": [
    {
      link: "https://drive.google.com/file/d/1C_3Wbdi2T_PbJxckv90IDEjIBJDdgiBs/view?usp=sharing",
      title: "Algorithms & Data Structures Notes",
      description: "Algorithms & data structures are useful in the daily life of any programmer, and also for passing interviews. Usually FAANG companies focus on these, and knowing them helps understand how to write performant code, and how computers work internally",
      category: "Notes",
    },
    {
      link: "https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/",
      title: "Leetcode.com",
      description: "A site dedicated to practice questions for algorithms & data structures. Many big companies use these questions.",
      category: "Practical Exercises",
    },
    {
      link: "https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU",
      title: "Blind75",
      description: "A curated list of commonly asked LeetCode questions.",
      category: "LeetCode compendium",
    },
    {
      link: "https://www.techinterviewhandbook.org/grind75",
      title: "Grind75",
      description: "A curated list of commonly asked LeetCode questions.",
      category: "LeetCode compendium",
    },
  ],
  "System Design and Computer Architecture": [
    {
      link: "https://drive.google.com/file/d/1rTt0WPdLmhctQIDHVG4mlWHbdLM4fGPd/view?usp=sharing",
      title: "Designing Data Intensive Applications by Marting Kleppman",
      description: "Amazing resource to understand databases. Advanced text, so I can walk you through it if you like",
      category: "Databases",
    },
    {
      link: "https://en.algorithmica.org/",
      title: "Algorithmica.org",
      description: "Deep analyses of how computer programs are executed. Useful to understand how to achieve good performance, and understand computer architecture. Also an advanced text",
      category: "Compilers & Performance",
    },
    {
      link: "https://www.youtube.com/channel/UCbvDQKzAJ5GwCjTrv4FWkxg",
      title: "Jordan has no life",
      description: "Great YouTube channel for system design and databases content",
      category: "System Design",
    },
    {
      link: "https://www.youtube.com/@SystemDesignInterview",
      title: "System Design Interview",
      description: "Great YouTube channel for system design content",
      category: "System Design",
    },
    {
      link: "https://github.com/dendibakh/perf-ninja",
      title: "Perf Ninja",
      description: "A series of take-home exercises for learning performance programming in <code>C++</code>",
      category: "Compilers & Performance",
    },
  ]
}

const leetcodes: {
  link: string,
  title: string,
  difficulty: Difficulty
}[] = [
  { link: "https://leetcode.com/problems/number-of-recent-calls/", title: "Number of recent calls", difficulty: "easy" },
  { link: "https://leetcode.com/problems/design-hashmap/", title: "Design hashmap", difficulty: "easy" },
  { link: "https://leetcode.com/problems/ransom-note/", title: "Ransom note", difficulty: "easy" },
  { link: "https://leetcode.com/problems/total-distance-traveled/", title: "Total distance travelled", difficulty: "easy" },
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

    <template v-for="resourceCategory in Object.entries(resources)">
      <p class="text-xl mt-8 font-sans">{{ resourceCategory[0] }}</p>
      <StudyItem v-for="resource in resourceCategory[1]" :link="resource.link" :description="resource.description" :category="resource.category" :title="resource.title" />
    </template>
      
    <p class="text-xl mt-8 font-sans">My Practice Questions</p>
    <p>Questions I have encountered myself, or come up with to test the concepts covered above</p>

    <StudyItem link="https://app.coderpad.io/PQQXDRQX" category="Frontend - 60 mins" title="Implement Reactivity">
      <p>Learn how modern web frameworks like React.js and Vue.js work by implementing reactivity yourself!</p>
      <pre v-highlightjs><code class="javascript rounded">function reactive()
function watch()
function ref()
function computed()
function render()</code></pre>
    </StudyItem>

    <StudyItem link="https://app.coderpad.io/PQQXDRQX" category="Frontend - 60 mins" title="Traffic Light Component">
      <p>Design a toy component as below to display a traffic light (in plain JavaScript)</p>
      <TrafficLight />
    </StudyItem>
    <StudyItem link="https://app.coderpad.io/PQQXDRQX" category="System Design - 90 mins" title="Design Friends Timeline">
      <p>Systems design question for a feed of your friends' most recently listened songs</p>
      <img :src="friendSongTimelineImage" class="h-80" />
    </StudyItem>
    <StudyItem link="https://app.coderpad.io/PQQXDRQX" category="Web Backend - 60 mins" title="E-Tag Middleware">
      <p>Design node.js middleware to cache resources using <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag">E-Tags</a></p>
    </StudyItem>

    <p class="text-xl mt-8 font-sans">My LeetCode Questions</p>
    <p>I have run these questions with other people in the past. LeetCode questions are more suited for backend interviews, and these were selected particularly because they suit the format of a backend interview.</p>

    <div v-for="l in leetcodes" >
      <a target="_blank" :href="l.link">{{ l.title }}</a>
      <span :class="`capitalize ml-2 rounded-full px-2 py-0.5 bg-gray-100 ${difficultyColor[l.difficulty]}`">{{ l.difficulty }}</span>
    </div>

    <div class="my-16 py-16"></div>
    
  </article>
</template>
