// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Program from './Program'
import router from './router'

/* eslint-disable no-new */
new Vue({
    el: '#program',
    router,
    template: '<Program/>',
    components: { Program }
})
