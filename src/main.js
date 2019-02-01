import Vue from 'vue'
import VModal from 'vue-js-modal'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VModal, { dynamic: true })

new Vue({
  render: h => h(App),
}).$mount('#app')
