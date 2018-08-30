import {Model, Collection} from './Model.js'
import {AccountCollection} from './Account'
import {FeedContentTypeCollection} from './FeedContentType.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'
import {momentDate, choice, visibilityChoices} from './converters.js'

class FeedContentItemModel extends Model {

    // NOTE: This can either be a FeedContentItem or FeedContentStashItem
    // The two primary keys between the two are not interchangeable!

    static initialState = {
        id: 0,
        object_id: 0,
        feed_id: 0,
        origin_stash_id: 0,
        group_id: 0,
        group_name: "",
        is_anonymous: false,
        is_local: false,
        last_child: {},
        post_count: 0,
        interests: [],
        places: [],
        comments: [],
        nested_object: {},
        content_type: {},
        created: {},
        description: "",
        owner: {},
        title: "",
        visibility: {}
    }

    static fields = {
        owner: AccountCollection,
        last_child: Collection,
        comments: [Collection],
        interests: [Collection],
        places: [Collection],
        content_type: FeedContentTypeCollection
    }

    static fieldConverters = {
        created: momentDate,
        visibility: (input) => choice(input, visibilityChoices)
    }
}

class FeedContentStashItemModel extends Model {
    static initialState = {
        id: 0,
        order: 0,
        is_pinned: false,
        item: {}
    }

    static fields = {
        item: Collection
    }
}

class FeedContentItemCollection extends Collection {

    static Model = FeedContentItemModel

    constructor(instance, collections = {}) {
        super(instance, collections)
        this.collections.last_child = this
    }
}

class FeedContentStashItemCollection extends Collection {

    static Model = FeedContentStashItemModel

    constructor(instance, collections = {}) {
        const _collections = {
            item: new FeedContentItemCollection([])
        }
        super(instance, {
            ...collections,
            ..._collections
        })

        this.collections = Object.assign({}, this.collections, _collections)
    }

    togglePin(instance, stashId, collections = {}) {
        // Only possible with stashed content
        return makeJsonRequest(`stash/${stashId}/content/${instance.id}/`, {
            method: "PATCH",
            body: { is_pinned: !instance.is_pinned }
        })
            .then(jsonResponse)

            .then((data) => {
                return this.sync(instance, {
                    ...data
                }, collections)
            })
    }
}

export {FeedContentItemModel, FeedContentStashItemModel, FeedContentStashItemCollection, FeedContentItemCollection}
