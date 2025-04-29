import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ContentView from '../views/ContentView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: ContentView,
  },
  {
    path: '/:pageLink(.*.html)',
    name: 'page',
    component: ContentView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
