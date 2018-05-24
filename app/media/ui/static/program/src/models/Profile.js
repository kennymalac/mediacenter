import {Model, Collection, serializeIds} from './Model.js'
import {resolveInstances, paginatedList, get, manage} from './generics.js'
import {InterestCollection} from './Interest.js'
import {AccountCollection} from './Account.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class ProfileModel extends Model {

    static initialState = {
        id: 0,
        display_name: "",
        title: "",
        description: "",
        picture: "",
        interests: [],
        account: {}
    }

    static resource = 'profile'

    static fields = {
        interests: [InterestCollection],
        account: AccountCollection
    }

    static async manage(instance, form, collections) {
        return await manage(instance, {
            ...form,
            interests: serializeIds(form.interests),
            account: form.account.id
        }, collections)
    }
}

export async function makeFilteredProfileCollection(queryset, _interests, _accounts) {
    let [interests, accounts, values] = await Promise.all([
        _interests(),
        _accounts(),
        queryset()
    ])

    const collection = new ProfileCollection([])
    await resolveInstances(
        collection,
        values,
        {account: accounts, interests, friends: accounts},
        [
            ['interests', interests.get.bind(interests)]
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
        return await get(this, id, instance, collections)
    }

    async list(params, collections) {
        return await paginatedList(this, params, collections)
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
