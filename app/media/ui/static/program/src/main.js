// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRx from 'vue-rx'
import Program from './Program'
import router from './router'
import {storePlugin} from './store.js'

/* eslint-disable no-new */
Vue.use(storePlugin)
Vue.use(VueRx)

new Vue({
    el: '#program',
    router,
    template: '<Program/>',
    components: { Program }
})
