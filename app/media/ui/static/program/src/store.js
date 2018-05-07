import {collectionFactory} from './models/Model.js'
import {FeedCollection, makeFeedCollection} from './models/Feed.js'
import {FeedContentTypeCollection, makeFeedContentTypeCollection} from './models/FeedContentType.js'

const store = {
    feeds: {},
    feedContentTypes: {}
}

const proxiedStore = new Proxy(store, {})

const getStore = () => {
    return proxiedStore
}

const feedContentTypes = () => {
    return collectionFactory(
        getStore,
        'feedContentTypes',
        FeedContentTypeCollection,
        makeFeedContentTypeCollection
    )
}

const feeds = () => {
    return collectionFactory(
        getStore,
        'feeds',
        FeedCollection,
        () => makeFeedCollection(feedContentTypes)
    )
}

export {feedContentTypes, feeds}
