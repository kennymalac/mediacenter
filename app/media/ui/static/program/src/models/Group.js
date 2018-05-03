import {Model} from './Model.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'

class GroupCollection {
    static get(id) {
        // TODO verify id is integer (typescript)
        // TODO attach auth headers
        return fetchAPI(`group/${id}/`, {
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
        return makeJsonRequest("group/", {
            method: "POST",
            body: {
                ...data
            }
        })
            .then(jsonResponse)
    }

    static searchGroups(params) {
        return fetchAPI(`group/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

class GroupModel extends Model {

    static initialState = {
        id: 0,
        name: "",
        description: "",
        rules: [],
        members: [],
        image: ""
    }

    // TODO make this a Store
    static manage(group) {
        return makeJsonRequest(`group/${group.id}/`, {
            method: "PUT",
            body: {
                ...group
            }
        })
    }
}

export {GroupCollection, GroupModel}
