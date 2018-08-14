import Vue from 'vue'
import Router from 'vue-router'
import Feed from 'components/Feed'
import FeedContentStash from 'components/FeedContentStash'
import Register from 'components/Register'
import Login from 'components/Login'
// import MediaUpload from 'components/MediaUpload'
import Place from 'components/Place/Place'
import Profile from 'components/Profile/Profile'
//import Chat from 'components/Chat'
import Home from 'components/Home'
import Interest from 'components/Interest'
import Gallery from 'components/Gallery'
import Album from 'components/Album'
import Group from 'components/Group/Group'
import Discussion from 'components/Discussion/Discussion'
import Link from 'components/Link'
import Image from 'components/Image'
import Comment from 'components/Comment/Comment'

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

    if (!isNested && !route.params.action && Object.keys(route.params).length === 1) {
        return {
            action: 'list',
            query: {...route.query},
            isNested: isNested,
            id: route.params.id
        }
    }

    // TODO better isNested detection
    if (isNested || !validActions.includes(route.params.action)) {
        return {
            params: {...route.params},
            query: {...route.query},
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
        query: {...route.query},
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
            path: '/feed/:action?',
            name: 'Feed',
            component: Feed,
            props: restAction,
            canReuse: false
        },
        {
            path: '/feed/:feedId/:feedAction',
            name: 'Feed',
            component: Feed,
            props: restAction,
            canReuse: false,
            children: [
                {
                    path: 'stash/:stashId/:stashAction',
                    component: FeedContentStash,
                    props: restAction,
                    children: [
                        {
                            path: 'link/:linkId/:linkAction',
                            component: Link,
                            props: restAction,
                            children: [
                                {
                                    path: 'comment/:commentId/:commentAction',
                                    component: Comment,
                                    props: restAction
                                },
                                {
                                    path: 'comment/:commentAction',
                                    component: Comment,
                                    props: restAction
                                }
                            ]
                        },
                        {
                            path: 'link/:linkAction',
                            component: Link,
                            props: restAction
                        },
                        {
                            path: 'image/:imageId/:imageAction',
                            component: Image,
                            props: restAction,
                            children: [
                                {
                                    path: 'comment/:commentId/:commentAction',
                                    component: Comment,
                                    props: restAction
                                },
                                {
                                    path: 'comment/:commentAction',
                                    component: Comment,
                                    props: restAction
                                }
                            ]
                        },
                        {
                            path: 'image/:imageAction',
                            component: Image,
                            props: restAction
                        }
                    ]
                }
            ]
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
        // {
        //     path: '/media',
        //     name: 'MediaUpload',
        //     component: MediaUpload
        // },
        {
            path: '/place/:action?',
            name: 'Place',
            props: restAction,
            component: Place
        },
        {
            path: '/place/:action?',
            name: 'Place',
            props: restAction,
            component: Place
        },
        {
            path: '/place/:placeId/:placeAction',
            name: 'PlaceNested',
            component: Place,
            props: restAction,
            canReuse: false,
            // meta: { objectName: 'place' },
            children: [
                {
                    path: 'feed/:feedId/:feedAction',
                    name: 'PlaceFeed',
                    component: Feed,
                    props: restAction,
                    canReuse: false
                },
                {
                    path: 'group/:groupAction',
                    name: 'PlaceGroup',
                    component: Group,
                    props: restAction,
                    canReuse: false
                }
            ]
        },
        {
            path: '/profile/:action?',
            name: 'Profiles',
            component: Profile,
            props: restAction,
            canReuse: false
        },
        {
            path: '/profile/:profileId/:profileAction',
            name: 'Profile',
            component: Profile,
            props: restAction,
            canReuse: false,
            children: [
                {
                    path: 'comment/:commentId/:commentAction',
                    component: Comment,
                    props: restAction
                },
                {
                    path: 'comment/:commentAction',
                    component: Comment,
                    props: restAction
                }
            ]
        },
        {
            path: '/interest/:id/:action',
            name: 'Interest',
            component: Interest,
            props: restAction,
            canReuse: false
        },
        {
            path: '/group/:action?',
            name: 'Group',
            component: Group,
            props: restAction,
            canReuse: false
        },
        {
            path: '/group/:groupId/:groupAction',
            name: 'GroupNested',
            component: Group,
            props: restAction,
            canReuse: false,
            // meta: { objectName: 'group' },
            children: [
                {
                    name: 'GroupStash',
                    path: 'stash/:stashId/:stashAction',
                    component: FeedContentStash,
                    props: restAction,
                    children: [
                        {
                            name: 'GroupLinkNested',
                            path: 'link/:linkId/:linkAction',
                            component: Link,
                            props: restAction,
                            children: [
                                {
                                    path: 'comment/:commentId/:commentAction',
                                    component: Comment,
                                    props: restAction
                                },
                                {
                                    path: 'comment/:commentAction',
                                    component: Comment,
                                    props: restAction
                                }
                            ]
                        },
                        {
                            path: 'link/:linkAction',
                            component: Link,
                            props: restAction
                        },
                        {
                            name: 'GroupImageNested',
                            path: 'image/:imageId/:imageAction',
                            component: Image,
                            props: restAction,
                            children: [
                                {
                                    path: 'comment/:commentId/:commentAction',
                                    component: Comment,
                                    props: restAction
                                },
                                {
                                    path: 'comment/:commentAction',
                                    component: Comment,
                                    props: restAction
                                }
                            ]
                        },
                        {
                            path: 'image/:imageAction',
                            component: Image,
                            props: restAction
                        },
                        {
                            name: 'GroupDiscussionNested',
                            path: 'discussion/:discussionId/:discussionAction',
                            component: Discussion,
                            props: restAction
                        },
                        {
                            name: 'GroupDiscussion',
                            path: 'discussion/:discussionAction',
                            component: Discussion,
                            props: restAction
                            // meta: { objectName: 'discussion' }
                        }
                    ]
                }
            ]
        },
        // {
        //     path: '/chat',
        //     name: 'Chat',
        //     component: Chat
        // },
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
            path: '/album/:action?',
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
