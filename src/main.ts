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
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')