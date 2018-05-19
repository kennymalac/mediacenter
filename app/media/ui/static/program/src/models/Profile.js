import {Model, Collection, serializeIds} from './Model.js'
import {resolveInstances, paginatedList, get, manage} from './generics.js'
import {InterestCollection} from './Interest.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class ProfileModel extends Model {

    static initialState = {
        id: 0,
        display_name: "",
        title: "",
        description: "",
        picture: "",
        interests: []
    }

    static resource = 'profile'

    static fields = {
        interests: [InterestCollection]
    }

    static async manage(instance, form, collections) {
        return await manage(instance, {
            ...form,
            interests: serializeIds(form.interests)
        }, collections)
    }
}

export async function makeFilteredProfileCollection(queryset, interests) {
    let results = await Promise.all([
        interests(),
        queryset()
    ])

    const collection = new ProfileCollection([])
    await resolveInstances(
        collection,
        results[1],
        {interests: results[0]},
        [
            ['interests', results[0].get]
        ]
    )

    return collection
}

export async function makeProfileCollection() {
    return new ProfileCollection([])
}

class ProfileCollection extends Collection {
    static Model = ProfileModel

    static resource = 'profile'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections, [
            ['interests', collections.interests.get]
        ])
    }

    async list(page, collections) {
        return await paginatedList(this, page, collections)
    }

    static searchProfiles(params) {
        console.log(params)
        return fetchAPI(`profile/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
    }
}

export {ProfileModel, ProfileCollection}
