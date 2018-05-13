import {momentDate, modelInstance} from './converters.js'
import {Model, Collection, serializeIds} from './Model.js'
import {AccountModel} from './Account'
import {FeedContentTypeCollection} from './FeedContentType'
import {InterestCollection} from './Interest'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {FeedContentItemModel} from './FeedContentItem'

export function makeFeedCollection(feedContentTypes, interests) {
    return Promise.all([feedContentTypes(), interests(), FeedCollection.searchFeeds()])
        .then(results => {
            return new FeedCollection(results[2], {
                content_types: results[0],
                interests: results[1]
            })
        })
}

class FeedModel extends Model {

    static fields = {
        content_types: FeedContentTypeCollection,
        interests: InterestCollection
    }

    static fieldConverters = {
        created: momentDate,
        owner: (input) => modelInstance(AccountModel, input)
    }

    static initialState = {
        owner: {},
        id: 0,
        created: {},
        name: '',
        description: '',
        interests: [],
        content_types: []
    }

    // TODO make this a Store
    static manage(feed) {
        return makeJsonRequest(`feed/${feed.id}/`, {
            method: "PUT",
            body: {
                ...feed,
                content_types: serializeIds(feed.content_types),
                interests: serializeIds(feed.interests)
            }
        })
            .then(jsonResponse)

            .then((data) => {
                // NOTE faking instance for now
                const instance = {...data}
                instance.content_types = feed.content_types
                console.log(instance)
                return instance
            })
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
        return makeJsonRequest(`feed/${feedId}/content/`, {
            method: "GET"
        })
            .then(jsonResponse)

            .then((data) => {
                // Returns a list of ContentItem model instances
                return data.map((input) => modelInstance(FeedContentItemModel, input))
            })
    }
}

class FeedCollection extends Collection {

    static Model = FeedModel

    static get(id) {
        // TODO verify id is integer (typescript)
        return fetchAPI(`feed/${id}/`, {
            method: "GET"
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
            .catch((error) => {
                // TODO better error handling
                console.log(error)
            })
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
