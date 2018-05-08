import {Model, Collection} from './Model.js'
// import {FeedModel} from './models.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'

export function makeGroupCollection() {
    return GroupCollection.searchGroups().then((items) => {
        return new GroupCollection(items)
    })
}

class GroupModel extends Model {

    static fields = {
        // TODO nested feed model
        // fields only works for lists, not a single item
    }

    static initialState = {
        id: 0,
        feed: {},
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

class GroupCollection extends Collection {
    static Model = GroupModel

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
            .then((created) => {
                const instance = new GroupModel(created)

                console.log(instance)
                return instance
            })
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

export {GroupCollection, GroupModel}
