import {resolve} from './Model.js'
import {makeJsonRequest, fetchAPI, jsonResponse} from '../httputil.js'

async function manageResource(uri, instance, serializedData, collections = {}) {
    return makeJsonRequest(uri, {
        method: "PATCH",
        body: serializedData
    })
        .then(jsonResponse)
        .then((data) => {
            instance.sync(data, collections)
            return instance
        })
}

export function manage(instance, serializedData, collections = {}) {
    return manageResource(`${instance.constructor.resource}/${instance.id}/`, instance, serializedData, collections)
}

export function manageNested(instance, parentId, serializedData, collections = {}) {
    return manageResource(`${instance.constructor.parentResource}/${parentId}/${instance.constructor.resource}/${instance.id}/`, instance, serializedData, collections)
}

async function getResource(uri, collection, instance = null, collections = {}, children) {
    return await fetchAPI(`${uri}`, {
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

export async function get(collection, id, instance = null, collections = {}, children = []) {
    return getResource(`${collection.constructor.resource}/${id}/`, collection, instance, collections, children)
}

export async function getNested(collection, id, parentId, instance = null, collections = {}, children = []) {
    return getResource(`${collection.constructor.parentResource}/${parentId}/${collection.constructor.resource}/${id}/`, collection, instance, collections, children)
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

async function paginateListedResource(uri, collection, page, collections = {}, children = []) {
    console.log(page)

    const data = await fetchAPI(`${uri}`, {
        method: "GET"
    })
          .then(jsonResponse)

    return await resolveInstances(collection, data, collections, children)
}

export async function paginatedList(collection, page, collections = {}, children = []) {
    return paginateListedResource(`${collection.constructor.resource}/`, collection, page, collections, children)
}

export async function paginatedListNested(collection, parentId, page, collections = {}, children = []) {
    return paginateListedResource(`${collection.constructor.parentResource}/${parentId}/${collection.constructor.resource}/`, collection, page, collections, children)
}

