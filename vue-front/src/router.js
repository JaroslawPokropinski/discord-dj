import Vue from 'vue'
import Router from 'vue-router'
import AddSong from './components/AddSong.vue'
import Soundboard from './components/Soundboard.vue'
import Login from './components/Login.vue'
import Speech from './components/Speech.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'dj',
      component: AddSong
    },
    {
      path: '/soundboard',
      name: 'soundboard',
      component: Soundboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/speech',
      name: 'speech',
      component: Speech
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    if (!router.app.$root || !router.app.$root.$data) {
      console.log('No this.$root')
      next('/login')
    } else if (to.name !== 'login' && (!router.app.$data.state.member || !router.app.$root.$data.state.guild)) {
      next('/login')
    } else {
      next()
    }
  }
})
export default router
