import Vue from 'vue'
import Router from 'vue-router'
import Feed from 'components/Feed'
import Auth from 'components/Auth'
import Chat from 'components/Chat'
import Home from 'components/Home'
import Gallery from 'components/Gallery'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/feed',
            name: 'Feed',
            component: Feed
        },
        {
            path: '/login',
            name: 'Login',
            component: Auth
        },
        {
            path: '/register',
            name: 'Register',
            component: Auth
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat
        },
        {
            path: '/gallery',
            name: 'Gallery',
            component: Gallery
        }
    ]
})
