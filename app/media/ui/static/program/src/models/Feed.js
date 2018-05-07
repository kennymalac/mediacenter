import {Model, Collection, serializeIds} from './Model.js'
import {FeedContentTypeCollection} from './FeedContentType'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'

export function makeFeedCollection(feedContentTypes) {
    return Promise.all([feedContentTypes(), FeedCollection.searchFeeds()])
        .then(results => {
            return new FeedCollection(results[1], {
                content_types: results[0]
            })
        })
}

class FeedModel extends Model {

    static fields = {
        content_types: FeedContentTypeCollection
    }

    static initialState = {
        id: 0,
        name: '',
        description: '',
        tags: [],
        interests: [],
        subjects: [],
        content_types: []
    }

    // TODO make this a Store
    static manage(feed) {
        return makeJsonRequest(`feed/${feed.id}/`, {
            method: "PUT",
            body: {
                ...feed, content_types: serializeIds(feed.content_types)
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
                return data
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
                ...data, content_types: serializeIds(data.content_types)
            }
        })
            .then(jsonResponse)
            .then((created) => {
                const instance = new FeedModel({...created, content_types: data.content_types})

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
