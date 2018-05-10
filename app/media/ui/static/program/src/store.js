import {makeCollection} from './models/Model.js'

import {AccountCollection, makeAccountCollection} from './models/Account.js'
import {FeedContentTypeCollection, makeFeedContentTypeCollection} from './models/FeedContentType.js'
import {InterestCollection, makeInterestCollection} from './models/Interest.js'
import {FeedCollection, makeFeedCollection} from './models/Feed.js'
import {DiscussionCollection, makeDiscussionCollection} from './models/Discussion.js'
import {GroupCollection, makeGroupCollection} from './models/Group.js'

const store = {
    accounts: {},
    feeds: {},
    feedContentTypes: {},
    interests: {},
    discussions: {},
    groups: {}
}

const proxiedStore = new Proxy(store, {})

const getStore = () => {
    return proxiedStore
}

export const accounts = () => {
    return makeCollection(
        getStore,
        'accounts',
        AccountCollection,
        makeAccountCollection
    )
}

export const feedContentTypes = () => {
    return makeCollection(
        getStore,
        'feedContentTypes',
        FeedContentTypeCollection,
        makeFeedContentTypeCollection
    )
}

export const interests = () => {
    return makeCollection(
        getStore,
        'interests',
        InterestCollection,
        makeInterestCollection
    )
}

export const feeds = () => {
    return makeCollection(
        getStore,
        'feeds',
        FeedCollection,
        () => makeFeedCollection(feedContentTypes, interests)
    )
}

export const discussions = () => {
    return makeCollection(
        getStore,
        'discussion',
        DiscussionCollection,
        makeDiscussionCollection
    )
}

export const groups = () => {
    return makeCollection(
        getStore,
        'group',
        GroupCollection,
        () => makeGroupCollection(accounts)
    )
}
