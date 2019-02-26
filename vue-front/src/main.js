import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueAWN from 'vue-awesome-notifications'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome-notifications/dist/styles/style.css'

Vue.use(BootstrapVue)
Vue.use(VueAWN)

Vue.config.productionTip = false

new Vue({
  router,
  data: {
    state: {}
  },
  render: h => h(App)
}).$mount('#app')
