import { createApp } from "vue";
import { createRouter, createWebHistory } from 'vue-router'
import App from "./App.vue";

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
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')