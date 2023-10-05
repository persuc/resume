<script setup lang="ts">
import Article from '@/components/Article.vue'
import TrafficLight from '@/components/TrafficLight.vue'
import friendSongTimelineImage from '@/assets/FriendSongTimeline.png'
import connect4Image from '@/assets/connect4.png'
import w3schools from '@/assets/W3Schools.png'
import danAnderson from '@/assets/dananderson.jpg'
import blind from '@/assets/blind.png'
import ddia from '@/assets/wild-boar-by-george-shaw.jpg'
import systemsDesignInterview from '@/assets/SystemsDesignInterview.png'
import youtube from '@/assets/youtube.png'
import perfNinja from '@/assets/perf-ninja.jpg'
import StudyItem from '@/components/StudyItem.vue'
import type { NavItems } from '@/@types'

type Difficulty = 'easy' | 'medium' | 'hard'

type Resource = {
  link: string
  title: string
  postTitle?: string
  description?: string
  image?: string,
  svg?: string,
  category?: string
}

const resources: Record<string, Resource[]> = {
  "Frontend Web": [
    {
      link: "https://flexboxfroggy.com/",
      title: "Flexbox Froggy",
      svg: "flexbox-froggy",
      description: "Game for learning how to make website layouts with CSS flexbox",
      category: "UI / webpage layout",
    },
    {
      link: "https://www.w3schools.com/js/default.asp",
      title: "W3 Schools JS tutorial",
      image: w3schools,
      description: "Beginner resource for JavaScript (web) programming",
      category: "Web programming",
    },
    {
      link: "https://www.11ty.dev/docs/getting-started/",
      title: "11ty.js",
      svg: "11ty",
      description: "A framework for building static websites. It might be fun to follow their getting started tutorial and make your own blog!",
      category: "Frameworks / Personal Site",
    },
    {
      link: "https://legacy.reactjs.org/tutorial/tutorial.html",
      title: "React.js",
      svg: "react",
      description: "A more advanced framework for building static websites. It might be fun to follow their getting started tutorial and make your own blog!",
      category: "Frameworks / Personal Site",
    },
    {
      link: "https://developers.cloudflare.com/pages/framework-guides/deploy-anything/",
      title: "Cloudflare Pages",
      description: "Once you have your first website, you can use this to make it available on the public internet",
      category: "Frameworks / Personal Site",
      svg: "cloudflare"
    },
  ],
  "Algorithms & Data Structures": [
    {
      link: "https://drive.google.com/file/d/1C_3Wbdi2T_PbJxckv90IDEjIBJDdgiBs/view?usp=sharing",
      title: "Algorithms & Data Structures Notes",
      description: "Algorithms & data structures are useful in the daily life of any programmer, and also for passing interviews. Usually FAANG companies focus on these, and knowing them helps understand how to write performant code, and how computers work internally",
      category: "Algorithms Notes",
      image: danAnderson
    },
    {
      link: "https://www.algotree.org/",
      title: "Algotree",
      description: "A chart of common algorithms, grouped by what they are useful for.",
      category: "Algorithms Notes",
      svg: 'algotree',
    },
    {
      link: "https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/",
      title: "LeetCode.com",
      description: "A site dedicated to practice questions for algorithms & data structures. Many big companies use these questions.",
      category: "Practical Exercises",
      svg: "leetCode"
    },
    {
      link: "https://neetcode.io",
      title: "Neetcode.io",
      description: "Leetcode questions compiled into courses, sorted by topic, with guidance on how to study.",
      category: "LeetCode compendium",
      image: "https://neetcode.io/assets/neetcode-io-logo.png",
    },
    {
      link: "https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU",
      title: "Blind75",
      description: "A curated list of commonly asked LeetCode questions.",
      category: "LeetCode compendium",
      image: blind,
    },
    {
      link: "https://www.techinterviewhandbook.org/grind75",
      title: "Grind75",
      description: "A curated list of commonly asked LeetCode questions.",
      category: "LeetCode compendium",
      image: blind,
    },
  ],
  "Infrastructure": [
    {
      link: "https://fly.io/dist-sys/",
      title: "Gossip Glomers",
      description: "A series of practical distributed-system challenges made by fly.io",
      category: "Infrastructure",
      svg: "fly",
    },
    {
      link: "https://play.picoctf.org/practice",
      title: "Pico CTF",
      description: "A series of security / pentesting challenges",
      category: "Infrastructure",
      image: "https://picoctf.org/img/logos/pico-mark.svg",
    },
  ],
  "System Design & Computer Architecture": [
    {
      link: "https://drive.google.com/file/d/1rTt0WPdLmhctQIDHVG4mlWHbdLM4fGPd/view?usp=sharing",
      title: "Designing Data Intensive Applications",
      postTitle: " by <a target=\"_blank\" href=\"https://martin.kleppmann.com/\">Martin Kleppmann</a>",
      description: "Amazing resource to understand databases. Advanced text, so I can walk you through it if you like",
      category: "Databases",
      image: ddia,
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
      image: youtube,
    },
    {
      link: "https://www.youtube.com/@SystemDesignInterview",
      title: "System Design Interview",
      description: "Great YouTube channel for system design content",
      category: "System Design",
      image: systemsDesignInterview,
    },
    {
      link: "https://github.com/dendibakh/perf-ninja",
      title: "Perf Ninja",
      description: "A series of take-home exercises for learning performance programming in <code>C++</code>",
      category: "Compilers & Performance",
      image: perfNinja,
    },
    {
      link: "https://martinfowler.com/articles/patterns-of-distributed-systems/",
      title: "Patterns of Distributed Systems",
      postTitle: " by Unmesh Joshi",
      description: "A blog post listing some common patterns for distributed systems.",
      category: "System Design",
      image: "https://martinfowler.com/articles/patterns-of-distributed-systems/card.png",
    },
    {
      link: "https://notes.shichao.io/",
      title: "Shichao's Notes",
      description: "Personal blog with in-depth explanations of various linux kernel concepts.",
      category: "Linux Kernel",
      image: "https://avatars.githubusercontent.com/u/5781687",
    },
  ],
  "Entertainment-Study Videos": [
    {
      link: "https://youtu.be/DMQ_HcNSOAI",
      title: "The PERFECT hash table",
      postTitle: " (Strager)",
    },
    {
      link: "https://youtu.be/t_rzYnXEQlE",
      title: "FIXING the ENTIRE SM64 Source Code",
      postTitle: " (Kaze Emanuar)",
    },
    {
      link: "https://youtu.be/JcJSW7Rprio",
      title: "Harder Drive: Hard drives we didn't want or need ",
      postTitle: " (suckerpinch)",
    },
    {
      link: "https://youtu.be/Nwjypk1933U",
      title: "Can I fix a CORRUPT PlayStation 2 save file?",
      postTitle: " (MattKC)",
    },
    {
      link: "https://youtu.be/NRmkr50mkEE",
      title: "Ray Tracing: How NVIDIA Solved the Impossible!",
      postTitle: " (Two Minute Papers)",
    },
    {
      link: "https://youtu.be/sRWE5tnaxlI",
      title: "JavaScript Is Weird (EXTREME EDITION)",
      postTitle: " (Low Byte Productions)",
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

const navItems: NavItems[] = [
  { href: "/", label: "Back", classes: "lg:mb-3" },
  { href: "#top", label: "Top", },
  ...(Object.keys(resources).map(r => ({
    href: '#' + r,
    label: r,
  }))),
  {
    href: '#my-custom-questions',
    label: 'My Custom Questions',
  },
  {
    href: '#my-leet-code-questions',
    label: 'My LeetCode Questions',
  },
]

</script>

<template>
  <Article :items="navItems" id="top">
    <p class="text-xl">Study resources for enterprising individuals with big brains</p>

    <p>Don't feel overwhelmed, these are just some resources to read through to get a feel for the different topics you
      can go deeper into. If you find something you like, let me know and I can tailor a study plan for you and explain
      what the field is about a little. Don't try to master everything at once, hehe. Also the best way to learn is by
      practical example, so if you want to do some particular project (chrome extension, discord bot, blog website are all
      good first-project choices) I can walk you through and help you where you get stuck. That way it's not all just
      boring theory.</p>

    <template v-for="resourceCategory in Object.entries(resources)">
      <p class="text-xl mt-8 font-sans" :id="resourceCategory[0]">{{ resourceCategory[0] }}</p>
      <StudyItem v-for="resource in resourceCategory[1]" :link="resource.link" :description="resource.description"
        :category="resource.category" :title="resource.title" :post-title="resource.postTitle" :image="resource.image"
        :svg="resource.svg" />
    </template>

    <p class="text-xl mt-8 font-sans" id="my-custom-questions">My Custom Questions</p>
    <p>Questions I have encountered myself, or come up with to test the concepts covered above</p>

    <StudyItem link="https://app.coderpad.io/PQQXDRQX" category="Frontend - 30 mins" title="Implement Reactivity">
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
    <StudyItem link="https://app.coderpad.io/PQQXDRQX" category="Web Backend - 30 mins" title="E-Tag Middleware">
      <p>Design node.js middleware to cache resources using <a target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag">E-Tags</a></p>
    </StudyItem>
    <StudyItem link="https://github.com/persuck/FIT1045/" category="Algorithms - 60 mins" title="Connect-4">
      <p>Learn to create a command-line version of Connect-4 in python. This resource includes slides explaining the
        process and ideas behind making the game, as well as some other useful resources on debugging and interviewing.
      </p>
      <img :src="connect4Image" class="h-64" />
    </StudyItem>

    <p class="text-xl mt-8 font-sans" id="my-leet-code-questions">My LeetCode Questions</p>
    <p>I have run these questions with other people in the past. LeetCode questions are more suited for backend
      interviews, and these were selected particularly because they suit the format of a backend interview.</p>

    <div v-for="l in leetcodes">
      <a target="_blank" :href="l.link">{{ l.title }}</a>
      <span :class="`capitalize ml-2 rounded-full px-2 py-0.5 bg-gray-100 ${difficultyColor[l.difficulty]}`">{{
        l.difficulty }}</span>
    </div>

  </Article>
</template>
