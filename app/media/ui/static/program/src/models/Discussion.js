import {Model, Collection} from './Model.js'
import {modelInstance} from './converters.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'
import {FeedContentItemModel} from './FeedContentItem'

export function makeDiscussionCollection() {
    return DiscussionCollection.searchDiscussions().then((items) => {
        return new DiscussionCollection(items)
    })
}

class DiscussionModel extends Model {

    static initialState = {
        id: 0,
        content_item: {},
        text: "",
        order: 0,
        parent: 0
    }

    static fieldConverters = {
        content_item: (input) => modelInstance(FeedContentItemModel, input)
    }

    static manage(discussion) {
        return makeJsonRequest(`discussion/${discussion.id}/`, {
            method: "PUT",
            body: {
                ...discussion
            }
        })
            .then(jsonResponse)
            .then((data) => {
                for (const [key, val] of Object.entries(data)) {
                    // TODO this has to work properly with model fields
                    discussion[key] = val
                }
            })
    }
}

class DiscussionCollection extends Collection {

    static Model = DiscussionModel

    static get(id) {
        // TODO verify id is integer (typescript)
        // TODO attach auth headers
        return fetchAPI(`discussion/${id}/`, {
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
        return makeJsonRequest("discussion/", {
            method: "POST",
            body: {
                ...data
            }
        })
            .then(jsonResponse)
            .then((created) => {
                const instance = new DiscussionModel(created)

                console.log(instance)
                return instance
            })
    }

    static searchDiscussions(params) {
        return fetchAPI(`discussion/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

export {DiscussionCollection, DiscussionModel}
