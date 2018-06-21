import {resolve} from './Model.js'
import {makeJsonRequest, makeHeaders, fetchAPI, jsonResponse} from '../httputil.js'

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

async function getResource(uri, collection, instance = null, collections = {}, children = []) {
    const headers = {}
    const item = await fetchAPI(`${uri}`, {
        method: "GET",
        headers: makeHeaders(headers)
    })
        .then(jsonResponse)

    return await resolveInstance(collection, item, instance, collections, children)
}

export async function get(collection, id, instance = null, collections = {}, children = []) {
    return getResource(`${collection.constructor.resource}/${id}/`, collection, instance, collections, children)
}

export async function getNested(collection, id, parentId, instance = null, collections = {}, children = []) {
    console.log('depito')
    return getResource(`${collection.constructor.parentResource}/${parentId}/${collection.constructor.resource}/${id}/`, collection, instance, collections, children)
}

export async function resolveInstance(collection, item, _instance = null, collections = {}, children = []) {
    const resolutions = []
    const instance = _instance === null
          ? collection.getInstance(item, collections)
          : _instance

    instance.sync(item, collections)

    for (const [modelField, getter] of children) {
        resolutions.push(instance.resolveChildren(
            modelField, getter, collections, instance
        ))
    }

    await resolve(resolutions)
    return instance
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
                modelField, getter, collections, instance
            ))
        }
    }

    await resolve(resolutions)
    return instances
}

async function paginateListedResource(uri, collection, params, collections = {}, children = []) {
    let data = await fetchAPI(`${uri}`, {
        method: "GET",
        queryParams: params
    })
          .then(jsonResponse)

    let results
    if (Array.isArray(data)) {
        results = data
        return await resolveInstances(collection, results, collections, children)
    }
    else if (data.results) {
        results = data.results
        return { ...data, results: await resolveInstances(collection, results, collections, children) }
    }
}

export async function paginatedList(collection, params, collections = {}, children = []) {
    return paginateListedResource(`${collection.constructor.resource}/`, collection, params, collections, children)
}

export async function paginatedListNested(collection, parentId, params, collections = {}, children = []) {
    return paginateListedResource(`${collection.constructor.parentResource}/${parentId}/${collection.constructor.resource}/`, collection, params, collections, children)
}

