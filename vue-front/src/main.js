import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

// const store = {
//   state: {
//     memberId: undefined,
//     guildId: undefined
//   },
//   setMemberId (id) {
//     this.state.memberId = id
//   },
//   getMemberId (id) {
//     return this.state.memberId
//   },
//   setGuildId (id) {
//     this.state.guildId = id
//   },
//   getGuildId (id) {
//     return this.state.guildId
//   }
// }

new Vue({
  router,
  data: {
    state: {}
  },
  render: h => h(App)
}).$mount('#app')
