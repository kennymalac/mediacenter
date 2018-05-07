import {collectionFactory} from './models/Model.js'
import {FeedCollection, makeFeedCollection} from './models/Feed.js'
import {FeedContentTypeCollection, makeFeedContentTypeCollection} from './models/FeedContentType.js'
import {DiscussionCollection, makeDiscussionCollection} from './models/Discussion.js'

const store = {
    feeds: {},
    feedContentTypes: {},
    discussions: {}
}

const proxiedStore = new Proxy(store, {})

const getStore = () => {
    return proxiedStore
}

export const feedContentTypes = () => {
    return collectionFactory(
        getStore,
        'feedContentTypes',
        FeedContentTypeCollection,
        makeFeedContentTypeCollection
    )
}

export const feeds = () => {
    return collectionFactory(
        getStore,
        'feeds',
        FeedCollection,
        () => makeFeedCollection(feedContentTypes)
    )
}

export const discussions = () => {
    return collectionFactory(
        getStore,
        'discussion',
        DiscussionCollection,
        makeDiscussionCollection
    )
}
