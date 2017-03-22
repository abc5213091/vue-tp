/* global document */

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import dialog from './components/dialog'


require('../css/style.less')

sync(store, router)

const app = new Vue({
    router,
    store,
    ...App
})

/*公共组件*/
Vue.component('xdialog',dialog)

app.$mount('#App')

