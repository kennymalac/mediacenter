import {Model, Collection} from './Model.js'
import {serializeIds} from './serializers.js'
import {resolveInstances, paginatedList, get, manage} from './generics.js'
import {InterestCollection} from './Interest.js'
import {AccountCollection} from './Account.js'
import {fetchAPI, jsonResponse, makeHeaders} from '../httputil.js'

import BackgroundMixin from './BackgroundMixin.js'

class ProfileModel extends Model {

    static initialState = {
        ...BackgroundMixin,
        id: 0,
        display_name: "",
        title: "",
        description: "",
        picture: "",
        interests: [],
        account: {},
        comments: []
    }

    static resource = 'profile'

    static fields = {
        interests: [InterestCollection],
        account: AccountCollection,
        comments: [Collection]
    }
}

export async function makeFilteredProfileCollection(queryset, deps) {
    const {interests, account} = deps

    const collection = new ProfileCollection([], deps)
    await resolveInstances(
        collection,
        await queryset(),
        {account, interests, friends: account},
        [
            ['interests', interests.get.bind(interests)]
        ]
    )

    return collection
}

export async function makeProfileCollection(deps) {
    return new ProfileCollection([], deps)
}

class ProfileCollection extends Collection {
    static Model = ProfileModel

    static resource = 'profile'

    async manage(instance, form, collections) {
        return await manage(this, instance, {
            ...form,
            interests: serializeIds(form.interests),
            account: form.account.id
        }, collections)
    }

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections)
    }

    async list(params, collections) {
        return await paginatedList(this, params, collections)
    }

    static searchProfiles(params) {
        return fetchAPI(`profile/`, {
            method: "GET",
            queryParams: params,
            headers: makeHeaders({})
        })
            .then(jsonResponse)
    }
}

export {ProfileModel, ProfileCollection}
