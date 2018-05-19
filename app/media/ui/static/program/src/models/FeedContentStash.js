import {Model, Collection} from './Model.js'
import {momentDate, modelInstance} from './converters.js'
// import {AccountCollection} from './Account'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {get, manage, paginatedList} from './generics.js'
import {FeedContentItemModel} from './FeedContentItem'

export async function makeFeedContentStashCollection(queryset) {
    const stashes = await queryset()
    return new FeedContentStashCollection(stashes)
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

    static fieldConverters = {
        created: momentDate
    }

    static resource = 'content-stash'

    static async manage(instance, form, collections) {
        return await manage(instance, form, collections)
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
                return data.content.map((input) => modelInstance(FeedContentItemModel, input))
            })
    }
}

class FeedContentStashCollection extends Collection {

    static Model = FeedContentStashModel

    static resource = 'content-stash'

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    async list(feedId, params, collections) {
        return await paginatedList(this, 0, collections)
    }

}

export {FeedContentStashCollection, FeedContentStashModel}
