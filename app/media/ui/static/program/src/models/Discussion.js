// import {Model} from './Model.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'

class DiscussionCollection {
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
    }
}

export {DiscussionCollection}
