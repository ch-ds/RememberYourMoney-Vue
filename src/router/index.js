import Vue from 'vue'
import VueRouter from 'vue-router'
const Index = () => import('../views/Index.vue')
const Demo = () => import('../views/Demo.vue')
const Home = () => import('../components/Home.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/demo',
    component: Demo
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    redirect: '/home',
    children: [
      { path: '/home', component: Home }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
