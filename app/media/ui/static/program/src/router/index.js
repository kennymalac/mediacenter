import Vue from 'vue';
import Router from 'vue-router';
import Feed from 'components/Feed';
import {Login, Register} from 'components/Auth';
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
            component: Auth
        },
        {
            path: '/register',
            name: 'Login',
            component: Auth
        },
        {
            path: '/gallery',
            name: 'Gallery',
            component: Gallery
        }
    ]
});
