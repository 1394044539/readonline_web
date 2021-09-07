import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import axios from 'axios'
import utils from './utils/util'
import dateUtils from './utils/dateUtils'
import apiMethods from './api'
import global from './mixins/global'
import myGlobal from './common/CustomizeGlobal'
import permission from './router/permission'

import 'element-ui/lib/theme-chalk/index.css'

import dowloadAxios from './utils/axios'

Vue.use(Element)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$dowloadAxios = dowloadAxios
Vue.prototype.$apiMethods = apiMethods
Vue.prototype.$utils = utils
Vue.prototype.$dateUtils = dateUtils
Vue.prototype.$store = store
Vue.prototype.$global=global
Vue.prototype.$myGlobal=myGlobal



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
