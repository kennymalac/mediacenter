import Vue from 'vue'
import Router from 'vue-router'
import Feed from 'components/Feed'
import Register from 'components/Register'
import Login from 'components/Login'
import Chat from 'components/Chat'
import Home from 'components/Home'
import Gallery from 'components/Gallery'
import Album from 'components/Album'
import Group from 'components/Group/Group'

Vue.use(Router)

function restAction(route) {
    // Validate action as valid action
    // TODO refine this later
    const validActions = ['create', 'list', 'manage']

    if (!route.params.action || !validActions.includes(route.params.action)) {
        throw new Error()
    }

    if (route.params.action === 'manage' && !route.params.id) {
        console.log(route.params.action)
        console.log(route.params.id)
        throw new Error()
    }

    return {
        action: route.params.action,
        id: route.params.id
    }
}

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
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/group/:action',
            name: 'Group',
            component: Group,
            props: restAction,
            canReuse: false
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
            // children: [
            //     {
            //         path: 'album/:id',
            //         component: GalleryAlbum
            //     }
            // ]
        },
        {
            path: '/album/:id/:action',
            name: 'Album',
            component: Album,
            props: restAction,
            canReuse: false
        },
        {
            path: '/album/:action',
            name: 'Album',
            component: Album,
            props: restAction,
            canReuse: false
        }
            // children: [
                // {
                //     path: 'list',
                //     component: Album,
                //     props: { action: "list" }
                // },
                // {
                //     path: 'manage/:id',
                //     component: Album,
                //     props: { action: "manage" }
                // },
                // {
                //     path: 'create',
                //     component: Album,
                //     props: { action: "create" }
                // }
            //            ]
    ]
})
