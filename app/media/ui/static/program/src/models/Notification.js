import {Model, Collection} from './Model.js'
import {get, paginatedList, resolveInstances} from './generics.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'

export function makeNotificationCollection(deps) {
    return new NotificationCollection([], deps)
}

export async function makeFilteredNotificationCollection(queryset, deps) {
    const collection = makeNotificationCollection(deps)
    await filterNotificationCollection(
        collection,
        queryset,
        deps
    )
    return collection
}

export async function filterNotificationCollection(collection, queryset, deps) {
    const values = await queryset()

    await resolveInstances(
        collection,
        values,
        deps
    )
}

class NotificationModel extends Model {

    static initialState = {
        id: 0,
        subtype: "",
        message: "",
        log: {},
        context: {}
    }

    static fields = {
        log: Collection
    }

    static resource = 'notification'

}

class NotificationCollection extends Collection {

    static Model = NotificationModel

    static resource = 'notification'

    static all(params = {}) {
        return makeJsonRequest(`notification/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
            .then((data) => {
                return data.results
            })
    }

    async get(id, collections, instance = null) {
        return await get(this, id, instance)
    }

    async list(params, collections) {
        return await paginatedList(this, params, collections)
    }
}

export {NotificationCollection, NotificationModel}
