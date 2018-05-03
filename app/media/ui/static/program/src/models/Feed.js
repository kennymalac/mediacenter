import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'

class FeedCollection {
    static get(id) {
        // TODO verify id is integer (typescript)
        // TODO attach auth headers
        return fetchAPI(`feed/${id}`, {
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

    static create(data) {
        return makeJsonRequest("feed/", {
            method: "POST",
            body: {
                ...data
            }
        })
            .then(jsonResponse)
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

class FeedModel {

    static initialState = {
        id: null,
        name: '',
        description: '',
        tags: [],
        interests: [],
        subjects: []
    }

    // TODO make this a Store
    static manage(feed) {
        return makeJsonRequest(`feed/${feed.id}/`, {
            method: "PUT",
            body: {
                ...feed
            }
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

export {FeedCollection, FeedModel}
