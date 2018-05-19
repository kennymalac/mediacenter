import {resolve} from './Model.js'
import {makeJsonRequest, fetchAPI, jsonResponse} from '../httputil.js'

export async function manage(instance, serializedData, collections = {}) {
    return makeJsonRequest(`${instance.constructor.resource}/${instance.id}/`, {
        method: "PATCH",
        body: serializedData
    })
        .then(jsonResponse)
        .then((data) => {
            instance.sync(data, collections)
            return instance
        })
}

export async function get(collection, id, instance = null, collections = {}, children = []) {
    return await fetchAPI(`${collection.constructor.resource}/${id}/`, {
        method: "GET"
    })
        .then(jsonResponse)

        .then((data) => {
            const _instance = instance === null
                  ? collection.getInstance(data, collections)
                  : instance

            _instance.sync(data, collections)
            return _instance
        })
        .catch((error) => {
            // TODO better error handling
            console.log(error)
        })
}

export async function resolveInstances(collection, items, collections = {}, children = []) {
    const instances = collection.getInstances(items, collections)
    const resolutions = []

    console.log(instances)

    for (let i = 0; i < items.length; i++) {
        const instance = instances[i]
        instance.sync(items[i], collections)

        for (const [modelField, getter] of children) {
            resolutions.push(instance.resolveChildren(
                modelField, collection => getter
            ))
        }
    }

    await resolve(resolutions)
    return instances
}

export async function paginatedList(collection, page, collections = {}, children = []) {
    console.log(page)

    const data = await fetchAPI(`${collection.constructor.resource}/`, {
        method: "GET"
    })
          .then(jsonResponse)

    return await resolveInstances(collection, data, collections, children)
}
