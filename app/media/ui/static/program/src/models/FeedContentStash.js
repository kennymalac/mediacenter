import {Model, Collection} from './Model.js'
import {serializeIds} from './serializers.js'
import {momentDate} from './converters.js'
// import {AccountCollection} from './Account'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {getNested, manageNested, paginatedListNested} from './generics.js'
import {FeedContentItemCollection} from './FeedContentItem'

export async function makeFeedContentStashCollection(deps) {
    return new FeedContentStashCollection([], deps)
}

class FeedContentStashModel extends Model {

    // static fields = {
    // }

    // static fieldConverters = {
    // }

    static initialState = {
        id: 0,
        created: {},
        name: '',
        description: '',
        content: []
    }

    static fields = {
        content: [FeedContentItemCollection]
    }

    static fieldConverters = {
        created: momentDate
    }

    static parentResource = 'feed'
    static resource = 'stash'

    constructor(instance, collections = {}) {
        const _collections = {
            content: new FeedContentItemCollection([])
        }
        super(instance, {
            ...collections,
            ..._collections
        })

        this.collections = _collections
    }

    static upload(feedId, form) {
        return fetchAPI(`feed/${feedId}/upload/`, {
            method: "POST",
            headers: makeHeaders({}),
            body: form
        })
    }

    static listContent(feedId, stashId, params) {
        console.log(params)
        return makeJsonRequest(`feed/${feedId}/stash/${stashId}/`, {
            method: "GET"
        })
            .then(jsonResponse)

            .then((data) => {
                // Returns a list of ContentItem model instances
                return data
                // return data.content.map((input) => modelInstance(FeedContentItemModel, input))
            })
    }

    static addContent(instance, feedId, content, collections = {}) {
        return makeJsonRequest(`feed/${feedId}/stash/${instance.id}/content/add/`, {
            method: "POST",
            body: {content: serializeIds(content)}
        })
            .then(jsonResponse)

            .then((data) => {
                // Append content ids that were added to the stash's instance list
                instance.collections.content.sync(instance, {
                    content: [].concat.apply(serializeIds(instance.content), data.content)
                }, collections)
            })
    }
}

class FeedContentStashCollection extends Collection {

    static Model = FeedContentStashModel

    static parentResource = 'feed'
    static resource = 'stash'

    async get(feedId, id, collections, instance = null) {
        return await getNested(this, id, feedId, instance, {...collections, ...this.collections})
    }

    async manage(instance, form, collections) {
        return await manageNested(this, instance, form.feed, form, collections)
    }

    async list(feedId, params, collections) {
        return await paginatedListNested(this, feedId, 0, {...collections, ...this.collections})
    }
}

export {FeedContentStashCollection, FeedContentStashModel}
