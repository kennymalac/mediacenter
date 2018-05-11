import {makeActiveUser} from './auth.js'
import makeSingleton from './singleton.js'

import {AccountCollection, makeAccountCollection} from './models/Account.js'
import {ProfileCollection, makeProfileCollection} from './models/Profile.js'
import {FeedContentTypeCollection, makeFeedContentTypeCollection} from './models/FeedContentType.js'
import {InterestCollection, makeInterestCollection} from './models/Interest.js'
import {FeedCollection, makeFeedCollection} from './models/Feed.js'
import {DiscussionCollection, makeDiscussionCollection} from './models/Discussion.js'
import {GroupCollection, makeGroupCollection} from './models/Group.js'
import {AlbumCollection, makeAlbumCollection} from './models/Album.js'

const store = {
    activeUser: {},
    accounts: {},
    profiles: {},
    interestedUsers: {},
    interestId: 0,
    feeds: {},
    albums: {},
    feedContentTypes: {},
    interests: {},
    discussions: {},
    groups: {}
}

const proxiedStore = new Proxy(store, {})

export const storePlugin = {
    install(Vue) {
        Vue.prototype.$store = proxiedStore
    }
}

const getStore = () => {
    return proxiedStore
}

const singleton = (field, typeCheck, create) => makeSingleton(getStore, field, typeCheck, create)

export const activeUser = () => {
    return singleton(
        'activeUser',
        (value) => value.id !== undefined && value.id !== 0,
        makeActiveUser
    )
}

export const accounts = () => {
    return singleton(
        'accounts',
        (value) => value instanceof AccountCollection,
        makeAccountCollection
    )
}

export const feedContentTypes = () => {
    return singleton(
        'feedContentTypes',
        (value) => value instanceof FeedContentTypeCollection,
        makeFeedContentTypeCollection
    )
}

export const interests = () => {
    return singleton(
        'interests',
        (value) => value instanceof InterestCollection,
        makeInterestCollection
    )
}

export const profiles = () => {
    return singleton(
        'profiles',
        (value) => value instanceof ProfileCollection,
        () => makeProfileCollection(ProfileCollection.all, interests)
    )
}

export const interestedUsers = (interestId) => {
    return singleton(
        'interestedUsers',
        (value) => value instanceof ProfileCollection,
        () => {
            return makeProfileCollection(
                () => ProfileCollection.searchProfiles({
                    interests: [interestId]
                }),
                interests
            )
        }
    )
}

export const feeds = () => {
    return singleton(
        'feeds',
        (value) => value instanceof FeedCollection,
        () => makeFeedCollection(feedContentTypes, interests)
    )
}

export const albums = () => {
    return singleton(
        'albums',
        (value) => value instanceof AlbumCollection,
        makeAlbumCollection
    )
}

export const discussions = () => {
    return singleton(
        'discussion',
        (value) => value instanceof DiscussionCollection,
        makeDiscussionCollection
    )
}

export const groups = () => {
    return singleton(
        'group',
        (value) => value instanceof GroupCollection,
        () => makeGroupCollection(accounts, activeUser)
    )
}
