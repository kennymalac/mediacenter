import {makeActiveUser} from './auth.js'
import makeSingleton from './singleton.js'

import {AccountCollection, makeAccountCollection} from './models/Account.js'
import {ProfileCollection, makeProfileCollection, makeFilteredProfileCollection} from './models/Profile.js'
import {FeedContentTypeCollection, makeFeedContentTypeCollection} from './models/FeedContentType.js'
import {CommentCollection, makeCommentCollection, ProfileCommentCollection, makeProfileCommentCollection} from './models/Comment.js'
import {InterestCollection, makeInterestCollection} from './models/Interest.js'
import {FeedContentStashCollection, makeFeedContentStashCollection} from './models/FeedContentStash.js'
import {FeedCollection, makeFilteredFeedCollection} from './models/Feed.js'
import {DiscussionCollection, makeDiscussionCollection} from './models/Discussion.js'
import {LinkCollection, makeLinkCollection} from './models/Link.js'
import {GroupCollection, makeFilteredGroupCollection} from './models/Group.js'
import {AlbumCollection, makeFilteredAlbumCollection} from './models/Album.js'
import {ActivityLogCollection, makeFilteredActivityLogCollection} from './models/ActivityLog.js'

const store = {
    activeUser: {},
    accounts: {},
    profiles: {},
    profileComments: {},
    interestedUsers: {},
    interestId: 0,
    stashes: {},
    feeds: {},
    albums: {},
    feedContentTypes: {},
    interests: {},
    discussions: {},
    links: {},
    groups: {},
    filteredGroups: {},
    activityLogs: {},
    filteredActivityLogs: {}
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

const singletonFactory = (field, FieldType, reducer) => {
    return singleton(
        field,
        (value) => value instanceof FieldType,
        reducer
    )
}

export const activeUser = () => {
    return singleton(
        'activeUser',
        value => value.details && value.details.id !== undefined && value.details.id !== 0,
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

export const comments = () => {
    return singleton(
        'comments',
        (value) => value instanceof CommentCollection,
        makeCommentCollection
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
        () => makeProfileCollection()
    )
}

export const profileComments = () => {
    return singleton(
        'profileComments',
        (value) => value instanceof ProfileCommentCollection,
        makeProfileCommentCollection
    )
}

export const interestedUsers = (interestId) => {
    return singleton(
        'interestedUsers',
        (value) => value instanceof ProfileCollection,
        () => {
            return makeFilteredProfileCollection(
                () => ProfileCollection.searchProfiles({
                    interests: [interestId]
                }),
                interests,
                accounts
            )
        }
    )
}

export const stashes = () => {
    return singleton(
        'stashes',
        (value) => value instanceof FeedContentStashCollection,
        makeFeedContentStashCollection
    )
}

export const feeds = () => {
    return singleton(
        'feeds',
        (value) => value instanceof FeedCollection,
        () => {
            return activeUser().then((user) => {
                return makeFilteredFeedCollection(
                    () => FeedCollection.all({ owner: user.details.id }),
                    feedContentTypes,
                    stashes,
                    interests,
                    comments,
                    accounts
                )
            })
        }
    )
}

export const albums = () => {
    return singleton(
        'albums',
        (value) => value instanceof AlbumCollection,
        () => makeFilteredAlbumCollection(AlbumCollection.searchAlbums, accounts, profiles, feedContentTypes)
    )
}

export const discussions = () => {
    return singleton(
        'discussions',
        (value) => value instanceof DiscussionCollection,
        makeDiscussionCollection
    )
}

export const links = () => {
    return singleton(
        'links',
        (value) => value instanceof LinkCollection,
        makeLinkCollection
    )
}

const groupStore = (field, reducer) => (params) => {
    return singletonFactory(field, GroupCollection, () => reducer(params))
}

const activeUserGroups = () => {
    return activeUser().then((user) => {
        return makeFilteredGroupCollection(
            () => GroupCollection.list({ members: user.details.id }),
            feeds,
            stashes,
            accounts,
            profiles,
            interests,
            feedContentTypes
        )
    })
}

const filterGroups = (params) => {
    console.log(params)
    return makeFilteredGroupCollection(
        () => GroupCollection.searchGroups(params),
        feeds,
        stashes,
        accounts,
        profiles,
        interests,
        feedContentTypes
    )
}

export const groups = groupStore('groups', activeUserGroups)
export const filteredGroups = groupStore('filteredGroups', filterGroups)

const activityLogStore = (field, reducer) => (params) => {
    return singletonFactory(field, ActivityLogCollection, () => reducer(params))
}

const activeUserActivityLogs = () => {
    return activeUser().then((user) => {
        return makeFilteredActivityLogCollection(
            () => ActivityLogCollection.searchActivityLogs({ members: user.details.id }),
            feeds,
            stashes,
            accounts,
            profiles,
            feedContentTypes
        )
    })
}

const filterActivityLogs = (params) => {
    console.log(params)
    return makeFilteredActivityLogCollection(
        () => ActivityLogCollection.searchActivityLogs(params),
        feeds,
        stashes,
        accounts,
        profiles,
        feedContentTypes
    )
}

export const activityLogs = activityLogStore('activityLogs', activeUserActivityLogs)
export const filteredActivityLogs = activityLogStore('filteredActivityLogs', filterActivityLogs)
