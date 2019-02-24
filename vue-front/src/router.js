import Vue from 'vue'
import Router from 'vue-router'
import AddSong from './components/AddSong.vue'
import Soundboard from './components/Soundboard.vue'

Vue.use(Router)

export default new Router({
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
    }
  ]
})
