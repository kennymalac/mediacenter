import Vue from 'vue';
import Router from 'vue-router';
import Feed from 'components/Feed';
import Auth from 'components/Auth';
import Chat from 'components/Chat';
import Home from 'components/Home';
import Gallery from 'components/Gallery';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Media Center',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Auth,
            settings:
        },
        {
            path: '/register',
            name: 'Register',
            component: Auth,
            settings
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
});
