import {resolve} from './Model.js'
import {makeJsonRequest, makeHeaders, fetchAPI, jsonResponse} from '../httputil.js'

async function manageResource(uri, collection, instance, serializedData, collections = {}) {
    return makeJsonRequest(uri, {
        method: "PATCH",
        body: serializedData
    })
        .then(jsonResponse)
        .then((data) => {
            collection.sync(instance, data, {...collections, ...collection.collections})
            return instance
        })
}

export function manage(collection, instance, serializedData, collections = {}) {
    return manageResource(`${instance.constructor.resource}/${instance.id}/`, collection, instance, serializedData, collections)
}

export function manageNested(collection, instance, parentId, serializedData, collections = {}) {
    return manageResource(`${instance.constructor.parentResource}/${parentId}/${instance.constructor.resource}/${instance.id}/`, collection, instance, serializedData, collections)
}

async function getResource(uri, collection, instance = null, collections = {}, children = []) {
    const headers = {}
    const item = await fetchAPI(`${uri}`, {
        method: "GET",
        headers: makeHeaders(headers)
    })
        .then(jsonResponse)

    return await resolveInstance(collection, item, instance, {...collections, ...collection.collections}, children)
}

export async function get(collection, id, instance = null, collections = {}, children = []) {
    return getResource(`${collection.constructor.resource}/${id}/`, collection, instance, collections, children)
}

export async function getNested(collection, id, parentId, instance = null, collections = {}, children = []) {
    console.log('depito', id, parentId, instance)
    return getResource(`${collection.constructor.parentResource}/${parentId}/${collection.constructor.resource}/${id}/`, collection, instance, collections, children)
}

export async function resolveInstance(collection, item, _instance = null, collections = {}, children = []) {
    const resolutions = []
    const instance = _instance === null
          ? collection.getInstance(item, collections)
          : _instance

    collection.sync(instance, item, {...collections, ...collection.collections})

    for (const [modelField, getter] of children) {
        resolutions.push(collection.resolveChildren(
            instance, modelField, getter, collections, instance
        ))
    }

    await resolve(resolutions)
    return instance
}

export async function resolveInstances(collection, items, collections = {}, children = []) {
    const instances = collection.getInstances(items, {...collections, ...collection.collections})
    const resolutions = []

    console.log(instances)

    for (let i = 0; i < items.length; i++) {
        const instance = instances[i]
        collection.sync(instance, items[i], collections)

        for (const [modelField, getter] of children) {
            resolutions.push(collection.resolveChildren(
                instance, modelField, getter, {...collections, ...collection.collections}, instance
            ))
        }
    }

    await resolve(resolutions)
    return instances
}

async function paginateListedResource(uri, collection, params, collections = {}, children = []) {
    let data = await fetchAPI(`${uri}`, {
        method: "GET",
        queryParams: params,
        headers: makeHeaders({})
    })
          .then(jsonResponse)

    let results
    if (Array.isArray(data)) {
        results = data
        return await resolveInstances(collection, results, collections, children)
    }
    else if (data.results) {
        results = data.results
        return { ...data, results: await resolveInstances(collection, results, {...collections, ...collection.collections}, children) }
    }
}

export function paginatedList(collection, params, collections = {}, children = []) {
    return paginateListedResource(`${collection.constructor.resource}/`, collection, params, collections, children)
}

export function paginatedListNested(collection, parentId, params, collections = {}, children = []) {
    return paginateListedResource(`${collection.constructor.parentResource}/${parentId}/${collection.constructor.resource}/`, collection, params, collections, children)
}

export async function makeFilteredCollection(CollectionType, queryset, _deps, resolutions = []) {
    let values = await queryset()
    let deps = []
    if (_deps) {
        deps = await _deps
    }

    const collection = new CollectionType([])

    await resolveInstances(
        collection,
        values,
        deps,
        resolutions
    )

    return collection
}
