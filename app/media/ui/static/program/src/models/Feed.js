import {modelInstance, momentDate} from './converters.js'
import {Model, Collection, serializeIds} from './Model.js'
import {get, manage, paginatedList} from './generics.js'
import {AccountCollection} from './Account'
import {FeedContentTypeCollection} from './FeedContentType'
import {InterestCollection} from './Interest'
import {FeedContentStashCollection} from './FeedContentStash'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {FeedContentItemModel} from './FeedContentItem'

export function makeFeedCollection(queryset, feedContentTypes, interests) {
    return Promise.all([feedContentTypes(), interests(), queryset()])
        .then(results => {
            return new FeedCollection(results[2], {
                content_types: results[0],
                interests: results[1]
                // stashes: results[2]
            })
        })
}

class FeedModel extends Model {

    static fields = {
        content_types: [FeedContentTypeCollection],
        owner: AccountCollection,
        interests: [InterestCollection],
        stashes: [FeedContentStashCollection]
    }

    static fieldConverters = {
        created: momentDate
    }

    static initialState = {
        owner: {},
        id: 0,
        created: {},
        name: '',
        description: '',
        stashes: [],
        interests: [],
        content_types: []
    }

    static manage(instance, form, collections) {
        return manage(instance, {
            ...form,
            content_types: serializeIds(form.content_types),
            interests: serializeIds(form.interests)
        }, collections)
    }

    static upload(feedId, form) {
        return fetchAPI(`feed/${feedId}/upload/`, {
            method: "POST",
            headers: makeHeaders({}),
            body: form
        })
    }

    static listItems(feedId, params) {
        console.log(params)
        return makeJsonRequest(`content/search/`, {
            method: "POST",
            body: {feed: feedId}
        })
            .then(jsonResponse)

            .then((data) => {
                // Returns a list of ContentItem model instances
                return data.results.map((input) => modelInstance(FeedContentItemModel, input))
            })
    }
}

class FeedCollection extends Collection {

    static Model = FeedModel

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    static create(data, store) {
        return makeJsonRequest("feed/", {
            method: "POST",
            body: {
                ...data,
                content_types: serializeIds(data.content_types),
                interests: serializeIds(data.interests)
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = new FeedModel({...createdData, content_types: data.content_types, interests: data.interests})

                console.log(instance)
                return instance
            })
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['owner', collections.accounts.get],
            ['interests', collections.interests.get]
//            ['stashes', collections.stashes.get]
        ])
    }

    static searchFeeds(params) {
        return fetchAPI(`feed/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

export {FeedCollection, FeedModel}
