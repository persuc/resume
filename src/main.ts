import { createApp } from "vue"
import { createRouter, createWebHistory } from 'vue-router'
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/atom-one-light.css'
import highlightCore from 'highlight.js/lib/core' // this line tells the following grammars where the types are
import assembly from 'highlight.js/lib/languages/armasm'
import bash from 'highlight.js/lib/languages/bash'
import cpp from 'highlight.js/lib/languages/cpp'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import ruby from 'highlight.js/lib/languages/ruby'
import App from "./App.vue"
import './index.css'
import { blogPosts } from "@/ts/blog"
import { games } from "@/ts/games"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/resume',
      name: 'Resume',
      component: () => import('./views/Resume.vue')
    },
    {
      path: '/accomplishments',
      name: "Accomplishments",
      component: () => import('./views/Accomplishments.vue')
    },
    {
      path: '/talents',
      name: "Talents",
      component: () => import('./views/Talents.vue')
    },
    {
      path: '/blog',
      name: "Blog",
      component: () => import('./views/blog/Blog.vue')
    },
    ...blogPosts.map(p => ({
      path: p.path,
      name: p.title,
      component: () => import(`./views/blog/${p.component}.vue`)
    })),
    {
      path: '/blog/thoughts',
      name: "Thoughts",
      component: () => import('./views/blog/Thoughts.vue')
    },
    {
      path: '/study',
      name: "Study",
      component: () => import('./views/Study.vue')
    },
    {
      path: '/wall',
      name: "Wall",
      component: () => import('./views/Wall.vue')
    },
    {
      path: '/bored',
      name: "Bored",
      component: () => import('./views/games/Bored.vue')
    },
    ...games.map(g => ({
      path: g.path,
      name: g.title,
      component: () => import(`./views/games/${g.component}.vue`)
    })),
    {
      path: '/quiz/:id',
      name: 'Quiz',
      component: () => import(`./views/games/Quizzes.vue`)
    },
    {
      path: '/components',
      name: "Components",
      component: () => import('./views/Components.vue')
    },
    {
      path: '/playlists',
      name: "Playlists",
      component: () => import('./views/Playlists.vue')
    },
    {
      path: '/tablature',
      name: "Tablature",
      component: () => import('./views/Tablature.vue')
    },
  ]
})

createApp(App)
  .use(router)
  .use(VueHighlightJS, {
    languages: {
      assembly,
      bash,
      cpp,
      javascript,
      python,
      ruby,
    }
  })
  .mount('#app')