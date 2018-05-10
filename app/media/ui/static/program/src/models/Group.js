import {modelInstance} from './converters.js'
import {Model, Collection, serializeIds} from './Model.js'
import {FeedModel} from './Feed'
import {AccountCollection} from './Account.js'

import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'

export function makeGroupCollection(accounts) {
    return Promise.all([accounts(), GroupCollection.searchGroups()])
        .then((results) => {
            return new GroupCollection(results[1], {
                members: results[0]
            })
        })
}

class GroupModel extends Model {

    static fields = {
        // TODO nested feed model
        // fields only works for lists, not a single item
        members: AccountCollection
    }

    static fieldConverters = {
        feed: (input) => modelInstance(FeedModel, input)
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
    static manage(instance, form) {
        return makeJsonRequest(`group/${instance.id}/`, {
            method: "PATCH",
            body: {
                ...form,
                members: serializeIds(form.members),
                feed: {...form.feed, interests: serializeIds(form.feed.interests)}
            }
        })
            .then(jsonResponse)
            .then((data) => {
                instance.sync(data, form)
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
                ...data, members: serializeIds(data.members)
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = new GroupModel({...createdData, members: data.members})

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
