import Vue from 'vue'
import Router from 'vue-router'
import AddSong from './components/AddSong.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: AddSong
    }
  ]
})
