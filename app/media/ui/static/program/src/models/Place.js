import {momentDate} from './converters.js'
import {Model, Collection} from './Model.js'
import {get, manage, paginatedList, resolveInstances} from './generics.js'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'

export async function makePlaceCollection() {
    const collection = new PlaceCollection([])
    return collection
}

export async function makeFilteredPlaceCollection(queryset, _accounts) {
    let [accounts, values] = await Promise.all(
        [_accounts(), queryset()]
    )

    const collection = new PlaceCollection([])

    await resolveInstances(
        collection,
        values,
        { owner: accounts },
        // stashes: results[2]
    )

    return collection
}

class PlaceModel extends Model {

    static fields = {
        owner: Collection,
        default_feed: Collection
    }

    static fieldConverters = {
        created: momentDate
    }

    static resource = 'place'

    static initialState = {
        owner: {},
        default_feed: {},
        id: 0,
        created: {},
        name: '',
        description: ''
    }

    static manage(instance, form, collections) {
        return manage(instance, {
            ...form,
            owner: form.owner.id
        }, collections)
    }

    static upload(placeId, form) {
        return fetchAPI(`place/${placeId}/upload/`, {
            method: "POST",
            headers: makeHeaders({}),
            body: form
        })
    }
}

class PlaceCollection extends Collection {

    static Model = PlaceModel

    static resource = 'place'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections)
    }

    connect(form, collections) {
        return makeJsonRequest("place/connect/", {
            method: "POST",
            body: {
                ...form
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = this.addInstance({
                    ...createdData
                }, collections)

                return instance
            })
    }

    static all(params = {}) {
        return makeJsonRequest(`place/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
    }

    async list(params, collections) {
        return await paginatedList(this, params, collections, [
            ['owner', collections.accounts.get.bind(collections.accounts)]
        ])
    }

    getActiveUserPlaces(activeUser, collections) {
        return makeJsonRequest(`place/`, {
            method: "GET",
            queryParams: { owner: activeUser.details.id }
        })
            .then(jsonResponse)
            .then((data) => {
                const instances = this.addInstances(data, collections)

                return instances
            })
    }
}

export {PlaceCollection, PlaceModel}
