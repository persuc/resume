import { createApp } from "vue";
import { createRouter, createWebHistory } from 'vue-router'
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/shades-of-purple.css'
import highlightCore from 'highlight.js/lib/core' // this line tells the following grammars where the types are
import cpp from 'highlight.js/lib/languages/cpp'
import assembly from 'highlight.js/lib/languages/armasm'
import python from 'highlight.js/lib/languages/python'
import App from "./App.vue"

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
    {
      path: '/blog/if-vs-ternary',
      name: "Simple Compiler Analysis",
      component: () => import('./views/blog/IfVsTernary.vue')
    },
    {
      path: '/blog/algs-in-three-levels',
      name: "Algorithms in Three Levels",
      component: () => import('./views/blog/AlgsInThreeLevels.vue')
    },
    {
      path: '/bored',
      name: "Bored",
      component: () => import('./views/Bored.vue')
    },
    {
      path: '/binary',
      name: "Word Pinpoint",
      component: () => import('./views/WordPinpoint.vue')
    },
    {
      path: '/word-pinpoint',
      name: "Word Pinpoint",
      component: () => import('./views/WordPinpoint.vue')
    },
    {
      path: '/missing-word',
      name: "Missing Word",
      component: () => import('./views/MissingWord.vue')
    },
    {
      path: '/blackout',
      name: "Blackout Poem",
      component: () => import('./views/BlackoutPoem.vue')
    },
    {
      path: '/solitaire',
      name: "Solitaire",
      component: () => import('./views/Solitaire.vue')
    },
    {
      path: '/draw',
      name: "Draw Mode",
      component: () => import('./views/DrawMode.vue')
    },
  ]
})

const app = createApp(App)
app.use(router)
app.use(VueHighlightJS, {
	languages: {
    assembly,
		cpp,
    python,
	}
});
app.mount('#app')