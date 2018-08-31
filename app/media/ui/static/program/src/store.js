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
import {ImageCollection, makeImageCollection} from './models/Image.js'
import {GroupCollection, makeGroupCollection, filterGroupCollection} from './models/Group.js'
import {AlbumCollection, makeFilteredAlbumCollection} from './models/Album.js'
import {ActivityLogCollection, makeActivityLogCollection, filterActivityLogCollection} from './models/ActivityLog.js'

export const initialState = {
    loggedIn: false,
    activeUserPlaces: {},
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
    images: {},
    groups: {},
    feedContentItemListSortingOption: "-updated",
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
    {
        owner: 'accounts',
        default_feed: 'feeds'
    },
    ['activeUser']
)

export const activeUser = store.singleton(
    'activeUser',
    value => value.details && typeof value.details.id === "number" && value.details.id !== 0,
    makeActiveUser
)

store.singleton(
    'loggedIn',
    value => value
)

export const accounts = store.deferredCollection(
    'accounts',
    AccountCollection,
    makeAccountCollection,
    {
        'member_groups': 'groups',
        'profile': 'profiles'
    }
)

export const feedContentTypes = store.deferredCollection(
    'feedContentTypes',
    FeedContentTypeCollection,
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

export const interests = store.deferredCollection(
    'interests',
    InterestCollection,
    makeInterestCollection
)

export const places = store.deferredCollection(
    'places',
    PlaceCollection,
    makePlaceCollection,
    {
        owner: 'accounts',
        default_feed: 'feeds'
    }
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

export const stashes = store.deferredCollection(
    'stashes',
    FeedContentStashCollection,
    makeFeedContentStashCollection,
    {
        owner: 'accounts',
        comments: 'comments',
        interests: 'interests',
        places: 'places',
        content_type: 'feedContentTypes'
    }
)

export const feeds = store.deferredCollection(
    'feeds',
    FeedCollection,
    (deps) => {
        const {activeUser} = deps

        return makeFilteredFeedCollection(
            () => FeedCollection.all({ owner: activeUser.details.id }),
            deps
        )
    },
    {
        content_types: 'feedContentTypes',
        stashes: 'stashes',
        places: 'places',
        comments: 'comments',
        interests: 'interests',
        owner: 'accounts'
    },
    ['activeUser']
)

export const albums = store.deferredCollection(
    'albums',
    AlbumCollection,
    () => makeFilteredAlbumCollection(AlbumCollection.searchAlbums, accounts, profiles, feedContentTypes)
)

export const discussions = store.deferredCollection(
    'discussions',
    DiscussionCollection,
    makeDiscussionCollection
)

export const links = store.deferredCollection(
    'links',
    LinkCollection,
    makeLinkCollection
)

export const images = store.deferredCollection(
    'images',
    ImageCollection,
    makeImageCollection
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

    const collection = makeGroupCollection(deps)
    filterGroupCollection(
        collection,
        () => GroupCollection.list({ members: activeUser.details.id }),
        deps
    )
    return collection
}

const filterGroups = (deps) => {
    const {groupFilterParams} = deps
    const collection = makeGroupCollection(deps)
    filterGroupCollection(
        collection,
        () => GroupCollection.searchGroups(groupFilterParams),
        deps
    )
    return collection
}

store.singleton(
    'groupFilterParams',
    value => value !== undefined
)

export const feedContentItemListSortingOption = store.singleton(
    'feedContentItemListSortingOption',
    value => value !== undefined,
    () => '-updated'
)

export const groups = groupCollection('groups', activeUserGroups, ['activeUser'])
export const filteredGroups = groupCollection('filteredGroups', filterGroups, ['groupFilterParams'])

const activityLogCollection = (field, reducer, dependencies) => {
    return store.deferredCollection(field, ActivityLogCollection, reducer, {
        'author': 'accounts'
    }, dependencies)
}

const activeUserActivityLogs = (deps) => {
    const {activeUser} = deps
    const collection = makeActivityLogCollection(deps)
    filterActivityLogCollection(
        collection,
        () => ActivityLogCollection.searchActivityLogs({ members: activeUser.details.id }),
        deps
    )
    return collection
}

store.singleton(
    'activityLogFilterParams',
    value => value !== undefined
)

const filterActivityLogs = (deps) => {
    const {activityLogFilterParams} = deps
    const collection = makeActivityLogCollection(deps)
    filterActivityLogCollection(
        collection,
        () => ActivityLogCollection.searchActivityLogs(activityLogFilterParams),
        deps
    )
    return collection
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
