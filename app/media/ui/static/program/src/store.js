import {makeActiveUser} from './auth.js'
import {Store} from './comfyStore'

import {AccountCollection, makeAccountCollection} from './models/Account.js'
import {ProfileCollection, makeProfileCollection, makeFilteredProfileCollection} from './models/Profile.js'
import {FeedContentTypeCollection, makeFeedContentTypeCollection} from './models/FeedContentType.js'
import {CommentCollection, makeCommentCollection, ProfileCommentCollection, makeProfileCommentCollection} from './models/Comment.js'
import {InterestCollection, makeInterestCollection} from './models/Interest.js'
import {PlaceCollection, makePlaceCollection, makeFilteredPlaceCollection} from './models/Place.js'
import {FeedContentStashCollection, makeFeedContentStashCollection} from './models/FeedContentStash.js'
import {FeedCollection, makeFilteredFeedCollection} from './models/Feed.js'
import {DiscussionCollection, makeDiscussionCollection} from './models/Discussion.js'
import {LinkCollection, makeLinkCollection} from './models/Link.js'
import {GroupCollection, makeFilteredGroupCollection} from './models/Group.js'
import {AlbumCollection, makeFilteredAlbumCollection} from './models/Album.js'
import {ActivityLogCollection, makeFilteredActivityLogCollection} from './models/ActivityLog.js'

export const initialState = {
    activeUser: {},
    accounts: {},
    comments: {},
    profiles: {},
    profileComments: {},
    interestedUsers: {},
    interestId: 0,
    stashes: {},
    feeds: {},
    albums: {},
    feedContentTypes: {},
    interests: {},
    places: {},
    discussions: {},
    links: {},
    groups: {},
    groupFilterParams: {},
    filteredGroups: {},
    activityLogs: {},
    activityLogFilterParams: {},
    filteredActivityLogs: {}
}

const store = new Store(initialState)
let proxiedStore = new Proxy(store.store, {})

export const activeUserPlaces = store.deferredCollection(
    'activeUserPlaces',
    PlaceCollection,
    (deps) => {
        const {activeUser} = deps
        return makeFilteredPlaceCollection(
            () => PlaceCollection.all({ owner: activeUser.details.id }),
            deps
        )
    },
    {},
    ['activeUser']
)

export const activeUser = store.singleton(
    'activeUser',
    value => value.details && typeof value.details.id === "number" && value.details.id !== 0,
    makeActiveUser
)

export const accounts = store.singleton(
    'accounts',
    (value) => value instanceof AccountCollection,
    makeAccountCollection
)

export const feedContentTypes = store.singleton(
    'feedContentTypes',
    (value) => value instanceof FeedContentTypeCollection,
    makeFeedContentTypeCollection
)

export const comments = store.deferredCollection(
    'comments',
    CommentCollection,
    makeCommentCollection,
    {
        owner: 'accounts'
    }
)

export const interests = store.singleton(
    'interests',
    (value) => value instanceof InterestCollection,
    makeInterestCollection
)

export const places = store.singleton(
    'places',
    (value) => value instanceof PlaceCollection,
    makePlaceCollection
)

export const profiles = store.deferredCollection(
    'profiles',
    ProfileCollection,
    makeProfileCollection,
    {
        interests: 'interests',
        account: 'accounts',
        comments: 'profileComments'
    }
)

export const profileComments = store.deferredCollection(
    'profileComments',
    ProfileCommentCollection,
    makeProfileCommentCollection,
    {
        owner: 'accounts'
    }
)

store.singleton(
    'interestId',
    value => value !== undefined && value !== 0
)

export const interestedUsers = store.deferredCollection(
    'interestedUsers',
    ProfileCollection,
    (deps) => {
        const {interests, account, comments, interestId} = deps
        console.log(interestId)
        return makeFilteredProfileCollection(
            () => ProfileCollection.searchProfiles({
                interests: [interestId]
            }),
            {interests, account, comments}
        )
    },
    {
        interests: 'interests',
        account: 'accounts',
        comments: 'profileComments'
    },
    ['interestId']
)

export const stashes = store.singleton(
    'stashes',
    (value) => value instanceof FeedContentStashCollection,
    makeFeedContentStashCollection
)

export const feeds = store.singleton(
    'feeds',
    (value) => value instanceof FeedCollection,
    (deps) => {
        const {activeUser} = deps

        return makeFilteredFeedCollection(
            () => FeedCollection.all({ owner: activeUser.details.id }),
            feedContentTypes,
            stashes,
            interests,
            places,
            comments,
            accounts
        )
    },
    ['activeUser']
)

export const albums = store.singleton(
    'albums',
    (value) => value instanceof AlbumCollection,
    () => makeFilteredAlbumCollection(AlbumCollection.searchAlbums, accounts, profiles, feedContentTypes)
)

export const discussions = store.singleton(
    'discussions',
    (value) => value instanceof DiscussionCollection,
    makeDiscussionCollection
)

export const links = store.singleton(
    'links',
    (value) => value instanceof LinkCollection,
    makeLinkCollection
)

const groupCollection = (field, reducer, dependencies = []) => {
    return store.deferredCollection(field, GroupCollection, reducer, {
        feed: 'feeds',
        owner: 'accounts',
        members: 'accounts'
    }, dependencies)
}

const activeUserGroups = (deps) => {
    const {activeUser} = deps
    return makeFilteredGroupCollection(
        () => GroupCollection.list({ members: activeUser.details.id }),
        feeds,
        stashes,
        accounts,
        profiles,
        interests,
        places,
        feedContentTypes
    )
}

const filterGroups = (deps) => {
    const {groupFilterParams} = deps
    return makeFilteredGroupCollection(
        () => GroupCollection.searchGroups(groupFilterParams),
        feeds,
        stashes,
        accounts,
        profiles,
        interests,
        places,
        feedContentTypes
    )
}

store.singleton(
    'groupFilterParams',
    value => value !== undefined
)

export const groups = groupCollection('groups', activeUserGroups, ['activeUser'])
export const filteredGroups = groupCollection('filteredGroups', filterGroups, ['groupFilterParams'])

const activityLogCollection = (field, reducer, dependencies) => {
    return store.deferredCollection(field, ActivityLogCollection, reducer, {}, dependencies)
}

const activeUserActivityLogs = (deps) => {
    const {activeUser} = deps
    return makeFilteredActivityLogCollection(
        () => ActivityLogCollection.searchActivityLogs({ members: activeUser.details.id }),
        feeds,
        stashes,
        accounts,
        profiles,
        feedContentTypes
    )
}

store.singleton(
    'activityLogFilterParams',
    value => value !== undefined
)

const filterActivityLogs = (deps) => {
    const {activityLogFilterParams} = deps
    return makeFilteredActivityLogCollection(
        () => ActivityLogCollection.searchActivityLogs(activityLogFilterParams),
        feeds,
        stashes,
        accounts,
        profiles,
        feedContentTypes
    )
}

export const activityLogs = activityLogCollection('activityLogs', activeUserActivityLogs, ['activeUser'])
export const filteredActivityLogs = activityLogCollection('filteredActivityLogs', filterActivityLogs, ['activityLogFilterParams'])

export const storePlugin = {
    install(Vue) {
        Vue.prototype.$store = proxiedStore
        // for debugging
        window.store = store
        Vue.prototype.$resetStore = () => {
            for (const key of Object.keys(store)) {
                proxiedStore[key] = initialState[key]
            }
        }
    }
}
