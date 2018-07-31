import {Model, Collection} from './Model.js'
import {serializeIds} from './serializers.js'
import {momentDate} from './converters.js'
// import {AccountCollection} from './Account'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {getNested, manageNested, paginatedListNested} from './generics.js'
import {FeedContentStashItemCollection} from './FeedContentItem'

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
        content: [Collection]
    }

    static fieldConverters = {
        created: momentDate
    }

    static parentResource = 'feed'
    static resource = 'stash'

    constructor(instance, collections = {}) {
        const _collections = {
            content: new FeedContentStashItemCollection([])
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

    static async listContent(instance, feedId, params, collections = {}, offset = 0) {
        console.log(instance, params)
        const stashId = instance.id

        try {
            const data = await makeJsonRequest(`feed/${feedId}/stash/${stashId}/content/`, {
                method: "GET",
                queryParams: params
            }).then(jsonResponse)

            collections.stashes.sync(instance, {
                content: [].concat.apply(instance.content, data.content.results)
            }, collections)

            let order = 0 + offset
            return {
                ...data.content,
                results: instance.collections.content.getInstances(data.content.results).map((item) => {
                    item.order = order++
                    return item
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    static async addContent(instance, feedId, content, collections = {}) {
        try {
            const data = await makeJsonRequest(`feed/${feedId}/stash/${instance.id}/content/add/`, {
                method: "POST",
                body: {content: serializeIds(content)}
            }).then(jsonResponse)

            collections.stashes.sync(instance, {
                content: [].concat.apply(instance.content, data.content.results)
            }, collections)

            return instance.content
        }
        catch (e) {
            console.log(e)
        }
    }
}

class FeedContentStashCollection extends Collection {

    static Model = FeedContentStashModel

    static parentResource = 'feed'
    static resource = 'stash'

    async get(feedId, id, collections, instance = null) {
        return await getNested(this, id, feedId, instance, {...collections, ...collections})
    }

    async manage(instance, form, collections) {
        return await manageNested(this, instance, form.feed, form, collections)
    }

    async list(feedId, params, collections) {
        return await paginatedListNested(this, feedId, 0, {...collections, ...this.collections})
    }
}

export {FeedContentStashCollection, FeedContentStashModel}
