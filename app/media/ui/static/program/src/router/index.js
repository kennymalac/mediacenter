import Vue from 'vue'
import Router from 'vue-router'
import Feed from 'components/Feed'
import FeedContentStash from 'components/FeedContentStash'
import Register from 'components/Register'
import Login from 'components/Login'
import Profile from 'components/Profile/Profile'
import Chat from 'components/Chat'
import Home from 'components/Home'
import Interest from 'components/Interest'
import Gallery from 'components/Gallery'
import Album from 'components/Album'
import Group from 'components/Group/Group'
import Discussion from 'components/Discussion/Discussion'

Vue.use(Router)

function restAction(route) {
    // Validate action as valid action
    // TODO refine this later
    const validActions = ['create', 'list', 'manage', 'details', 'search']

    console.log(route)

    let isNested = false
    for (const match of route.matched) {
        if (match.parent) {
            isNested = true
            break
        }
    }

    // TODO better isNested detection
    if (isNested || !route.params.action || !validActions.includes(route.params.action)) {
        return {
            params: {...route.params},
            // objectName: route.meta.objectName,
            isNested: true
        }
    }

    if (route.params.action === 'manage' && !route.params.id) {
        console.log(route.params.action)
        console.log(route.params.id)
        throw new Error()
    }

    return {
        action: route.params.action,
        isNested: isNested,
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
            path: '/feed/:action',
            name: 'Feed',
            component: Feed,
            props: restAction,
            canReuse: false
        },
        {
            path: '/feed/:id/:action',
            name: 'Feed',
            component: Feed,
            props: restAction,
            canReuse: false
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
            path: '/profile/:action',
            name: 'Profile',
            component: Profile,
            props: restAction,
            canReuse: false
        },
        {
            path: '/profile/:id/:action',
            name: 'Profile',
            component: Profile,
            props: restAction,
            canReuse: false
        },
        {
            path: '/interest/:id/:action',
            name: 'Interest',
            component: Interest,
            props: restAction,
            canReuse: false
        },
        {
            path: '/group/:action',
            name: 'Group',
            component: Group,
            props: restAction,
            canReuse: false
        },
        {
            path: '/group/:groupId/:groupAction',
            name: 'Group',
            component: Group,
            props: restAction,
            canReuse: false,
            // meta: { objectName: 'group' },
            children: [
                {
                    path: 'stash/:stashId/:stashAction',
                    component: FeedContentStash,
                    props: restAction,
                    children: [
                        {
                            path: 'discussion/:discussionId/:discussionAction',
                            component: Discussion,
                            props: restAction
                        },
                        {
                            path: 'discussion/:discussionAction',
                            component: Discussion,
                            props: restAction
                            // meta: { objectName: 'discussion' }
                        }
                    ]
                }
            ]
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
